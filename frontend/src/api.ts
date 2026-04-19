import type { Vendor, VendorCategory } from "./types";

export type { Vendor, VendorCategory } from "./types";

/** Dev: proxied by Vite to FastAPI. Set VITE_API_BASE to call the API directly. */
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim() || "/api";

export interface VendorCreatePayload {
  name: string;
  category: VendorCategory;
  contact_email: string;
}

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) {
    return res.statusText || `Request failed (${res.status})`;
  }
  try {
    const data = JSON.parse(text) as { detail?: unknown };
    const { detail } = data;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((item: { msg?: string }) => item?.msg)
        .filter(Boolean)
        .join("; ");
    }
  } catch {
    /* not JSON */
  }
  return text;
}

export async function fetchVendors(category?: VendorCategory): Promise<Vendor[]> {
  const url = new URL(`${API_BASE}/vendors`, window.location.origin);
  if (category) {
    url.searchParams.set("category", category);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<Vendor[]>;
}

export async function createVendor(payload: VendorCreatePayload): Promise<Vendor> {
  const res = await fetch(`${API_BASE}/vendors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<Vendor>;
}

export async function approveVendor(id: number): Promise<Vendor> {
  const res = await fetch(`${API_BASE}/vendors/${id}/approve`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<Vendor>;
}
