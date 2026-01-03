"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

interface Vehicle {
  id: number;
  vehicleNumber: string;
  type: string;
  model: string;
  year: number;
  driver: string;
  status: "Active" | "In Use" | "Maintenance" | "Available";
  mileage: string;
  lastService: string;
  capacity: string;
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    vehicleNumber: "DLV-001",
    type: "Truck",
    model: "Ford F-150",
    year: 2022,
    driver: "Mike Johnson",
    status: "In Use",
    mileage: "45,230 km",
    lastService: "2024-01-05",
    capacity: "2,500 kg",
  },
  {
    id: 2,
    vehicleNumber: "DLV-002",
    type: "Van",
    model: "Mercedes Sprinter",
    year: 2023,
    driver: "David Brown",
    status: "Active",
    mileage: "12,450 km",
    lastService: "2024-01-10",
    capacity: "1,800 kg",
  },
  {
    id: 3,
    vehicleNumber: "DLV-003",
    type: "Truck",
    model: "Chevrolet Silverado",
    year: 2021,
    driver: "James Wilson",
    status: "In Use",
    mileage: "67,890 km",
    lastService: "2023-12-20",
    capacity: "2,800 kg",
  },
  {
    id: 4,
    vehicleNumber: "DLV-004",
    type: "Van",
    model: "Ford Transit",
    year: 2023,
    driver: "Michael Lee",
    status: "Maintenance",
    mileage: "8,920 km",
    lastService: "2024-01-08",
    capacity: "1,500 kg",
  },
  {
    id: 5,
    vehicleNumber: "DLV-005",
    type: "Truck",
    model: "Ram 1500",
    year: 2022,
    driver: "Chris Anderson",
    status: "Active",
    mileage: "38,560 km",
    lastService: "2024-01-02",
    capacity: "2,200 kg",
  },
  {
    id: 6,
    vehicleNumber: "DLV-006",
    type: "Van",
    model: "Nissan NV200",
    year: 2024,
    driver: "Available",
    status: "Available",
    mileage: "2,340 km",
    lastService: "2024-01-01",
    capacity: "1,200 kg",
  },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { isOpen, openModal, closeModal } = useModal();
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    type: "",
    model: "",
    year: new Date().getFullYear(),
    driver: "",
    status: "Active" as Vehicle["status"],
    mileage: "",
    lastService: "",
    capacity: "",
  });

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleNumber: "",
      type: "",
      model: "",
      year: new Date().getFullYear(),
      driver: "",
      status: "Active",
      mileage: "",
      lastService: "",
      capacity: "",
    });
    openModal();
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      model: vehicle.model,
      year: vehicle.year,
      driver: vehicle.driver,
      status: vehicle.status,
      mileage: vehicle.mileage,
      lastService: vehicle.lastService,
      capacity: vehicle.capacity,
    });
    openModal();
  };

  const handleDeleteVehicle = (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    }
  };

  const handleSaveVehicle = () => {
    if (editingVehicle) {
      // Update existing vehicle
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === editingVehicle.id
            ? { ...vehicle, ...formData }
            : vehicle
        )
      );
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        id: Math.max(...vehicles.map((v) => v.id)) + 1,
        ...formData,
      };
      setVehicles([...vehicles, newVehicle]);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Vehicles Management
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage delivery vehicles, maintenance, and assignments.
          </p>
        </div>
        <button
          onClick={handleAddVehicle}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <PlusIcon className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search vehicles by number, model, or driver..."
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
            <option value="Active">Active</option>
            <option value="In Use">In Use</option>
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Vehicle #
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Type / Model
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Year
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Driver
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Mileage
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Capacity
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Last Service
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    No vehicles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="px-5 py-3">
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {vehicle.vehicleNumber}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="text-gray-800 text-theme-sm dark:text-white/90">
                          {vehicle.type}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {vehicle.model}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {vehicle.year}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {vehicle.driver}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <Badge
                        size="sm"
                        color={
                          vehicle.status === "Active" || vehicle.status === "In Use"
                            ? "success"
                            : vehicle.status === "Available"
                            ? "info"
                            : "warning"
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {vehicle.mileage}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {vehicle.capacity}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {vehicle.lastService}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="p-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                          title="Delete"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveVehicle();
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label>Vehicle Number</Label>
              <input
                type="text"
                placeholder="e.g., DLV-001"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              >
                <option value="">Select Type</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
              </select>
            </div>
            <div>
              <Label>Model</Label>
              <input
                type="text"
                placeholder="e.g., Ford F-150"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
            <div>
              <Label>Year</Label>
              <input
                type="number"
                placeholder="e.g., 2024"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
                min="2000"
                max={new Date().getFullYear() + 1}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
            <div>
              <Label>Driver</Label>
              <input
                type="text"
                placeholder="Enter driver name"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Vehicle["status"] })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              >
                <option value="Active">Active</option>
                <option value="In Use">In Use</option>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <Label>Mileage</Label>
              <input
                type="text"
                placeholder="e.g., 45,230 km"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
            <div>
              <Label>Last Service</Label>
              <input
                type="date"
                value={formData.lastService}
                onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <input
                type="text"
                placeholder="e.g., 2,500 kg"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
