// src/components/TransactionsModal.tsx
import { useEffect, useState } from "react";
import { Transaction } from "@/types";

type TransactionsModalProps = {
  transaction: Transaction | null;
  onClose: () => void;
  onCreate: (title: string, amount: number, category: string) => Promise<void>;
  onEdit: (id: string, title: string, amount: number, category: string) => Promise<void>;
};

export default function TransactionsModal({
  transaction,
  onClose,
  onCreate,
  onEdit,
}: TransactionsModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setCategory(transaction.category);
    } else {
      setTitle("");
      setAmount(0);
      setCategory("");
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (transaction) {
      onEdit(transaction.id, title, amount, category);
    } else {
      onCreate(title, amount, category);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {transaction ? "Editar transacción" : "Crear transacción"}
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
          placeholder="Cantidad"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
            {transaction ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
