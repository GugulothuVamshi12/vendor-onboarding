from __future__ import annotations

from enum import Enum
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(title="Vendor Onboarding API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Category(str, Enum):
    STAFFING_AGENCY = "Staffing Agency"
    FREELANCE_PLATFORM = "Freelance Platform"
    CONSULTANT = "Consultant"


class Status(str, Enum):
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"


class VendorCreate(BaseModel):
    name: str = Field(..., min_length=1)
    category: Category
    contact_email: EmailStr


class Vendor(BaseModel):
    id: int
    name: str
    category: Category
    contact_email: str
    status: Status


_vendors: list[Vendor] = []
_next_id: int = 1


@app.get("/vendors", response_model=list[Vendor])
def list_vendors(category: Optional[Category] = None) -> list[Vendor]:
    items = _vendors
    if category is not None:
        items = [v for v in items if v.category == category]
    return items


@app.post("/vendors", response_model=Vendor, status_code=201)
def create_vendor(body: VendorCreate) -> Vendor:
    global _next_id
    vendor = Vendor(
        id=_next_id,
        name=body.name.strip(),
        category=body.category,
        contact_email=str(body.contact_email),
        status=Status.PENDING_APPROVAL,
    )
    _next_id += 1
    _vendors.append(vendor)
    return vendor


@app.patch("/vendors/{vendor_id}/approve", response_model=Vendor)
def approve_vendor(vendor_id: int) -> Vendor:
    for i, v in enumerate(_vendors):
        if v.id == vendor_id:
            updated = v.model_copy(update={"status": Status.APPROVED})
            _vendors[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Vendor not found")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
