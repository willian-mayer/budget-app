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

@router.get("/transactions/{transaction_id}", response_model=schemas.Transaction)
def get_transaction(transaction_id: UUID, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.get("/transactions", response_model=list[schemas.Transaction])
def list_transactions(db: Session = Depends(get_db)):
    return db.query(models.Transaction).all()

@router.put("/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(transaction_id: UUID, updated_data: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Obtener el account relacionado
    account = db.query(models.Account).filter(models.Account.id == transaction.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Associated account not found")

    # Guardar monto anterior
    old_amount = transaction.amount

    # Actualizar campos
    if updated_data.title is not None:
        transaction.title = updated_data.title
    if updated_data.amount is not None:
        transaction.amount = updated_data.amount
    if updated_data.category is not None:
        transaction.category = updated_data.category

    # Recalcular balance
    if updated_data.amount is not None:
        account.balance += (transaction.amount - old_amount)

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: UUID, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Obtener cuenta
    account = db.query(models.Account).filter(models.Account.id == transaction.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Associated account not found")

    # Revertir el balance
    account.balance -= transaction.amount

    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted successfully"}
