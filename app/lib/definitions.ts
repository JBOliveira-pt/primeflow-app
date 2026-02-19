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
    organization_id?: string;
};

// ========================================
// Customer Types
// ========================================
export type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
    organization_id?: string;
    created_by?: string;
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
    total_pending: number;
    total_paid: number;
};

// ========================================
// Invoice Types
// ========================================
export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    status: "pending" | "paid";
    organization_id?: string;
    created_by?: string;
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
    amount: number;
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
    organization_id?: string;
};
