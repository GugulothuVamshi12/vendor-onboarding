import { useRegisteredVendors } from "./hooks/useRegisteredVendors";
import type { VendorCategory } from "./types";

const CATEGORIES: VendorCategory[] = [
  "Staffing Agency",
  "Freelance Platform",
  "Consultant",
];

type Props = {
  /** Increment after a vendor is created so this panel refetches independently. */
  refreshSignal: number;
};

export default function RegisteredVendors({ refreshSignal }: Props) {
  const {
    vendors,
    loading,
    error,
    filterCategory,
    setFilterCategory,
    approve,
  } = useRegisteredVendors(refreshSignal);

  return (
    <section className="card" aria-labelledby="list-heading">
      <h2 id="list-heading">Registered vendors</h2>

      <div className="toolbar">
        <div>
          <label htmlFor="filter-category">Filter by category</label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(ev) =>
              setFilterCategory(ev.target.value as "" | VendorCategory)
            }
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <span className="muted">Loading…</span>
        ) : (
          <span className="muted">{vendors.length} vendor(s)</span>
        )}
      </div>

      {error ? (
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      ) : null}

      {!loading && vendors.length === 0 ? (
        <p className="empty">No vendors yet. Add one using the form.</p>
      ) : null}

      {vendors.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Email</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.category}</td>
                  <td>
                    <a href={`mailto:${v.contact_email}`}>{v.contact_email}</a>
                  </td>
                  <td>
                    <span
                      className={
                        v.status === "Approved"
                          ? "badge badge-approved"
                          : "badge badge-pending"
                      }
                    >
                      {v.status}
                    </span>
                  </td>
                  <td>
                    {v.status === "Pending Approval" ? (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => void approve(v.id)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
