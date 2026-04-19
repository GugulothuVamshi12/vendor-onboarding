import { useState } from "react";
import { createVendor, type VendorCategory } from "./api";
import RegisteredVendors from "./RegisteredVendors";

const CATEGORIES: VendorCategory[] = [
  "Staffing Agency",
  "Freelance Platform",
  "Consultant",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = Partial<Record<"name" | "category" | "contact_email", string>>;

export default function App() {
  const [listRefreshSignal, setListRefreshSignal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>("Staffing Agency");
  const [contactEmail, setContactEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  function validateForm(): boolean {
    const next: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = contactEmail.trim();

    if (!trimmedName) {
      next.name = "Name is required.";
    }
    if (!trimmedEmail) {
      next.contact_email = "Email is required.";
    } else if (!EMAIL_RE.test(trimmedEmail)) {
      next.contact_email = "Enter a valid email address.";
    }
    if (!CATEGORIES.includes(category)) {
      next.category = "Choose a category.";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validateForm()) {
      return;
    }
    setSubmitting(true);
    try {
      await createVendor({
        name: name.trim(),
        category,
        contact_email: contactEmail.trim(),
      });
      setName("");
      setContactEmail("");
      setFieldErrors({});
      setListRefreshSignal((n) => n + 1);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to register vendor.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header>
        <h1>Vendor Onboarding</h1>
        <p className="subtitle">
          Register staffing agencies, freelance platforms, and consultants for
          your hiring team.
        </p>
      </header>

      <div className="layout">
        <section className="card" aria-labelledby="register-heading">
          <h2 id="register-heading">Register a vendor</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="vendor-name">Name</label>
              <input
                id="vendor-name"
                name="name"
                type="text"
                autoComplete="organization"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "err-name" : undefined}
              />
              {fieldErrors.name ? (
                <p className="field-error" id="err-name">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="vendor-category">Category</label>
              <select
                id="vendor-category"
                name="category"
                value={category}
                onChange={(ev) =>
                  setCategory(ev.target.value as VendorCategory)
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {fieldErrors.category ? (
                <p className="field-error">{fieldErrors.category}</p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor="vendor-email">Contact email</label>
              <input
                id="vendor-email"
                name="contact_email"
                type="email"
                autoComplete="email"
                value={contactEmail}
                onChange={(ev) => setContactEmail(ev.target.value)}
                aria-invalid={Boolean(fieldErrors.contact_email)}
                aria-describedby={
                  fieldErrors.contact_email ? "err-email" : undefined
                }
              />
              {fieldErrors.contact_email ? (
                <p className="field-error" id="err-email">
                  {fieldErrors.contact_email}
                </p>
              ) : null}
            </div>

            {formError ? (
              <div className="banner banner-error" role="alert">
                {formError}
              </div>
            ) : null}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Add vendor"}
            </button>
          </form>
        </section>

        <RegisteredVendors refreshSignal={listRefreshSignal} />
      </div>
    </>
  );
}
