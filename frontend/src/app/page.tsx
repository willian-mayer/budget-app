"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
}

interface Account {
  id: string;
  title: string;
  balance: number;
  transactions: Transaction[];
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/accounts")
      .then((res) => res.json())
      .then((data: Account[]) => {
        setAccounts(data);
        if (data.length > 0) setSelectedAccount(data[0]);
      });
  }, []);

  const handleSelect = async (accountId: string) => {
    const res = await fetch(`http://localhost:8000/accounts/${accountId}`);
    const data = await res.json();
    setSelectedAccount(data);
  };

  return (
    <main className="flex p-6 space-x-6">
      {/* Panel izquierdo: cuentas */}
      <div className="w-1/3 border rounded p-4">
        <h2 className="text-xl font-bold mb-4">Cuentas</h2>
        <ul className="space-y-2">
          {accounts.map((account) => (
            <li
              key={account.id}
              onClick={() => handleSelect(account.id)}
              className={`p-2 rounded cursor-pointer border ${
                selectedAccount?.id === account.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              <div className="font-semibold">{account.title}</div>
              <div className="text-sm text-gray-600">Balance: ${account.balance}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho: transacciones */}
      <div className="w-2/3 border rounded p-4">
        {selectedAccount ? (
          <>
            <h2 className="text-xl font-bold mb-4">Transacciones de {selectedAccount.title}</h2>
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
          <p className="text-gray-500">Selecciona una cuenta para ver transacciones.</p>
        )}
      </div>
    </main>
  );
}
