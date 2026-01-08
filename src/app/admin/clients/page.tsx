"use client";
import { useEffect, useState } from "react";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import ClientsTable from "@/components/admin/clients/ClientsTable";
import ClientFormModal, {
  ClientFormData,
} from "@/components/admin/clients/ClientFormModal";
import ClientsStats from "@/components/admin/clients/ClientsStats";

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
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
    password: "",
    isActive: true,
    isBlocked: false,
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
      password: "",
      isActive: true,
      isBlocked: false,
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
      password: customer.password ?? "",
      isActive: customer.isActive ?? true,
      isBlocked: customer.isBlocked ?? false,
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
    const trimmedPassword = formData.password.trim();
    const nextFormData = {
      ...formData,
      image: trimmedImage.length > 0 ? trimmedImage : undefined,
      password: trimmedPassword.length > 0 ? trimmedPassword : undefined,
    };

    if (editingCustomer) {
      // Update existing customer, preserving password if left blank
      const nextCustomers = customers.map((customer) => {
        if (customer.id !== editingCustomer.id) return customer;
        const updated = { ...customer, ...nextFormData } as Customer;
        if (nextFormData.password === undefined) {
          updated.password = customer.password;
        }
        return updated;
      });
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

      <ClientsStats customers={customers} />

      <ClientsTable
        customers={filteredCustomers}
        onEdit={handleEditCustomer}
        onDelete={handleRequestDeleteCustomer}
      />

      {/* Ajouter/Modifier un Client */}
      <ClientFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSaveCustomer}
        formData={formData}
        setFormData={setFormData}
        editingCustomer={editingCustomer}
      />

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
