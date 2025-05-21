const BASE_URL = "http://localhost:8000";

export async function getAccounts() {
  const res = await fetch(`${BASE_URL}/accounts`);
  return res.json();
}

export async function getAccount(id: string) {
  const res = await fetch(`${BASE_URL}/accounts/${id}`);
  return res.json();
}

export async function createAccount(data: { title: string; balance: number }) {
  const res = await fetch(`${BASE_URL}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function addTransaction(accountId: string, data: { title: string; amount: number; category: string }) {
  const res = await fetch(`${BASE_URL}/accounts/${accountId}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
