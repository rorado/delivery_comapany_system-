"use client";
import { BoxIconLine, PaperPlaneIcon, CheckCircleIcon } from "@/icons";
import Link from "next/link";

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Bon retour !
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Suivez vos expéditions et gérez vos livraisons ici.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <PaperPlaneIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Expéditions actives</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">5</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Livrées</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">23</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
            <BoxIconLine className="w-6 h-6 text-gray-800 dark:text-white/90" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Suivre votre colis
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Entrez le numéro de suivi"
              className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
            <Link
              href="/client/suivi"
              className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
            >
              Suivre le colis
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Expéditions récentes
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90 text-sm">DLV-2024-001</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">En transit</p>
              </div>
              <Link
                href="/client/suivi"
                className="text-xs text-brand-500 hover:text-brand-600"
              >
                Voir
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 dark:text-white/90 text-sm">DLV-2024-002</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Livré</p>
              </div>
              <Link
                href="/client/suivi"
                className="text-xs text-brand-500 hover:text-brand-600"
              >
                Voir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

