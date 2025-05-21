from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class TransactionCreate(BaseModel):
    title: str
    amount: float
    category: str

class Transaction(TransactionCreate):
    id: UUID

    class Config:
        orm_mode = True

class AccountCreate(BaseModel):
    title: str
    balance: float = 0.0

class Account(BaseModel):
    id: UUID
    title: str
    balance: float
    transactions: List[Transaction] = []

    class Config:
        orm_mode = True

class AccountUpdate(BaseModel):
    title: Optional[str] = None
    balance: Optional[float] = None

class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None