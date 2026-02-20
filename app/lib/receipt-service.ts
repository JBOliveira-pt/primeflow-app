import postgres from "postgres";
import { auth } from "@clerk/nextjs/server";
import { canEditResource, isUserAdmin } from "./auth-helpers";
import { uploadReceiptPdfToR2 } from "./r2-storage";
import type { ReceiptPdfData } from "./receipt-pdf.tsx";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const TAX_REGIME = "Regime de isencao [art. 53 - ate EUR 15K/ano]";
const IRS_WITHHOLDING =
    "Sem retencao - Nao residente, sem estabelecimento ou particular";
const PAYMENT_METHOD = "Transferencia bancaria";

function toDateString(date: Date) {
    return date.toISOString().split("T")[0];
}

async function generateReceiptNumber(): Promise<number> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const candidate = Math.floor(100000 + Math.random() * 900000);
        const exists = await sql<{ id: string }[]>`
            SELECT id FROM receipts WHERE receipt_number = ${candidate}
        `;

        if (exists.length === 0) {
            return candidate;
        }
    }

    throw new Error("Failed to generate receipt number");
}

function ensureNotFuture(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
        throw new Error("Data de recebimento nao pode ser futura.");
    }
}

export async function createReceiptForPaidInvoice(invoiceId: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const invoiceRows = await sql<
        {
            id: string;
            status: "pending" | "paid";
            amount: number;
            customer_id: string;
            organization_id: string;
            activity_code: string | null;
            payment_date: string | null;
        }[]
    >`SELECT id, status, amount, customer_id, organization_id, activity_code, payment_date FROM invoices WHERE id = ${invoiceId}`;

    const invoice = invoiceRows[0];
    if (!invoice) {
        throw new Error("Invoice not found");
    }

    console.log("📊 Invoice found:", {
        id: invoice.id,
        status: invoice.status,
        amount: invoice.amount,
        activity_code: invoice.activity_code,
    });

    if (invoice.status !== "paid") {
        console.log("⚠️ Invoice status is not 'paid':", invoice.status);
        return null;
    }

    const existingReceipt = await sql<
        { id: string }[]
    >`SELECT id FROM receipts WHERE invoice_id = ${invoiceId}`;

    if (existingReceipt.length > 0) {
        console.log(
            "⚠️ Receipt already exists for this invoice:",
            existingReceipt[0].id,
        );
        return existingReceipt[0].id;
    }

    const issuerRows = await sql<
        { id: string; name: string; email: string; iban: string | null }[]
    >`SELECT id, name, email, iban FROM users WHERE organization_id = ${invoice.organization_id} AND role = 'admin' LIMIT 1`;

    const issuer = issuerRows[0];
    if (!issuer) {
        throw new Error("Admin not found in organization");
    }

    console.log("👤 Issuer found:", {
        id: issuer.id,
        name: issuer.name,
        iban: issuer.iban ? "***" : "NOT SET",
    });

    if (!issuer.iban) {
        throw new Error("IBAN do administrador obrigatorio para criar recibo.");
    }

    const receiptNumber = await generateReceiptNumber();
    const today = toDateString(new Date());
    const receivedDate = invoice.payment_date || today;

    const inserted = await sql<{ id: string }[]>`INSERT INTO receipts (
            receipt_number,
            invoice_id,
            customer_id,
            organization_id,
            created_by,
            status,
            received_date,
            amount,
            payment_method,
            issuer_iban,
            activity_code,
            tax_regime,
            irs_withholding
        )
        VALUES (
            ${receiptNumber},
            ${invoice.id},
            ${invoice.customer_id},
            ${invoice.organization_id},
            ${issuer.id},
            'pending_send',
            ${receivedDate},
            ${invoice.amount},
            ${PAYMENT_METHOD},
            ${issuer.iban},
            ${invoice.activity_code},
            ${TAX_REGIME},
            ${IRS_WITHHOLDING}
        )
        RETURNING id
    `;

    return inserted[0]?.id || null;
}

