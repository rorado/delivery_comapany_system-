"use client";
import { BoxIconLine, PaperPlaneIcon, CheckCircleIcon } from "@/icons";

export default function DeliveryDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Tableau de bord des livraisons
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Bienvenue sur votre tableau de bord. Gérez vos livraisons et suivez vos performances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <PaperPlaneIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Livraisons du jour</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">12</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Terminées</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">8</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <BoxIconLine className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">En cours</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">4</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Taux de réussite</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">98%</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Livraisons récentes
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-white/90">DLV-2024-001</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">123 Main St, New York</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
              Terminée
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-white/90">DLV-2024-002</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">456 Oak Ave, Los Angeles</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
              En transit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

