# Vendor Onboarding Portal

Mini vendor management UI for HR/hiring: register vendors and view them in a table. **Stack:** React + TypeScript (frontend), Python + FastAPI (backend), in-memory storage.

---

## Prompt history

Below is the conversation / assignment text preserved for reference.

### 1 — Original brief (build + break down)

> **Vendor Onboarding Portal**  
> **Stack:** React + TypeScript (Frontend) · Python + FastAPI (Backend) · **Time:** 30 minutes  
> **Tools Allowed:** Cursor IDE, any AI assistance
>
> **Context**  
> You are building a mini Vendor Management System for an HR/hiring team. The team needs a simple internal tool to register new vendors (staffing agencies, freelance platforms, consultants) and view a list of all registered vendors.
>
> **Core Requirements**
>
> **Backend – FastAPI**
>
> - `POST /vendors` — Register a new vendor with the following fields:
>   - `name` (string, required)
>   - `category` — one of: Staffing Agency, Freelance Platform, Consultant
>   - `contact_email` (string, required)
>   - `status` (default: Pending Approval)
> - `GET /vendors` — Return the list of all registered vendors.
> - Store data **in-memory**. No database needed.
>
> **Frontend – React + TypeScript**
>
> - A form to register a new vendor (name, category, email)
> - A table that displays all vendors along with their status
> - The list should update after a new vendor is added
>
> **Bonus Tasks (if time allows)**
>
> - Filter vendors by category
> - Add an Approve button per vendor that changes their status to Approved
> - Basic form validation (valid email format, no empty fields)
> - A clean, usable UI
>
> **Deliverables**
>
> - A running backend on **localhost:8000**
> - A running frontend on **localhost:5173** (or any port)
> - Both should communicate — a form submission should reflect in the vendor list
>
> **Instruction:** Break this down into a step-by-step task and then solve it.

### 2 — Run commands (backend port 8001)

> Use these commands to execute it:
>
> **Backend**
>
> ```bash
> python -m pip install -r requirements.txt
> python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
> ```
>
> **Frontend**
>
> ```bash
> npm install
> npm run dev
> ```

### 3 — README request

> Add the prompt history as a readme file

---

## How to run

From the repo root, use two terminals.

**Backend** (`backend/`):

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

**Frontend** (`frontend/`):

```bash
cd frontend
npm install
npm run dev
```

- API: **http://127.0.0.1:8001** (docs at `/docs`)
- App: **http://127.0.0.1:5173** (Vite default; see `vite.config.ts` if the port differs)

The frontend defaults to `http://127.0.0.1:8001` for API calls. Override with env **`VITE_API_URL`** if needed.

---

## API summary

| Method | Path | Description |
|--------|------|----------------|
| `GET` | `/vendors` | List vendors; optional `?category=Category+Name` |
| `POST` | `/vendors` | Create vendor (JSON: `name`, `category`, `contact_email`) |
| `PATCH` | `/vendors/{id}/approve` | Set status to Approved |
| `GET` | `/health` | Health check |

---

## Project layout

```
backend/     # FastAPI app (`main.py`), `requirements.txt`
frontend/    # Vite + React + TypeScript
```
