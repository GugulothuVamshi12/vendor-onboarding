import { useCallback, useEffect, useState } from "react";
import { approveVendor, fetchVendors } from "../api";
import type { Vendor, VendorCategory } from "../types";

type Filter = "" | VendorCategory;

/**
 * Fetches the vendor table independently of the registration form.
 * `refreshSignal` bumps (e.g. after a new vendor is created elsewhere) to reload the list.
 */
export function useRegisteredVendors(
  refreshSignal: number,
): {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  filterCategory: Filter;
  setFilterCategory: (value: Filter) => void;
  reload: () => Promise<void>;
  approve: (id: number) => Promise<void>;
} {
  const [filterCategory, setFilterCategory] = useState<Filter>("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVendors(
        filterCategory === "" ? undefined : filterCategory,
      );
      setVendors(data);
    } catch (e) {
      setVendors([]);
      setError(
        e instanceof Error ? e.message : "Could not load registered vendors.",
      );
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    void reload();
  }, [reload, refreshSignal]);

  const approve = useCallback(
    async (id: number) => {
      setError(null);
      try {
        await approveVendor(id);
        await reload();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not approve vendor.",
        );
      }
    },
    [reload],
  );

  return {
    vendors,
    loading,
    error,
    filterCategory,
    setFilterCategory,
    reload,
    approve,
  };
}
