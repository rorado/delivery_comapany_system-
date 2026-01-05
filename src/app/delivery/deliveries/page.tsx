"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, CheckCircleIcon, PaperPlaneIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

import type { Delivery } from "@/types/delivery";
import { deliveryDeliveriesSeed } from "@/data/deliveryDeliveriesSeed";

const deliveryStatusLabels: Record<Delivery["status"], string> = {
  Pending: "En attente",
  "In Transit": "En transit",
  "Out for Delivery": "En livraison",
  Delivered: "Livré",
  Failed: "Échoué",
};

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(
    deliveryDeliveriesSeed
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const saveDeliveriesToDb = async (nextDeliveries: Delivery[]) => {
    await fetch("/api/delivery/deliveries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDeliveries),
    });
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/delivery/deliveries", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as Delivery[];
        if (isMounted && Array.isArray(data)) setDeliveries(data);
      } catch {
        // keep seed
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: number, newStatus: Delivery["status"]) => {
    const nextDeliveries = deliveries.map((delivery) =>
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    );
    setDeliveries(nextDeliveries);
    void saveDeliveriesToDb(nextDeliveries);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Mes livraisons
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Gérez et suivez vos livraisons assignées.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par numéro, destinataire ou destination..."
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
            <option value="Pending">En attente</option>
            <option value="In Transit">En transit</option>
            <option value="Out for Delivery">En livraison</option>
            <option value="Delivered">Livré</option>
            <option value="Failed">Échoué</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {deliveries.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {
              deliveries.filter(
                (d) =>
                  d.status === "In Transit" || d.status === "Out for Delivery"
              ).length
            }
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {deliveries.filter((d) => d.status === "Delivered").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {deliveries.filter((d) => d.status === "Pending").length}
          </p>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune livraison trouvée
            </p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {delivery.trackingNumber}
                    </h3>
                    <Badge
                      size="sm"
                      color={
                        delivery.status === "Delivered"
                          ? "success"
                          : delivery.status === "In Transit" ||
                            delivery.status === "Out for Delivery"
                          ? "info"
                          : delivery.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {deliveryStatusLabels[delivery.status]}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Destinataire :</strong> {delivery.recipient}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Destination :</strong> {delivery.destination}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Poids :</strong> {delivery.weight}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Livraison estimée :</strong>{" "}
                      {delivery.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {delivery.status === "Out for Delivery" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(delivery.id, "Delivered")
                      }
                    >
                      Marquer comme livré
                    </Button>
                  )}
                  {delivery.status === "In Transit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(delivery.id, "Out for Delivery")
                      }
                    >
                      Démarrer la livraison
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Voir les détails
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
