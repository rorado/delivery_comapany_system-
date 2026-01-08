"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import DriversTable from "@/components/admin/chauffeurs/DriversTable";
import DriverFormModal from "@/components/admin/chauffeurs/DriverFormModal";
import DriversStats from "@/components/admin/chauffeurs/DriversStats";

import type { Driver } from "@/types/driver";
import { adminChauffeursSeed } from "@/data/adminChauffeursSeed";

const DEFAULT_AVATAR = "/images/user/user-01.jpg";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(adminChauffeursSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    status: "Active" as Driver["status"],
    password: "",
  });

  const saveDriversToDb = async (nextDrivers: Driver[]) => {
    await fetch("/api/admin/livreurs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDrivers),
    });
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/livreurs", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as Driver[];
        if (isMounted && Array.isArray(data)) setDrivers(data);
      } catch {
        // keep seed
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter drivers based on search and status
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = () => {
    setEditingDriver(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicle: "",
      status: "Active",
      password: "",
    });
    openModal();
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      vehicle: driver.vehicle,
      status: driver.status,
      password: driver.password ?? "",
    });
    openModal();
  };

  const handleRequestDeleteDriver = (driver: Driver) => {
    setDeletingDriver(driver);
    openDeleteModal();
  };

  const handleConfirmDeleteDriver = () => {
    if (!deletingDriver) return;
    const nextDrivers = drivers.filter((d) => d.id !== deletingDriver.id);
    setDrivers(nextDrivers);
    void saveDriversToDb(nextDrivers);
    closeDeleteModal();
    setDeletingDriver(null);
  };

  const handleSaveDriver = () => {
    const trimmedPassword = formData.password.trim();
    const nextFormData = {
      ...formData,
      password: trimmedPassword.length > 0 ? trimmedPassword : undefined,
    };

    if (editingDriver) {
      // Update existing driver, preserving password if left blank
      const nextDrivers = drivers.map((driver) => {
        if (driver.id !== editingDriver.id) return driver;
        const updated = { ...driver, ...nextFormData } as Driver;
        if (nextFormData.password === undefined) {
          updated.password = driver.password;
        }
        return updated;
      });
      setDrivers(nextDrivers);
      void saveDriversToDb(nextDrivers);
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: drivers.length > 0 ? Math.max(...drivers.map((d) => d.id)) + 1 : 1,
        ...nextFormData,
        deliveries: 0,
        rating: 0,
        image: "/images/user/user-01.jpg",
      };
      const nextDrivers = [...drivers, newDriver];
      setDrivers(nextDrivers);
      void saveDriversToDb(nextDrivers);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Gestion des Livreurs
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérez les livreurs, leurs horaires et leurs performances.
          </p>
        </div>
        <button
          onClick={handleAddDriver}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un Livreur
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher les livreurs par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
          >
            <option value="all">Toutes les statuts</option>
            <option value="Active">Actif</option>
            <option value="On Route">En Route</option>
            <option value="On Break">En Pause</option>
            <option value="Offline">Hors Ligne</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <DriversStats drivers={drivers} />
      {/* Tableau des chauffeurs */}
      <DriversTable
        drivers={filteredDrivers}
        onEdit={handleEditDriver}
        onDelete={handleRequestDeleteDriver}
      />

      {/* Add/Edit Modal */}
      <DriverFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveDriver}
        formData={formData}
        setFormData={setFormData}
        editingDriver={editingDriver}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          closeDeleteModal();
          setDeletingDriver(null);
        }}
        onConfirm={handleConfirmDeleteDriver}
        title="Supprimer ce livreur ?"
        description={
          deletingDriver
            ? `Cette action est irréversible. Livreur: ${deletingDriver.name}`
            : "Cette action est irréversible."
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
