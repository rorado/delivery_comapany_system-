"use client";
import { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PaperPlaneIcon } from "@/icons";

interface TrackingEvent {
  time: string;
  location: string;
  status: string;
  description: string;
}

interface ShipmentTracking {
  id: number;
  trackingNumber: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status:
    | "Pending"
    | "In Transit"
    | "Out for Delivery"
    | "Delivered"
    | "Failed";
  estimatedDelivery: string;
  driver: string;
  vehicle: string;
  events: TrackingEvent[];
}

const trackingData: ShipmentTracking[] = [
  {
    id: 1,
    trackingNumber: "DLV-2024-001",
    sender: "Atlas Logistique",
    recipient: "Khadija El Amrani",
    origin: "Casablanca",
    destination: "Rabat",
    currentLocation: "Settat",
    status: "In Transit",
    estimatedDelivery: "2026-01-06 14:00",
    driver: "Omar El Fassi",
    vehicle: "DLV-001",
    events: [
      {
        time: "2026-01-05 16:30",
        location: "Rabat",
        status: "Delivered",
        description: "Colis livré avec succès",
      },
      {
        time: "2026-01-05 11:10",
        location: "Rabat",
        status: "Out for Delivery",
        description: "Le livreur est en route",
      },
      {
        time: "2026-01-04 18:45",
        location: "Settat",
        status: "In Transit",
        description: "Colis en transit",
      },
      {
        time: "2026-01-04 09:00",
        location: "Casablanca",
        status: "Pending",
        description: "Colis récupéré chez l'expéditeur",
      },
    ],
  },
  {
    id: 2,
    trackingNumber: "DLV-2024-002",
    sender: "Société Maghreb Express",
    recipient: "Yassine Benali",
    origin: "Tanger",
    destination: "Marrakech",
    currentLocation: "Marrakech",
    status: "Out for Delivery",
    estimatedDelivery: "2026-01-05 16:00",
    driver: "Sara Aït Lahcen",
    vehicle: "DLV-002",
    events: [
      {
        time: "2026-01-05 11:00",
        location: "Marrakech",
        status: "Out for Delivery",
        description: "Le livreur est en route",
      },
      {
        time: "2026-01-04 18:30",
        location: "Béni Mellal",
        status: "In Transit",
        description: "Colis en transit",
      },
      {
        time: "2026-01-04 08:30",
        location: "Tanger",
        status: "Pending",
        description: "Colis récupéré au dépôt",
      },
    ],
  },
];

const statusLabels: Record<ShipmentTracking["status"], string> = {
  Pending: "En attente",
  "In Transit": "En transit",
  "Out for Delivery": "En livraison",
  Delivered: "Livré",
  Failed: "Échoué",
};

export default function TrackingPage() {
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentTracking | null>(trackingData[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Suivi des expéditions
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Suivez vos expéditions et livraisons en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Shipments List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Expéditions actives
            </h2>
            <div className="space-y-3">
              {trackingData.map((shipment) => (
                <div
                  key={shipment.id}
                  onClick={() => setSelectedShipment(shipment)}
                  className={`cursor-pointer rounded-lg border p-3 transition ${
                    selectedShipment?.id === shipment.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {shipment.trackingNumber}
                      </p>
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {shipment.recipient}
                      </p>
                    </div>
                    <Badge
                      size="sm"
                      color={
                        shipment.status === "Delivered"
                          ? "success"
                          : shipment.status === "In Transit" ||
                            shipment.status === "Out for Delivery"
                          ? "info"
                          : shipment.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {statusLabels[shipment.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tracking Details */}
        {selectedShipment && (
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    {selectedShipment.trackingNumber}
                  </h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {selectedShipment.sender} → {selectedShipment.recipient}
                  </p>
                </div>
                <Badge
                  size="sm"
                  color={
                    selectedShipment.status === "Delivered"
                      ? "success"
                      : selectedShipment.status === "In Transit" ||
                        selectedShipment.status === "Out for Delivery"
                      ? "info"
                      : selectedShipment.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {statusLabels[selectedShipment.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Location
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.currentLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Estimated Delivery
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.estimatedDelivery}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Driver
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.driver}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vehicle
                  </p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.vehicle}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
                  Historique de suivi
                </h3>
                <div className="space-y-4">
                  {selectedShipment.events.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            index === 0
                              ? "bg-brand-500"
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        />
                        {index < selectedShipment.events.length - 1 && (
                          <div className="h-16 w-0.5 bg-gray-200 dark:bg-gray-700" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {event.status}
                          </p>
                          <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                            {event.time}
                          </p>
                        </div>
                        <p className="mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                          {event.location}
                        </p>
                        <p className="mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
