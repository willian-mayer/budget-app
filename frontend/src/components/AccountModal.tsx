// src/components/AccountModal.tsx
import { useEffect, useState } from "react";
import { Account } from "@/types";

type AccountModalProps = {
  account: Account | null; // <-- esto es lo que falta
  onClose: () => void;
  onCreate: (title: string, balance: number) => Promise<void>;
  onEdit: (id: string, title: string, balance: number) => Promise<void>;
};

export default function AccountModal({
  account,
  onClose,
  onCreate,
  onEdit,
}: AccountModalProps) {
  const [title, setTitle] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (account) {
      setTitle(account.title);
      setBalance(account.balance);
    } else {
      setTitle("");
      setBalance(0);
    }
  }, [account]);

  const handleSubmit = () => {
    if (account) {
      onEdit(account.id, title, balance);
    } else {
      onCreate(title, balance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {account ? "Editar cuenta" : "Crear cuenta"}
        </h2>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
          className="w-full border p-2 mb-4 rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {account ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
