"use client";
import { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, PaperPlaneIcon, PlusIcon } from "@/icons";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

interface Shipment {
  id: number;
  trackingNumber: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  weight: string;
  status: "En attente" | "En transit" | "En livraison" | "Livré" | "Échoué";
  estimatedDelivery: string;
  createdAt: string;
  image: string;
}

const initialShipments: Shipment[] = [
  {
    id: 1,
    trackingNumber: "DLV-2024-001",
    sender: "ABC Société",
    recipient: "Jean Dupont",
    origin: "New York, NY",
    destination: "123 Rue Principale, Los Angeles, CA",
    weight: "2,5 kg",
    status: "En transit",
    estimatedDelivery: "2024-01-15 14:00",
    createdAt: "2024-01-10",
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    trackingNumber: "DLV-2024-002",
    sender: "XYZ Corp",
    recipient: "Jean Dupont",
    origin: "Chicago, IL",
    destination: "123 Rue Principale, Los Angeles, CA",
    weight: "5,0 kg",
    status: "Livré",
    estimatedDelivery: "2024-01-12 16:00",
    createdAt: "2024-01-08",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    trackingNumber: "DLV-2024-003",
    sender: "Solutions Tech",
    recipient: "Jean Dupont",
    origin: "Miami, FL",
    destination: "123 Rue Principale, Los Angeles, CA",
    weight: "1,2 kg",
    status: "En livraison",
    estimatedDelivery: "2024-01-13 10:00",
    createdAt: "2024-01-11",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
];

export default function MyShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    sender: "",
    recipient: "",
    origin: "",
    destination: "",
    weight: "",
    estimatedDelivery: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, image: result });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddShipment = () => {
    setFormData({
      sender: "",
      recipient: "",
      origin: "",
      destination: "",
      weight: "",
      estimatedDelivery: "",
      image: "",
    });
    setImagePreview("");
    openModal();
  };

  const handleSaveShipment = () => {
    const newId =
      shipments.length > 0 ? Math.max(...shipments.map((s) => s.id)) + 1 : 1;
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const newShipment: Shipment = {
      id: newId,
      trackingNumber: `DLV-2024-${String(newId).padStart(3, "0")}`,
      ...formData,
      status: "En attente",
      createdAt: dateStr,
    };
    setShipments([...shipments, newShipment]);
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Mes Expéditions
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Consultez et suivez toutes vos expéditions.
          </p>
        </div>
        <button
          onClick={handleAddShipment}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
        >
          <PlusIcon className="w-4 h-4" />
          Nouvelle Expédition
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par numéro de suivi ou expéditeur..."
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
            <option value="En attente">En attente</option>
            <option value="En transit">En transit</option>
            <option value="En livraison">En livraison</option>
            <option value="Livré">Livré</option>
            <option value="Échoué">Échoué</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total des Expéditions
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {shipments.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">En Transit</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {
              shipments.filter(
                (s) => s.status === "En transit" || s.status === "En livraison"
              ).length
            }
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Livré</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {shipments.filter((s) => s.status === "Livré").length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {shipments.filter((s) => s.status === "En attente").length}
          </p>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune expédition trouvée
            </p>
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {shipment.image && (
                  <div className="sm:w-32 flex-shrink-0">
                    <img
                      src={shipment.image}
                      alt={shipment.trackingNumber}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {shipment.trackingNumber}
                    </h3>
                    <Badge
                      size="sm"
                      color={
                        shipment.status === "Livré"
                          ? "success"
                          : shipment.status === "En transit" ||
                            shipment.status === "En livraison"
                          ? "info"
                          : shipment.status === "En attente"
                          ? "warning"
                          : "error"
                      }
                    >
                      {shipment.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>De :</strong> {shipment.sender} ({shipment.origin}
                      )
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>À :</strong> {shipment.destination}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Poids :</strong> {shipment.weight}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Livraison estimée :</strong>{" "}
                      {shipment.estimatedDelivery}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Date de commande :</strong> {shipment.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/client/suivi?tracking=${shipment.trackingNumber}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Suivre le colis
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Shipment Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] w-full max-h-[90vh] m-4"
      >
        <div className="flex flex-col max-h-[90vh] overflow-hidden p-5 lg:p-6">
          <div className="shrink-0 mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Créer une nouvelle expédition
            </h4>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveShipment();
            }}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              {/* Image Section */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Image du colis
                </h5>
                <div>
                  <Label>Importer une image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/3 dark:file:text-gray-400 dark:placeholder:text-gray-400"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <Label>Aperçu</Label>
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipment Details */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Détails de l'expédition
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Expéditeur</Label>
                    <input
                      type="text"
                      placeholder="Entrez le nom de l'expéditeur"
                      value={formData.sender}
                      onChange={(e) =>
                        setFormData({ ...formData, sender: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Destinataire</Label>
                    <input
                      type="text"
                      placeholder="Entrez le nom du destinataire"
                      value={formData.recipient}
                      onChange={(e) =>
                        setFormData({ ...formData, recipient: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Adresse de départ</Label>
                    <input
                      type="text"
                      placeholder="Entrez l'adresse de départ"
                      value={formData.origin}
                      onChange={(e) =>
                        setFormData({ ...formData, origin: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Adresse de destination</Label>
                    <input
                      type="text"
                      placeholder="Entrez l'adresse de destination"
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                        })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Poids</Label>
                    <input
                      type="text"
                      placeholder="ex: 2,5 kg"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Livraison estimée</Label>
                    <input
                      type="datetime-local"
                      value={formData.estimatedDelivery}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedDelivery: e.target.value,
                        })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 shrink-0 mt-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={closeModal}
              >
                Annuler
              </Button>
              <Button type="submit" size="sm">
                Créer l'expédition
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
