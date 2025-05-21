from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database
from uuid import UUID

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/accounts", response_model=schemas.Account)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    db_account = models.Account(title=account.title, balance=account.balance)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/accounts", response_model=list[schemas.Account])
def list_accounts(db: Session = Depends(get_db)):
    return db.query(models.Account).all()

@router.post("/accounts/{account_id}/transactions", response_model=schemas.Transaction)
def add_transaction(account_id: UUID, tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    transaction = models.Transaction(**tx.dict(), account_id=account_id)
    db.add(transaction)
    account.balance += tx.amount
    db.commit()
    db.refresh(transaction)
    return transaction

@router.get("/accounts/{account_id}", response_model=schemas.Account)
def get_account(account_id: UUID, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.put("/accounts/{account_id}", response_model=schemas.Account)
def update_account(account_id: UUID, updated_data: schemas.AccountUpdate, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    if updated_data.title is not None:
        account.title = updated_data.title
    if updated_data.balance is not None:
        account.balance = updated_data.balance

    db.commit()
    db.refresh(account)
    return account

@router.delete("/accounts/{account_id}")
def delete_account(account_id: UUID, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    db.delete(account)
    db.commit()
    return {"detail": "Account deleted successfully"}

@router.put("/accounts/{account_id}/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(account_id: UUID, transaction_id: UUID, updated_data: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.account_id == account_id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if updated_data.title is not None:
        transaction.title = updated_data.title
    if updated_data.amount is not None:
        transaction.amount = updated_data.amount
    if updated_data.category is not None:
        transaction.category = updated_data.category

    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/accounts/{account_id}/transactions/{transaction_id}")
def delete_transaction(account_id: UUID, transaction_id: UUID, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.account_id == account_id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted successfully"}
