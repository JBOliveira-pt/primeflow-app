// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

// ========================================
// Organization Types
// ========================================
export type Organization = {
    id: string;
    name: string;
    slug: string;
    owner_id: string | null;
    created_at: string;
    updated_at: string;
};

// ========================================
// User Types
// ========================================
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    image_url: string;
    role?: "admin" | "user";
    organization_id?: string; // ✅ Adicionado
};

// ========================================
// Customer Types
// ========================================
export type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    organization_id?: string; // ✅ Adicionado
    created_by?: string; // UUID do user que criou
};

export type CustomerField = {
    id: string;
    name: string;
};

export type CustomersTableType = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    created_by: string | null;
    total_invoices: number;
    total_pending: number;
    total_paid: number;
};

export type FormattedCustomersTable = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    created_by: string | null;
    total_invoices: number;
    total_pending: string; // ✅ Formatado como string
    total_paid: string; // ✅ Formatado como string
};

// ========================================
// Invoice Types
// ========================================
export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
    status: "pending" | "paid";
    organization_id?: string; // ✅ Adicionado
    created_by?: string; // UUID do user que criou
};

export type InvoiceForm = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    status: "pending" | "paid";
};

export type InvoicesTable = {
    id: string;
    customer_id: string;
    name: string;
    email: string;
    image_url: string;
    date: string;
    amount: number;
    status: "pending" | "paid";
};

export type LatestInvoice = {
    id: string;
    name: string;
    image_url: string;
    email: string;
    amount: string;
    date: string;
    status: "pending" | "paid";
};

export type LatestInvoiceRaw = Omit<LatestInvoice, "amount" | "date"> & {
    amount: number;
    date: string;
};

// ========================================
// Revenue Types
// ========================================
export type Revenue = {
    month: string;
    revenue: number;
    organization_id?: string; // ✅ Adicionado
};
