"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import jsPDF from "jspdf";

import type { Shipment } from "@/types/expedition";

export default function ShipmentsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lastUrlStatus = useRef<string | null>(null);
  const lastUrlNew = useRef<string | null>(null);
  const isColisRoute = pathname.startsWith("/admin/colis");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isDetailOpen,
    openModal: openDetailModal,
    closeModal: closeDetailModal,
  } = useModal();
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [viewingShipment, setViewingShipment] = useState<Shipment | null>(null);
  const [deletingShipment, setDeletingShipment] = useState<Shipment | null>(
    null
  );
  const [formData, setFormData] = useState({
    sender: "",
    senderPhone: "",
    recipient: "",
    recipientPhone: "",
    origin: "",
    destination: "",
    city: "",
    address: "",
    weight: "",
    product: "",
    comment: "",
    price: "",
    driver: "",
    estimatedDelivery: "",
    status: "Pending" as Shipment["status"],
  });

  const saveShipmentsToDb = async (nextShipments: Shipment[]) => {
    await fetch("/api/admin/expeditions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextShipments),
    });
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/expeditions", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as Shipment[];
        if (isMounted && Array.isArray(data)) setShipments(data);
      } catch {
        if (isMounted) setShipments([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    closeFilter();
  };

  // Filter shipments
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.packageNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddShipment = useCallback(() => {
    setEditingShipment(null);
    setFormData({
      sender: "Deliverio",
      senderPhone: "0667449851",
      recipient: "",
      recipientPhone: "",
      origin: "",
      destination: "",
      city: "",
      address: "",
      weight: "",
      product: "",
      comment: "",
      price: "",
      driver: "",
      estimatedDelivery: "",
      status: "Pending",
    });
    openModal();
  }, [openModal]);

  const handleAddColis = useCallback(() => {
    router.push("/admin/colis/nouveau");
  }, [router]);

  useEffect(() => {
    if (!isColisRoute) return;

    if (pathname.endsWith("/ramassage")) {
      setStatusFilter("Pending");
      return;
    }

    if (pathname.endsWith("/liste")) {
      setStatusFilter("all");
    }
  }, [isColisRoute, pathname]);

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    const urlNew = searchParams.get("new");

    if (urlStatus !== lastUrlStatus.current) {
      setStatusFilter(urlStatus ?? "all");
      lastUrlStatus.current = urlStatus;
    }

    if (urlNew !== lastUrlNew.current) {
      if (urlNew === "1") {
        if (isColisRoute) {
          router.replace("/admin/colis/nouveau");
        } else {
          handleAddShipment();
        }
      }
      lastUrlNew.current = urlNew;
    }
  }, [handleAddShipment, isColisRoute, router, searchParams]);

  const handleEditShipment = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setFormData({
      sender: shipment.sender,
      senderPhone: shipment.senderPhone,
      recipient: shipment.recipient,
      recipientPhone: shipment.recipientPhone,
      origin: shipment.origin,
      destination: shipment.destination,
      city: shipment.city,
      address: shipment.address,
      weight: shipment.weight,
      product: shipment.product,
      comment: shipment.comment,
      price: shipment.price,
      driver: shipment.driver,
      estimatedDelivery: shipment.estimatedDelivery,
      status: shipment.status,
    });
    openModal();
  };

  const handleRequestDeleteShipment = (shipment: Shipment) => {
    setDeletingShipment(shipment);
    openDeleteModal();
  };

  const handleConfirmDeleteShipment = () => {
    if (!deletingShipment) return;
    const nextShipments = shipments.filter((s) => s.id !== deletingShipment.id);
    setShipments(nextShipments);
    void saveShipmentsToDb(nextShipments);
    closeDeleteModal();
    setDeletingShipment(null);
  };

  const handleViewPackage = (shipment: Shipment) => {
    setViewingShipment(shipment);
    openDetailModal();
  };

  const handleExportPDF = (shipment: Shipment) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let yPos = margin;

    // Colors
    const primaryColor = "#4a90e2";
    const secondaryColor = "#f5f5f5";
    const grayColor = "#666";

    // --- HEADER ---
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setFontSize(22);
    doc.setTextColor("#fff");
    doc.setFont("helvetica", "bold");
    doc.text("Détails du Colis", pageWidth / 2, 50, { align: "center" });

    yPos = 100;

    // --- SENDER & RECIPIENT SECTION ---
    doc.setFontSize(12);
    doc.setTextColor(grayColor);
    doc.setFont("helvetica", "bold");
    doc.text("Expéditeur", margin, yPos);
    doc.text("Destinataire", pageWidth / 2 + 10, yPos);
    yPos += 15;

    doc.setFont("helvetica", "normal");
    doc.text(shipment.sender, margin, yPos);
    doc.text(shipment.recipient, pageWidth / 2 + 10, yPos);
    yPos += 15;

    doc.text("Tél: " + shipment.senderPhone, margin, yPos);
    doc.text("Tél: " + shipment.recipientPhone, pageWidth / 2 + 10, yPos);
    yPos += 15;

    doc.text("Ville: " + shipment.city, margin, yPos);
    doc.text("Adresse: " + shipment.address, pageWidth / 2 + 10, yPos);
    yPos += 30;

    // --- PACKAGE INFO BOX ---
    doc.setFillColor(secondaryColor);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 80, 5, 5, "F");
    doc.setTextColor(grayColor);
    doc.setFont("helvetica", "bold");
    doc.text("#NUMÉRO DE COLIS:", margin + 10, yPos + 20);
    doc.setFont("helvetica", "normal");
    doc.text(shipment.packageNumber, margin + 150, yPos + 20);

    doc.setFont("helvetica", "bold");
    doc.text("Produit:", margin + 10, yPos + 40);
    doc.setFont("helvetica", "normal");
    doc.text(shipment.product, margin + 150, yPos + 40);

    doc.setFont("helvetica", "bold");
    doc.text("Commentaire:", margin + 10, yPos + 60);
    doc.setFont("helvetica", "normal");
    doc.text(shipment.comment || "-", margin + 150, yPos + 60);

    yPos += 100;

    // --- PRICE SECTION ---
    doc.setFillColor(primaryColor);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, "F");
    doc.setTextColor("#fff");
    doc.setFont("helvetica", "bold");
    doc.text("Prix: " + shipment.price, margin + 10, yPos + 25);

    yPos += 60;

    // --- DATE & STATUS ---
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor);
    doc.text(
      "Date: " + shipment.createdAt + " " + shipment.createdAtTime,
      margin,
      yPos
    );
    doc.text("Statut: " + shipment.status, pageWidth / 2, yPos);

    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setTextColor("#999");
    doc.text(
      "Merci d'avoir choisi notre service de livraison.",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 30,
      { align: "center" }
    );

    // Open PDF in new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const handleSaveShipment = () => {
    if (editingShipment) {
      // Update existing shipment
      const nextShipments = shipments.map((shipment) =>
        shipment.id === editingShipment.id
          ? {
              ...shipment,
              ...formData,
              packageNumber: shipment.packageNumber,
              createdAt: shipment.createdAt,
              createdAtTime: shipment.createdAtTime,
            }
          : shipment
      );
      setShipments(nextShipments);
      void saveShipmentsToDb(nextShipments);
    } else {
      // Add new shipment
      const newId =
        shipments.length > 0 ? Math.max(...shipments.map((s) => s.id)) + 1 : 1;
      const now = new Date();
      const dateStr = now.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newShipment: Shipment = {
        id: newId,
        packageNumber: `TANG${String(newId + 142).padStart(6, "0")}MA`,
        ...formData,
        createdAt: dateStr,
        createdAtTime: timeStr,
      };
      const nextShipments = [...shipments, newShipment];
      setShipments(nextShipments);
      void saveShipmentsToDb(nextShipments);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Gestion des expéditions
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérer et suivre toutes les expéditions et livraisons depuis cette
            page.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {isColisRoute && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/admin/colis/liste")}
              >
                Liste des colis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/admin/colis/ramassage")}
              >
                Colis pour ramassage
              </Button>
            </>
          )}
          <button
            onClick={isColisRoute ? handleAddColis : handleAddShipment}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter un nouveau colis
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher des envois par numéro de suivi, expéditeur ou destinataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div className="relative">
          <button
            onClick={toggleFilter}
            className="dropdown-toggle inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 h-11"
          >
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            {`Filtrer${
              statusFilter !== "all"
                ? ": " +
                  (statusFilter === "Out for Delivery"
                    ? "En cours de livraison"
                    : statusFilter === "In Transit"
                    ? "En transit"
                    : statusFilter === "Delivered"
                    ? "Livré"
                    : statusFilter === "Pending"
                    ? "En attente"
                    : statusFilter === "Failed"
                    ? "Échoué"
                    : "Tous")
                : ""
            }`}
          </button>
          <Dropdown
            isOpen={isFilterOpen}
            onClose={closeFilter}
            className="w-56"
          >
            <div className="p-2">
              <div className="mb-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                Filtrer par statut
              </div>
              <DropdownItem
                onClick={() => handleStatusFilter("all")}
                className={`px-4 py-2 text-sm rounded-lg ${
                  statusFilter === "all"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                Tous les statuts
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusFilter("Pending")}
                className={`px-4 py-2 text-sm rounded-lg ${
                  statusFilter === "Pending"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                En attente
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusFilter("In Transit")}
                className={`px-4 py-2 text-sm rounded-lg ${
                  statusFilter === "In Transit"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                En transit
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusFilter("Out for Delivery")}
                className={`px-4 py-2 text-sm rounded-lg ${
                  statusFilter === "Out for Delivery"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                En cours de livraison
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusFilter("Delivered")}
                className={`px-4 py-2 text-sm rounded-lg ${
                  statusFilter === "Delivered"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                Livré
              </DropdownItem>
              <DropdownItem
                onClick={() => handleStatusFilter("Failed")}
                className={`px-4 py-2 text-sm rounded-lg ${
                  statusFilter === "Failed"
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
              >
                Échoué
              </DropdownItem>
            </div>
          </Dropdown>
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
                  N° de suivi
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Expéditeur / Destinataire
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Itinéraire
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Poids
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
                  Prix
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Échéance
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
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucune expédition trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {shipment.packageNumber}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {shipment.createdAt} {shipment.createdAtTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="text-gray-800 text-theme-sm dark:text-white/90">
                          De : {shipment.sender}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          À : {shipment.recipient}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {shipment.origin}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          → {shipment.destination}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {shipment.weight}
                    </TableCell>
                    <TableCell className="px-5 py-3">
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
                        {shipment.status === "Out for Delivery"
                          ? "En cours de livraison"
                          : shipment.status === "In Transit"
                          ? "En transit"
                          : shipment.status === "Delivered"
                          ? "Livré"
                          : shipment.status === "Pending"
                          ? "En attente"
                          : "Échoué"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {shipment.price}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {shipment.estimatedDelivery}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPackage(shipment)}
                          className="p-2 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400"
                          title="Voir le colis"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditShipment(shipment)}
                          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                          title="Modifier"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRequestDeleteShipment(shipment)}
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

      {/* Package Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        className="max-w-[600px] w-full max-h-[90vh] m-4 overflow-hidden p-0"
      >
        {viewingShipment && (
          <div className="flex max-h-[90vh] flex-col">
            <div className="flex items-center justify-between p-5 lg:p-8">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Détails du colis
              </h4>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Fermer"
                type="button"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5 lg:px-8 lg:pb-8 custom-scrollbar">
              <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div>
                  <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
                    Expéditeur
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400">
                    {viewingShipment.sender}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tél : {viewingShipment.senderPhone}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Date : {viewingShipment.createdAt}{" "}
                    {viewingShipment.createdAtTime}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
                    Destinataire
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400">
                    {viewingShipment.recipient}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tél : {viewingShipment.recipientPhone}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ville : {viewingShipment.city}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Adresse : {viewingShipment.address}
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
                    Numéro de colis
                  </h5>
                  <p className="text-lg font-bold text-gray-800 dark:text-white/90">
                    {viewingShipment.packageNumber}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Produit : {viewingShipment.product}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Commentaire : {viewingShipment.comment || "-"}
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-800 dark:text-white/90">
                    {viewingShipment.price}
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-gray-200 p-5 dark:border-gray-700 lg:p-8">
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={closeDetailModal}
                >
                  Fermer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleExportPDF(viewingShipment)}
                >
                  Exporter en PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[900px] w-full max-h-[90vh] m-4"
      >
        <div className="flex flex-col max-h-[90vh] overflow-hidden p-5 lg:p-6">
          <div className="shrink-0 mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {editingShipment ? "Modifier l’envoi" : "Ajouter un nouvel envoi"}
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
              {/* Sender Section */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Informations Expéditeur
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Expéditeur</Label>
                    <input
                      type="text"
                      placeholder="Entrez le nom de l’expéditeur"
                      value={formData.sender}
                      onChange={(e) =>
                        setFormData({ ...formData, sender: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Téléphone Expéditeur</Label>
                    <input
                      type="text"
                      placeholder="ex. 0667449851"
                      value={formData.senderPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          senderPhone: e.target.value,
                        })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Section */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Informations Destinataire
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Destinataire</Label>
                    <input
                      type="text"
                      placeholder="Entrez le nom du destinataire"
                      value={formData.recipient}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipient: e.target.value,
                        })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Téléphone Destinataire</Label>
                    <input
                      type="text"
                      placeholder="ex. 0690201401"
                      value={formData.recipientPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipientPhone: e.target.value,
                        })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300
                        dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <input
                      type="text"
                      placeholder="Entrez la ville"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <input
                      type="text"
                      placeholder="Entrez l’adresse"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Details Section */}
              <div className="space-y-4">
                <h5
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200
                 dark:border-gray-700 pb-2"
                >
                  Détails d'Expédition
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Origine</Label>
                    <input
                      type="text"
                      placeholder="Entrez l’adresse d’origine"
                      value={formData.origin}
                      onChange={(e) =>
                        setFormData({ ...formData, origin: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2
                       focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Destination</Label>
                    <input
                      type="text"
                      placeholder="Entrez l’adresse de destination"
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                        })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2
                       focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Produit</Label>
                    <input
                      type="text"
                      placeholder="Entrez le nom du produit"
                      value={formData.product}
                      onChange={(e) =>
                        setFormData({ ...formData, product: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2
                       focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Prix</Label>
                    <input
                      type="text"
                      placeholder="ex. 800 DH"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Poids</Label>
                    <input
                      type="text"
                      placeholder="ex. 2,5 kg"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Commentaire</Label>
                    <input
                      type="text"
                      placeholder="Entrez un commentaire (facultatif)"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2
                       focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Status Section */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Livraison & Statut
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Livreur</Label>
                    <input
                      type="text"
                      placeholder="Entrez le nom du livreur"
                      value={formData.driver}
                      onChange={(e) =>
                        setFormData({ ...formData, driver: e.target.value })
                      }
                      required
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label>Livraison estimée</Label>
                    <input
                      type="date"
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
                  <div>
                    <Label>Statut</Label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Shipment["status"],
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2
                       focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    >
                      <option value="Pending">En attente</option>
                      <option value="In Transit">En transit</option>
                      <option value="Out for Delivery">
                        En cours de livraison
                      </option>
                      <option value="Delivered">Livré</option>
                      <option value="Failed">Échoué</option>
                    </select>
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
                {editingShipment ? "Mettre à jour l’envoi" : "Ajouter l’envoi"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          closeDeleteModal();
          setDeletingShipment(null);
        }}
        onConfirm={handleConfirmDeleteShipment}
        title="Supprimer cet envoi ?"
        description={
          deletingShipment
            ? `Cette action est irréversible. Colis: ${deletingShipment.packageNumber}`
            : "Cette action est irréversible."
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
