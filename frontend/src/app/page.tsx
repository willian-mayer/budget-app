"use client";

import { useEffect, useState } from "react";
import { Account, Transaction } from "@/types";
import AccountModal from "@/components/AccountModal";
import TransactionsModal from "@/components/TransactionsModal";

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchAccounts = async () => {
    const res = await fetch("http://localhost:8000/accounts");
    const data = await res.json();
    setAccounts(data);
    if (data.length > 0) setSelectedAccount(data[0]);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSelect = async (accountId: string) => {
    const res = await fetch(`http://localhost:8000/accounts/${accountId}`);
    const data = await res.json();
    setSelectedAccount(data);
  };

  const handleCreate = async (title: string, balance: number) => {
    await fetch("http://localhost:8000/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, balance }),
    });
    await fetchAccounts();
    setModalOpen(false);
  };

  const handleEdit = async (id: string, title: string, balance: number) => {
    await fetch(`http://localhost:8000/accounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, balance }),
    });
    await fetchAccounts();
    setEditingAccount(null);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:8000/accounts/${id}`, {
      method: "DELETE",
    });
    await fetchAccounts();
    if (selectedAccount?.id === id) {
      setSelectedAccount(null);
    }
    setModalOpen(false);
  };

  const handleCreateTransaction = async (
    title: string,
    amount: number,
    category: string
  ) => {
    if (!selectedAccount) return;
    await fetch(`http://localhost:8000/accounts/${selectedAccount.id}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category }),
    });
    await handleSelect(selectedAccount.id);
    setTransactionModalOpen(false);
  };

  const handleEditTransaction = async (
    id: string,
    title: string,
    amount: number,
    category: string
  ) => {
    await fetch(`http://localhost:8000/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category }),
    });
    if (selectedAccount) await handleSelect(selectedAccount.id);
    setEditingTransaction(null);
    setTransactionModalOpen(false);
  };

  return (
    <main className="flex p-6 space-x-6">
      {/* Panel izquierdo: cuentas */}
      <div className="w-1/3 border rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cuentas</h2>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setEditingAccount(null);
              setModalOpen(true);
            }}
          >
            Crear
          </button>
        </div>
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li
              key={account.id}
              className={`p-2 rounded cursor-pointer border ${
                selectedAccount?.id === account.id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(account.id)}
            >
              <div className="font-semibold">{account.title}</div>
              <div className="text-sm text-gray-600">
                Balance: ${account.balance}
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  className="text-blue-600 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAccount(account);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-red-600 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm("¿Estás seguro de que quieres eliminar esta cuenta?")
                    ) {
                      handleDelete(account.id);
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho: transacciones */}
      <div className="w-2/3 border rounded p-4">
        {selectedAccount ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Transacciones de {selectedAccount.title}
              </h2>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {
                  setEditingTransaction(null);
                  setTransactionModalOpen(true);
                }}
              >
                Nueva transacción
              </button>
            </div>
            {selectedAccount.transactions.length === 0 ? (
              <p className="text-gray-500">No hay transacciones.</p>
            ) : (
              <ul className="space-y-2">
                {selectedAccount.transactions.map((t) => (
                  <li key={t.id} className="border rounded p-2">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-sm text-gray-600">
                      ${t.amount} – {t.category}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        className="text-blue-600 text-sm"
                        onClick={() => {
                          setEditingTransaction(t);
                          setTransactionModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 text-sm"
                        onClick={async () => {
                          if (
                            confirm("¿Estás seguro de que quieres eliminar esta transacción?")
                          ) {
                            await fetch(`http://localhost:8000/transactions/${t.id}`, {
                              method: "DELETE",
                            });
                            if (selectedAccount) await handleSelect(selectedAccount.id);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-gray-500">
            Selecciona una cuenta para ver transacciones.
          </p>
        )}
      </div>

      {/* Modal de cuentas */}
      {modalOpen && (
        <AccountModal
          account={editingAccount}
          onClose={() => {
            setModalOpen(false);
            setEditingAccount(null);
          }}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      )}

      {/* Modal de transacciones */}
      {transactionModalOpen && (
        <TransactionsModal
          transaction={editingTransaction}
          onClose={() => {
            setTransactionModalOpen(false);
            setEditingTransaction(null);
          }}
          onCreate={handleCreateTransaction}
          onEdit={handleEditTransaction}
        />
      )}
    </main>
  );
}
