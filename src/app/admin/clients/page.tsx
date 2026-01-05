"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { PlusIcon, EyeIcon, PencilIcon, MailIcon, TrashBinIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";

import type { Customer } from "@/types/customer";
import { adminClientsSeed } from "@/data/adminClientsSeed";

const DEFAULT_AVATAR = "/images/user/user-01.jpg";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(adminClientsSeed);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });

  const saveCustomersToDb = async (nextCustomers: Customer[]) => {
    const res = await fetch("/api/admin/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextCustomers),
    });

    if (!res.ok) {
      try {
        const text = await res.text();
        console.error("Failed to save customers:", text);
      } catch {
        console.error("Failed to save customers");
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/clients", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as Customer[];
        if (isMounted && Array.isArray(data)) setCustomers(data);
      } catch {
        // keep seed
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    return matchesSearch;
  });

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      image: "",
    });
    openModal();
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      image: customer.image ?? "",
    });
    openModal();
  };

  const handleRequestDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
    openDeleteModal();
  };

  const handleConfirmDeleteCustomer = () => {
    if (!deletingCustomer) return;
    const nextCustomers = customers.filter(
      (customer) => customer.id !== deletingCustomer.id
    );
    setCustomers(nextCustomers);
    void saveCustomersToDb(nextCustomers);
    closeDeleteModal();
    setDeletingCustomer(null);
  };

  const handleSaveCustomer = () => {
    const trimmedImage = formData.image.trim();
    const nextFormData = {
      ...formData,
      image: trimmedImage.length > 0 ? trimmedImage : undefined,
    };

    if (editingCustomer) {
      // Update existing customer
      const nextCustomers = customers.map((customer) =>
        customer.id === editingCustomer.id
          ? {
              ...customer,
              ...nextFormData,
            }
          : customer
      );
      setCustomers(nextCustomers);
      void saveCustomersToDb(nextCustomers);
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id:
          customers.length > 0
            ? Math.max(...customers.map((c) => c.id)) + 1
            : 1,
        ...nextFormData,
        totalOrders: 0,
        totalSpent: "0 MAD",
        lastOrder: new Date().toISOString().split("T")[0],
      };
      const nextCustomers = [...customers, newCustomer];
      setCustomers(nextCustomers);
      void saveCustomersToDb(nextCustomers);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Gestion des Clients
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérer les informations des clients et l’historique des livraisons.
          </p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un Client
        </button>
      </div>

      {/* Recherche et Filtre */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher des clients par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total des Clients
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {customers.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Revenu Total
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            $
            {customers
              .reduce(
                (sum, c) =>
                  sum + parseFloat(c.totalSpent.replace(/[^0-9.]/g, "")),
                0
              )
              .toFixed(0)}
            K
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Client
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
                  Adresse
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Commandes
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Dépensé
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Dernière Commande
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
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={customer.image ?? DEFAULT_AVATAR}
                            alt={customer.name}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {customer.name}
                          </p>
                          <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: CUST-{String(customer.id).padStart(4, "0")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {customer.email}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400 max-w-[200px] truncate">
                        {customer.address}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.totalSpent}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {customer.lastOrder}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400">
                          <MailIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRequestDeleteCustomer(customer)}
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

      {/* Ajouter/Modifier un Client */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingCustomer ? "Modifier le Client" : "Ajouter un Nouveau Client"}
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCustomer();
          }}
          className="space-y-5"
        >
          <div>
            <Label>Nom Complet</Label>
            <input
              type="text"
              placeholder="Entrez le nom du client"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label>Email</Label>
            <input
              type="email"
              placeholder="Entrez l'adresse e-mail"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
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
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label>Adresse</Label>
            <input
              type="text"
              placeholder="Entrez l'adresse"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label>Image (URL) (optionnel)</Label>
            <input
              type="text"
              placeholder="Ex: /images/user/user-02.jpg ou https://..."
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Si vide, un avatar par défaut sera affiché.
            </p>
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
              {editingCustomer ? "Mettre à Jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          closeDeleteModal();
          setDeletingCustomer(null);
        }}
        onConfirm={handleConfirmDeleteCustomer}
        title="Supprimer ce client ?"
        description={
          deletingCustomer
            ? `Cette action est irréversible. Client: ${deletingCustomer.name}`
            : "Cette action est irréversible."
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
