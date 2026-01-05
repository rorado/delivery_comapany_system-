"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Badge from "../../../components/ui/badge/Badge";
import { EyeIcon, PlusIcon } from "../../../icons";
import Link from "next/link";
import Button from "../../../components/ui/button/Button";

import type { ClientShipment } from "../../../types/clientShipment";
import { clientShipmentsSeed } from "../../../data/clientShipmentsSeed";

export default function MyShipmentsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lastUrlStatus = useRef<string | null>(null);
  const lastUrlNew = useRef<string | null>(null);
  const isColisRoute = pathname.startsWith("/client/colis");
  const [shipments, setShipments] =
    useState<ClientShipment[]>(clientShipmentsSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const saveShipmentsToDb = async (nextShipments: ClientShipment[]) => {
    await fetch("/api/client/shipments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextShipments),
    });
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/client/shipments", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as ClientShipment[];
        if (isMounted && Array.isArray(data)) setShipments(data);
      } catch {
        // keep seed
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddColis = useCallback(() => {
    router.push("/client/colis/nouveau");
  }, [router]);

  useEffect(() => {
    if (!isColisRoute) return;

    if (pathname.endsWith("/ramassage")) {
      setStatusFilter("En attente");
      return;
    }

    if (pathname.endsWith("/liste")) {
      setStatusFilter("all");
    }
  }, [isColisRoute, pathname]);

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    const urlNew = searchParams.get("new");

    if (urlStatus !== lastUrlStatus.current) {
      setStatusFilter(urlStatus ?? "all");
      lastUrlStatus.current = urlStatus;
    }

    if (urlNew !== lastUrlNew.current) {
      if (urlNew === "1") {
        router.replace("/client/colis/nouveau");
      }
      lastUrlNew.current = urlNew;
    }
  }, [router, searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Mes Expéditions
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Consultez et suivez toutes vos expéditions.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {isColisRoute && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/client/colis/liste")}
              >
                Liste des colis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/client/colis/ramassage")}
              >
                Colis pour ramassage
              </Button>
            </>
          )}
          <button
            onClick={handleAddColis}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter un nouveau colis
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par numéro de suivi ou expéditeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          >
            <option value="all">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="En transit">En transit</option>
            <option value="En livraison">En livraison</option>
            <option value="Livré">Livré</option>
            <option value="Échoué">Échoué</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total des Expéditions
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {shipments.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Transit</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {
              shipments.filter(
                (s) => s.status === "En transit" || s.status === "En livraison"
              ).length
            }
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Livré</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {shipments.filter((s) => s.status === "Livré").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {shipments.filter((s) => s.status === "En attente").length}
          </p>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune expédition trouvée
            </p>
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {shipment.trackingNumber}
                    </h3>
                    <Badge
                      size="sm"
                      color={
                        shipment.status === "Livré"
                          ? "success"
                          : shipment.status === "En transit" ||
                            shipment.status === "En livraison"
                          ? "info"
                          : shipment.status === "En attente"
                          ? "warning"
                          : "error"
                      }
                    >
                      {shipment.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>De :</strong> {shipment.sender} ({shipment.origin}
                      )
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>À :</strong> {shipment.destination}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Poids :</strong> {shipment.weight}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Livraison estimée :</strong>{" "}
                      {shipment.estimatedDelivery}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Date de commande :</strong> {shipment.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/client/suivi?tracking=${shipment.trackingNumber}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Suivre le colis
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
