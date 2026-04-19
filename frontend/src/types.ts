export type VendorCategory =
  | "Staffing Agency"
  | "Freelance Platform"
  | "Consultant";

export interface Vendor {
  id: number;
  name: string;
  category: VendorCategory;
  contact_email: string;
  status: string;
}
