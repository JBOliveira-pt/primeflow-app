import { generateReceiptPdf, type ReceiptPdfData } from "@/app/lib/receipt-pdf";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data: ReceiptPdfData = await request.json();
        const pdfBuffer = await generateReceiptPdf(data);
        const body = new Uint8Array(pdfBuffer);

        return new NextResponse(body, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 },
        );
    }
}
