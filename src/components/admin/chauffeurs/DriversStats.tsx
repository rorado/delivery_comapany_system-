"use client";
import type { Driver } from "@/types/driver";

interface DriversStatsProps {
  drivers: Driver[];
}

export default function DriversStats({ drivers }: DriversStatsProps) {
  const activeCount = drivers.filter(
    (d) => d.status === "Active" || d.status === "On Route"
  ).length;
  const totalDeliveries = drivers.reduce((sum, d) => sum + d.deliveries, 0);
  const avgRating =
    drivers.length > 0
      ? (
          drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nombre total de livreurs
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
          {drivers.length}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
          {activeCount}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total des livraisons
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
          {totalDeliveries}
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Note moyenne</p>
        <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
          {avgRating}
        </p>
      </div>
    </div>
  );
}
