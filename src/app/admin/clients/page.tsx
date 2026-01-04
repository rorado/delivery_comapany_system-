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
import Image from "next/image";
import { PlusIcon, EyeIcon, PencilIcon, MailIcon, TrashBinIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "VIP" | "Inactive";
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  image: string;
}

// Initial Moroccan customers
const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Youssef El Amrani",
    email: "youssef.elamrani@mail.ma",
    phone: "+212 600-123456",
    address: "Rue de Casablanca, Casablanca",
    status: "Active",
    totalOrders: 12,
    totalSpent: "1200 MAD",
    lastOrder: "2026-01-01",
    image: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    name: "Fatima Zahra Lahlou",
    email: "fatima.lahlou@mail.ma",
    phone: "+212 612-345678",
    address: "Avenue Mohammed V, Rabat",
    status: "VIP",
    totalOrders: 25,
    totalSpent: "4800 MAD",
    lastOrder: "2026-01-02",
    image: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    name: "Hassan Benkirane",
    email: "hassan.benkirane@mail.ma",
    phone: "+212 622-567890",
    address: "Quartier Gauthier, Casablanca",
    status: "Inactive",
    totalOrders: 5,
    totalSpent: "400 MAD",
    lastOrder: "2025-12-15",
    image: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    name: "Khadija Bensalem",
    email: "khadija.bensalem@mail.ma",
    phone: "+212 633-678901",
    address: "Marrakech Medina, Marrakech",
    status: "Active",
    totalOrders: 18,
    totalSpent: "2200 MAD",
    lastOrder: "2026-01-03",
    image: "/images/user/user-04.jpg",
  },
  {
    id: 5,
    name: "Mohamed El Fassi",
    email: "mohamed.elfassi@mail.ma",
    phone: "+212 644-789012",
    address: "Rue Agadir, Agadir",
    status: "VIP",
    totalOrders: 30,
    totalSpent: "5600 MAD",
    lastOrder: "2026-01-02",
    image: "/images/user/user-05.jpg",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { isOpen, openModal, closeModal } = useModal();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "" as Customer["status"],
  });

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "" as Customer["status"],
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
      status: customer.status,
    });
    openModal();
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
    }
  };

  const handleSaveCustomer = () => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...formData }
            : customer
        )
      );
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: Math.max(...customers.map((c) => c.id)) + 1,
        ...formData,
        totalOrders: 0,
        totalSpent: "0 MAD",
        lastOrder: new Date().toISOString().split("T")[0],
        image: "/images/user/user-01.jpg",
      };
      setCustomers([...customers, newCustomer]);
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
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          >
            <option value="all">Tous les Statuts</option>
            <option value="Active">Actif</option>
            <option value="VIP">VIP</option>
            <option value="Inactive">Inactif</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total des Clients
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {customers.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {customers.filter((c) => c.status === "Active").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Clients VIP
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {customers.filter((c) => c.status === "VIP").length}
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
                  Statut
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
                    colSpan={8}
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
                            src={customer.image}
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
                    <TableCell className="px-5 py-3">
                      <Badge
                        size="sm"
                        color={
                          customer.status === "VIP"
                            ? "info"
                            : customer.status === "Active"
                            ? "success"
                            : "error"
                        }
                      >
                        {customer.status === "Active"
                          ? "Actif"
                          : customer.status === "VIP"
                          ? "VIP"
                          : "Inactif"}
                      </Badge>
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
                          onClick={() => handleDeleteCustomer(customer.id)}
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
            <Label>Statut</Label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Customer["status"],
                })
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            >
              <option value="Active">Actif</option>
              <option value="VIP">VIP</option>
              <option value="Inactive">Inactif</option>
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
              {editingCustomer ? "Mettre à Jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
