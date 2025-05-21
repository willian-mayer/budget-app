"use client";

import { useEffect, useState } from "react";
import { Account } from "@/types";
import AccountModal from "@/components/AccountModal";

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

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
            <h2 className="text-xl font-bold mb-4">
              Transacciones de {selectedAccount.title}
            </h2>
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
    </main>
  );
}
