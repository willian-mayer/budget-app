import { useState, useEffect } from "react";
import { Transaction } from "@/types";

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onCreate: (title: string, amount: number, category: string) => Promise<void>;
  onEdit: (id: string, title: string, amount: number, category: string) => Promise<void>;
}

export default function TransactionsModal({
  transaction,
  onClose,
  onCreate,
  onEdit,
}: Props) {
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

  const handleSubmit = async () => {
    if (transaction) {
      await onEdit(transaction.id, title, amount, category);
    } else {
      await onCreate(title, amount, category);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded w-96 shadow-lg space-y-4">
        <h2 className="text-lg font-bold">
          {transaction ? "Editar Transacción" : "Nueva Transacción"}
        </h2>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Monto"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {transaction ? "Guardar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
