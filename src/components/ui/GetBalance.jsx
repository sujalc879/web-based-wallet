import { useEffect, useState } from "react";

export default function GetBalance({ selectedValue, refreshKey, onBalance }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedValue) return;

    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(import.meta.env.VITE_ALCHEMY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [selectedValue],
          }),
        });

        if (!res.ok) throw new Error("RPC request failed");

        const data = await res.json();
        const sol = data.result.value / 1_000_000_000;

        setBalance(sol);
        onBalance?.(sol);
      } catch {
        setError("Unable to fetch balance");
        setBalance(null);
        onBalance?.(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [selectedValue, refreshKey]);

  if (loading) {
    return <p className="mt-4 text-stone-500 text-center">Fetching balance…</p>;
  }

  if (error) {
    return <p className="mt-4 text-red-500 text-center">{error}</p>;
  }

  return (
    <p className="mt-4 text-2xl font-semibold">
      {balance !== null ? `${balance} SOL` : "—"}
    </p>
  );
}
