"use client";
import { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, CheckCircleIcon, PaperPlaneIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

interface Delivery {
  id: number;
  trackingNumber: string;
  recipient: string;
  destination: string;
  status: "Pending" | "In Transit" | "Out for Delivery" | "Delivered" | "Failed";
  estimatedDelivery: string;
  weight: string;
  image: string;
}

const initialDeliveries: Delivery[] = [
  {
    id: 1,
    trackingNumber: "DLV-2024-001",
    recipient: "John Smith",
    destination: "123 Main St, New York, NY",
    status: "Out for Delivery",
    estimatedDelivery: "2024-01-12 14:00",
    weight: "2.5 kg",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    trackingNumber: "DLV-2024-002",
    recipient: "Sarah Williams",
    destination: "456 Oak Ave, Los Angeles, CA",
    status: "In Transit",
    estimatedDelivery: "2024-01-13 10:00",
    weight: "5.0 kg",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    trackingNumber: "DLV-2024-003",
    recipient: "Robert Davis",
    destination: "789 Pine Rd, Chicago, IL",
    status: "Delivered",
    estimatedDelivery: "2024-01-11 16:00",
    weight: "1.2 kg",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: number, newStatus: Delivery["status"]) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          My Deliveries
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage and track your assigned deliveries.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by tracking number, recipient, or destination..."
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
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {deliveries.filter((d) => d.status === "In Transit" || d.status === "Out for Delivery").length}
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
            <p className="text-gray-500 dark:text-gray-400">No deliveries found</p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {delivery.image && (
                  <div className="sm:w-32 flex-shrink-0">
                    <img
                      src={delivery.image}
                      alt={delivery.trackingNumber}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
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
                          : delivery.status === "In Transit" || delivery.status === "Out for Delivery"
                          ? "info"
                          : delivery.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {delivery.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Recipient:</strong> {delivery.recipient}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Destination:</strong> {delivery.destination}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Weight:</strong> {delivery.weight}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>ETA:</strong> {delivery.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {delivery.status === "Out for Delivery" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(delivery.id, "Delivered")}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  {delivery.status === "In Transit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(delivery.id, "Out for Delivery")}
                    >
                      Start Delivery
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Details
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

