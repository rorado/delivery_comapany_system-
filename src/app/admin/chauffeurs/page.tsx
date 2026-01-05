"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import { PlusIcon, PencilIcon, TrashBinIcon, EyeIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

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
  });

  const saveDriversToDb = async (nextDrivers: Driver[]) => {
    await fetch("/api/admin/chauffeurs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDrivers),
    });
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/chauffeurs", { method: "GET" });
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
    if (editingDriver) {
      // Update existing driver
      const nextDrivers = drivers.map((driver) =>
        driver.id === editingDriver.id ? { ...driver, ...formData } : driver
      );
      setDrivers(nextDrivers);
      void saveDriversToDb(nextDrivers);
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: Math.max(...drivers.map((d) => d.id)) + 1,
        ...formData,
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
            Gestion des Chauffeurs
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérez les chauffeurs de livraison, leurs horaires et leurs
            performances.
          </p>
        </div>
        <button
          onClick={handleAddDriver}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un Chauffeur
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher les chauffeurs par nom, email ou téléphone..."
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nombre total de chauffeurs
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {drivers.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {
              drivers.filter(
                (d) => d.status === "Active" || d.status === "On Route"
              ).length
            }
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total des livraisons
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {drivers.reduce((sum, d) => sum + d.deliveries, 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Note moyenne
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {drivers.length > 0
              ? (
                  drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length
                ).toFixed(1)
              : "0.0"}
          </p>
        </div>
      </div>
      {/* Tableau des chauffeurs */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Chauffeur
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Contact
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Véhicule
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Statut
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Livraisons
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Note
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
              {filteredDrivers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucun chauffeur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={driver.image ?? DEFAULT_AVATAR}
                            alt={driver.name}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {driver.name}
                          </p>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: DLV-{String(driver.id).padStart(3, "0")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                          {driver.email}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {driver.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {driver.vehicle}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <Badge
                        size="sm"
                        color={
                          driver.status === "Active" ||
                          driver.status === "On Route"
                            ? "success"
                            : driver.status === "On Break"
                            ? "warning"
                            : "error"
                        }
                      >
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {driver.deliveries}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-800 text-theme-sm font-medium dark:text-white/90">
                          {driver.rating}
                        </span>
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDriver(driver)}
                          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRequestDeleteDriver(driver)}
                          className="p-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                          title="Supprimer"
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
        className="max-w-[600px] p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingDriver ? "Modifier le chauffeur" : "Ajouter un chauffeur"}
        </h4>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveDriver();
          }}
          className="space-y-5"
        >
          <div>
            <Label>Nom complet</Label>
            <input
              type="text"
              placeholder="Entrez le nom du chauffeur"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Email</Label>
            <input
              type="email"
              placeholder="Entrez l’adresse email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Téléphone</Label>
            <input
              type="tel"
              placeholder="Entrez le numéro de téléphone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Véhicule</Label>
            <input
              type="text"
              placeholder="Entrez le numéro du véhicule"
              value={formData.vehicle}
              onChange={(e) =>
                setFormData({ ...formData, vehicle: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>

          <div>
            <Label>Statut</Label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Driver["status"],
                })
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
            >
              <option value="Active">Actif</option>
              <option value="On Route">En livraison</option>
              <option value="On Break">En pause</option>
              <option value="Offline">Hors ligne</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={closeModal}
            >
              Annuler
            </Button>
            <Button type="submit" size="sm">
              {editingDriver ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          closeDeleteModal();
          setDeletingDriver(null);
        }}
        onConfirm={handleConfirmDeleteDriver}
        title="Supprimer ce chauffeur ?"
        description={
          deletingDriver
            ? `Cette action est irréversible. Chauffeur: ${deletingDriver.name}`
            : "Cette action est irréversible."
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
