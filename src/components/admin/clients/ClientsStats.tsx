"use client";
import type { Customer } from "@/types/customer";

interface ClientsStatsProps {
  customers: Customer[];
}

export default function ClientsStats({ customers }: ClientsStatsProps) {
  const totalRevenueK = customers
    .reduce(
      (sum, c) => sum + parseFloat(c.totalSpent.replace(/[^0-9.]/g, "")),
      0
    )
    .toFixed(0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total des Clients
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
          {customers.length}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Revenu Total</p>
        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
          {totalRevenueK}DH
        </p>
      </div>
    </div>
  );
}
