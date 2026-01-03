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
  status: "Pending" | "In Transit" | "Out for Delivery" | "Delivered" | "Failed";
  estimatedDelivery: string;
  driver: string;
  vehicle: string;
  events: TrackingEvent[];
}

const trackingData: ShipmentTracking[] = [
  {
    id: 1,
    trackingNumber: "DLV-2024-001",
    sender: "ABC Company",
    recipient: "John Smith",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    currentLocation: "Chicago, IL",
    status: "In Transit",
    estimatedDelivery: "2024-01-15 14:00",
    driver: "Mike Johnson",
    vehicle: "DLV-001",
    events: [
      {
        time: "2024-01-12 14:30",
        location: "Los Angeles, CA",
        status: "Delivered",
        description: "Package delivered successfully",
      },
      {
        time: "2024-01-12 10:15",
        location: "Los Angeles, CA",
        status: "Out for Delivery",
        description: "Driver is on the way",
      },
      {
        time: "2024-01-11 16:45",
        location: "Chicago, IL",
        status: "In Transit",
        description: "Package in transit",
      },
      {
        time: "2024-01-10 09:00",
        location: "New York, NY",
        status: "Pending",
        description: "Package picked up",
      },
    ],
  },
  {
    id: 2,
    trackingNumber: "DLV-2024-002",
    sender: "XYZ Corp",
    recipient: "Sarah Williams",
    origin: "Chicago, IL",
    destination: "Houston, TX",
    currentLocation: "Houston, TX",
    status: "Out for Delivery",
    estimatedDelivery: "2024-01-12 16:00",
    driver: "David Brown",
    vehicle: "DLV-002",
    events: [
      {
        time: "2024-01-12 11:00",
        location: "Houston, TX",
        status: "Out for Delivery",
        description: "Driver is on the way",
      },
      {
        time: "2024-01-11 18:30",
        location: "Dallas, TX",
        status: "In Transit",
        description: "Package in transit",
      },
      {
        time: "2024-01-08 10:00",
        location: "Chicago, IL",
        status: "Pending",
        description: "Package picked up",
      },
    ],
  },
];

export default function TrackingPage() {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentTracking | null>(
    trackingData[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Shipment Tracking
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Track shipments and deliveries in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Shipments List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Active Shipments
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
                      {shipment.status}
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
                  {selectedShipment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Location</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.currentLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.estimatedDelivery}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Driver</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.driver}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                    {selectedShipment.vehicle}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
                  Tracking History
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