export async function updateReceiptDetails(
    receiptId: string,
    activityCode: string,
    receivedDate: string,
) {
    ensureNotFuture(receivedDate);

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const receiptRows = await sql<
        { invoice_id: string; status: "pending_send" | "sent_to_customer" }[]
    >`SELECT invoice_id, status FROM receipts WHERE id = ${receiptId}`;

    if (!receiptRows[0]) {
        throw new Error("Receipt not found");
    }

    if (receiptRows[0].status === "sent_to_customer") {
        throw new Error("Receipt already sent");
    }

    const invoiceRows = await sql<
        { created_by: string | null }[]
    >`SELECT created_by FROM invoices WHERE id = ${receiptRows[0].invoice_id}`;

    const canEdit = await canEditResource(invoiceRows[0]?.created_by ?? null);
    if (!canEdit) {
        throw new Error("Unauthorized");
    }

    await sql`
        UPDATE receipts
        SET activity_code = ${activityCode},
            received_date = ${receivedDate},
            updated_at = now()
        WHERE id = ${receiptId}
    `;
}

export async function sendReceipt(receiptId: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const receiptRows = await sql<
        {
            id: string;
            receipt_number: number;
            invoice_id: string;
            status: "pending_send" | "sent_to_customer";
            received_date: string;
            amount: number;
            activity_code: string | null;
            tax_regime: string;
            irs_withholding: string;
            issuer_iban: string;
            created_by: string | null;
        }[]
    >`SELECT id, receipt_number, invoice_id, status, received_date, amount, activity_code, tax_regime, irs_withholding, issuer_iban, created_by
      FROM receipts WHERE id = ${receiptId}`;

    const receipt = receiptRows[0];
    if (!receipt) {
        throw new Error("Receipt not found");
    }

    if (receipt.status !== "pending_send") {
        throw new Error("Receipt already sent");
    }

    if (!receipt.activity_code) {
        throw new Error("Atividade exercida obrigatoria.");
    }

    ensureNotFuture(receipt.received_date);

    const invoiceRows = await sql<
        {
            id: string;
            date: string;
            created_by: string | null;
            customer_id: string;
        }[]
    >`SELECT id, date, created_by, customer_id FROM invoices WHERE id = ${receipt.invoice_id}`;

    const invoice = invoiceRows[0];
    if (!invoice) {
        throw new Error("Invoice not found");
    }

    const isAdmin = await isUserAdmin();
    const canSend = isAdmin || (await canEditResource(invoice.created_by));
    if (!canSend) {
        throw new Error("Unauthorized");
    }

    const customerRows = await sql<
        {
            name: string;
            nif: string | null;
            endereco_fiscal: string | null;
        }[]
    >`SELECT name, nif, endereco_fiscal FROM customers WHERE id = ${invoice.customer_id}`;

    let issuerRows: { name: string; email: string }[] = [];
    if (receipt.created_by) {
        issuerRows = await sql<
            { name: string; email: string }[]
        >`SELECT name, email FROM users WHERE id = ${receipt.created_by}`;
    }

    if (issuerRows.length === 0) {
        issuerRows = await sql<
            { name: string; email: string }[]
        >`SELECT name, email FROM users WHERE clerk_user_id = ${userId}`;
    }

    const issuer = issuerRows[0];
    if (!issuer) {
        throw new Error("Issuer not found");
    }

    const customer = customerRows[0];
    if (!customer) {
        throw new Error("Customer not found");
    }

    const today = toDateString(new Date());

    const pdfData: ReceiptPdfData = {
        receiptNumber: receipt.receipt_number,
        issueDate: today,
        receivedDate: receipt.received_date,
        issuer: {
            name: issuer.name,
            email: issuer.email,
            iban: receipt.issuer_iban,
        },
        customer: {
            name: customer.name,
            nif: customer.nif,
            endereco_fiscal: customer.endereco_fiscal,
        },
        invoice: {
            id: invoice.id,
            amount: receipt.amount,
            date: invoice.date,
        },
        fiscal: {
            activityCode: receipt.activity_code,
            taxRegime: receipt.tax_regime,
            irsWithholding: receipt.irs_withholding,
        },
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/receipts/pdf`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pdfData),
        },
    );

    if (!response.ok) {
        throw new Error("Failed to generate PDF");
    }

    const pdfBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(pdfBuffer);

    const pdfUrl = await uploadReceiptPdfToR2(
        buffer,
        receipt.id,
        receipt.receipt_number,
    );

    await sql`
        UPDATE receipts
        SET status = 'sent_to_customer',
            pdf_url = ${pdfUrl},
            sent_at = now(),
            updated_at = now()
        WHERE id = ${receipt.id}
    `;

    return pdfUrl;
}
