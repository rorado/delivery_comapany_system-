"use client";
import { useCallback, useEffect, useState } from "react";
import jsPDF from "jspdf";
import Badge from "@/components/ui/badge/Badge";
import { EyeIcon, CheckCircleIcon, PaperPlaneIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

import type { Delivery } from "@/types/delivery";
import { deliveryDeliveriesSeed } from "@/data/deliveryDeliveriesSeed";

const deliveryStatusLabels: Record<Delivery["status"], string> = {
  Pending: "En attente",
  "In Transit": "En transit",
  "Out for Delivery": "En livraison",
  Delivered: "Livré",
  Failed: "Échoué",
};

export default function MyDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(
    deliveryDeliveriesSeed
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Delivery | null>(null);
  const { isOpen, openModal, closeModal } = useModal(false);

  const saveDeliveriesToDb = async (nextDeliveries: Delivery[]) => {
    await fetch("/api/delivery/deliveries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDeliveries),
    });
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/delivery/deliveries", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as Delivery[];
        if (isMounted && Array.isArray(data)) setDeliveries(data);
      } catch {
        // keep seed
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: number, newStatus: Delivery["status"]) => {
    const nextDeliveries = deliveries.map((delivery) =>
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    );
    setDeliveries(nextDeliveries);
    void saveDeliveriesToDb(nextDeliveries);
  };

  const formatPriceDh = (value?: string) => {
    const v = (value ?? "").trim();
    if (!v) return "—";
    return /dh/i.test(v) ? v : `${v} DH`;
  };

  const fitText = (doc: jsPDF, value: string | undefined, maxWidth: number) => {
    const text = (value ?? "").trim() || "—";
    if (maxWidth <= 0) return text;
    if (doc.getTextWidth(text) <= maxWidth) return text;
    const ellipsis = "…";
    let cut = text;
    while (cut.length > 0 && doc.getTextWidth(cut + ellipsis) > maxWidth) {
      cut = cut.slice(0, -1);
    }
    return cut.length ? cut + ellipsis : ellipsis;
  };

  type LabelPayload = {
    trackingNumber: string;
    sender: string;
    senderPhone: string;
    recipient: string;
    recipientPhone: string;
    city: string;
    address: string;
    product: string;
    comment: string;
    price: string;
    createdAt: string;
    createdAtTime: string;
    qrDataUrl: string;
    barcodeDataUrl: string;
  };

  const handleExportPDF = useCallback(async (delivery: Delivery) => {
    const popup = window.open("", "_blank");
    if (popup) {
      try {
        popup.opener = null;
        popup.document.open();
        popup.document.write(
          "<!doctype html><html><head><meta charset='utf-8'/><title>Génération du PDF…</title></head><body><p style='font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif'>Génération du PDF…</p></body></html>"
        );
        popup.document.close();
      } catch {}
    }

    try {
      const url = new URL(
        `/api/client/colis-label/${encodeURIComponent(
          delivery.trackingNumber
        )}`,
        window.location.origin
      );
      // Pass known fields as best-effort fallbacks
      url.searchParams.set("recipient", delivery.recipient);
      url.searchParams.set("address", delivery.destination);

      const res = await fetch(url.toString(), { method: "GET" });
      if (!res.ok) {
        let details = "";
        try {
          details = await res.text();
        } catch {}
        const snippet = details ? details.slice(0, 200) : "";
        throw new Error(
          `Failed to load label (${res.status})${snippet ? `: ${snippet}` : ""}`
        );
      }
      const payload = (await res.json()) as LabelPayload;
      if (!payload || !payload.trackingNumber) {
        throw new Error("Invalid label payload");
      }

      const labelSize = 100;
      const doc = new jsPDF({ unit: "mm", format: [labelSize, labelSize] });
      const x0 = 0;
      const y0 = 0;
      const labelW = doc.internal.pageSize.getWidth();
      const labelH = doc.internal.pageSize.getHeight();

      const BLACK = { r: 0, g: 0, b: 0 };
      const GRAY = { r: 120, g: 120, b: 120 };
      const hexToRgb = (hex: string) => {
        const h = hex.trim().replace(/^#/, "");
        if (h.length === 3) {
          const r = parseInt(h[0] + h[0], 16);
          const g = parseInt(h[1] + h[1], 16);
          const b = parseInt(h[2] + h[2], 16);
          if ([r, g, b].some((n) => Number.isNaN(n))) return null;
          return { r, g, b };
        }
        if (h.length !== 6) return null;
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        if ([r, g, b].some((n) => Number.isNaN(n))) return null;
        return { r, g, b };
      };
      const brandHex =
        typeof window !== "undefined"
          ? getComputedStyle(document.documentElement)
              .getPropertyValue("--color-brand-500")
              .trim()
          : "";
      const BRAND = hexToRgb(brandHex) ?? { r: 70, g: 95, b: 255 };
      const ACCENT = BRAND;
      const setFillRgb = (c: { r: number; g: number; b: number }) =>
        doc.setFillColor(c.r, c.g, c.b);
      const setDrawRgb = (c: { r: number; g: number; b: number }) =>
        doc.setDrawColor(c.r, c.g, c.b);
      const setTextRgb = (c: { r: number; g: number; b: number }) =>
        doc.setTextColor(c.r, c.g, c.b);

      setDrawRgb(BLACK);
      doc.setLineWidth(0.4);
      doc.rect(x0, y0, labelW, labelH);

      const pad = 2;
      const innerX = x0 + pad;
      const innerY = y0 + pad;
      const innerW = labelW - pad * 2;
      const innerH = labelH - pad * 2;

      const headerH = 10;
      doc.setLineWidth(0.3);
      doc.rect(innerX, innerY, innerW, headerH);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      setTextRgb(BLACK);
      doc.text("FAST", innerX + 26, innerY + 6.8, { align: "right" });
      setTextRgb(ACCENT);
      doc.text("DELIVER", innerX + 27, innerY + 6.8, { align: "left" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      setTextRgb(GRAY);
      doc.text("Service de livraison", innerX + innerW / 2, innerY + 9, {
        align: "center",
      });

      const bandH = 6;
      const bandY = innerY + headerH;
      setFillRgb(ACCENT);
      doc.rect(innerX, bandY, innerW, bandH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setTextRgb({ r: 255, g: 255, b: 255 });
      const routeCode = delivery.trackingNumber.slice(0, 8) || "0-25-ZNE";
      doc.text(fitText(doc, routeCode, 28), innerX + 12, bandY + 4.2, {
        align: "center",
      });

      const rightColW = 34;
      const rightColX = innerX + innerW - rightColW;
      setFillRgb({ r: 255, g: 255, b: 255 });
      doc.rect(rightColX, bandY, rightColW, bandH, "F");
      setDrawRgb(BLACK);
      doc.rect(rightColX, bandY, rightColW, bandH);
      setTextRgb(BLACK);
      doc.setFontSize(9);
      doc.text(
        fitText(
          doc,
          (payload.city || "").toUpperCase() || "TETOUAN",
          rightColW - 4
        ),
        rightColX + rightColW / 2,
        bandY + 4.2,
        { align: "center" }
      );

      const bodyY = bandY + bandH;
      const bodyH = innerH - headerH - bandH - 18;
      const leftColW = innerW - rightColW - 2;
      const leftColX = innerX;
      const leftColY = bodyY;

      doc.setLineWidth(0.3);
      doc.rect(leftColX, leftColY, leftColW, bodyH);
      doc.rect(rightColX, leftColY, rightColW, bodyH);

      const senderBoxH = 14;
      doc.rect(leftColX, leftColY, leftColW, senderBoxH);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      setTextRgb(BLACK);
      const senderName = payload.sender || "—";
      const senderPhone = payload.senderPhone || "—";
      const dt = `${payload.createdAt || ""} ${
        payload.createdAtTime || ""
      }`.trim();
      doc.text(
        `Expéditeur: ${fitText(doc, senderName, leftColW - 22)}`,
        leftColX + 1.5,
        leftColY + 4.5
      );
      doc.text(
        `Téléphone: ${fitText(doc, senderPhone, leftColW - 24)}`,
        leftColX + 1.5,
        leftColY + 8.5
      );
      doc.text(
        `Date: ${fitText(doc, dt || "—", leftColW - 12)}`,
        leftColX + 1.5,
        leftColY + 12.5
      );

      const zoneY = leftColY + senderBoxH;
      const zoneH = 8;
      const zoneX = leftColX + leftColW - 30;
      setFillRgb(ACCENT);
      doc.rect(zoneX, zoneY, 30, zoneH, "F");
      setTextRgb({ r: 255, g: 255, b: 255 });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("NORD", zoneX + 15, zoneY + 5.6, { align: "center" });
      setTextRgb(BLACK);

      const recY = zoneY + zoneH + 1;
      const recH = bodyH - senderBoxH - zoneH - 2;
      doc.rect(leftColX, recY, leftColW, recH);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      const recName = payload.recipient || delivery.recipient || "—";
      const recPhone = payload.recipientPhone || "—";
      const city = payload.city || "—";
      const addr = payload.address || delivery.destination || "—";

      let ty = recY + 4.5;
      doc.text(
        `Destinataire: ${fitText(doc, recName, leftColW - 28)}`,
        leftColX + 1.5,
        ty
      );
      ty += 4;
      doc.text(
        `Téléphone: ${fitText(doc, recPhone, leftColW - 26)}`,
        leftColX + 1.5,
        ty
      );
      ty += 4;
      doc.text(
        `Ville: ${fitText(doc, city, leftColW - 12)}`,
        leftColX + 1.5,
        ty
      );
      ty += 4;
      setTextRgb(BLACK);
      doc.text("Adresse:", leftColX + 1.5, ty);
      doc.setFont("helvetica", "normal");
      const addrLines = doc.splitTextToSize(addr, leftColW - 12).slice(0, 2);
      doc.text(addrLines, leftColX + 13, ty);
      setTextRgb(BLACK);
      ty += 4 * addrLines.length;

      const qrBoxH = 28;
      doc.rect(rightColX, leftColY, rightColW, qrBoxH);
      const qrSize = 20;
      const qrImgX = rightColX + (rightColW - qrSize) / 2;
      const qrImgY = leftColY + 4;
      if (payload.qrDataUrl) {
        try {
          doc.addImage(
            payload.qrDataUrl,
            "PNG",
            qrImgX,
            qrImgY,
            qrSize,
            qrSize
          );
        } catch {}
      }

      const modeY = leftColY + qrBoxH;
      const modeH = 8;
      setFillRgb(ACCENT);
      doc.rect(rightColX, modeY, rightColW, modeH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      setTextRgb({ r: 255, g: 255, b: 255 });
      doc.text("À domicile", rightColX + rightColW / 2, modeY + 5.4, {
        align: "center",
      });

      const payY = modeY + modeH;
      const payH = 18;
      doc.rect(rightColX, payY, rightColW, payH);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text("CRBT: C/Espèce", rightColX + rightColW / 2, payY + 6, {
        align: "center",
      });
      doc.setFontSize(8);
      doc.text(
        fitText(doc, formatPriceDh(payload.price), rightColW - 4),
        rightColX + rightColW / 2,
        payY + 12,
        { align: "center" }
      );

      const thanksY = payY + payH;
      const thanksH = bodyH - qrBoxH - modeH - payH;
      doc.rect(rightColX, thanksY, rightColW, thanksH);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.8);
      setTextRgb(GRAY);
      doc.text(
        "Merci pour votre confiance.",
        rightColX + rightColW / 2,
        thanksY + Math.min(thanksH - 2, 7),
        { align: "center" }
      );

      const bottomY = innerY + innerH - 16;
      const bottomH = 10;
      doc.rect(innerX, bottomY, innerW, bottomH);
      const bcImgW = innerW - 30;
      const bcImgH = 6;
      const bcImgX = innerX + 4;
      const bcImgY = bottomY + 1.5;
      if (payload.barcodeDataUrl) {
        try {
          doc.addImage(
            payload.barcodeDataUrl,
            "PNG",
            bcImgX,
            bcImgY,
            bcImgW,
            bcImgH
          );
        } catch {}
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      setTextRgb(BLACK);
      doc.text(
        fitText(doc, payload.trackingNumber, 26),
        innerX + innerW - 2,
        bottomY + 7.5,
        { align: "right" }
      );

      const footerY = innerY + innerH - 6;
      const footerH = 6;
      setFillRgb(ACCENT);
      doc.rect(innerX, footerY, innerW, footerH, "F");
      setTextRgb({ r: 255, g: 255, b: 255 });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(
        "Merci d'avoir choisi notre service.",
        innerX + innerW / 2,
        footerY + 4.2,
        { align: "center" }
      );

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      if (popup && !popup.closed) {
        popup.location.href = pdfUrl;
        popup.focus();
      } else {
        const opened = window.open(pdfUrl, "_blank");
        if (opened) {
          try {
            opened.opener = null;
            opened.focus();
          } catch {}
        } else {
          window.location.href = pdfUrl;
        }
      }
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    } catch (e) {
      console.error(e);
      if (popup) popup.close();
      const message = e instanceof Error ? e.message : String(e);
      window.alert(`Impossible de générer le PDF: ${message}`);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Mes livraisons
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Gérez et suivez vos livraisons assignées.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par numéro, destinataire ou destination..."
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
            <option value="Pending">En attente</option>
            <option value="In Transit">En transit</option>
            <option value="Out for Delivery">En livraison</option>
            <option value="Delivered">Livré</option>
            <option value="Failed">Échoué</option>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            {
              deliveries.filter(
                (d) =>
                  d.status === "In Transit" || d.status === "Out for Delivery"
              ).length
            }
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
            <p className="text-gray-500 dark:text-gray-400">
              Aucune livraison trouvée
            </p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                          : delivery.status === "In Transit" ||
                            delivery.status === "Out for Delivery"
                          ? "info"
                          : delivery.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {deliveryStatusLabels[delivery.status]}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Destinataire :</strong> {delivery.recipient}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Destination :</strong> {delivery.destination}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Poids :</strong> {delivery.weight}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Livraison estimée :</strong>{" "}
                      {delivery.estimatedDelivery}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {delivery.status === "Out for Delivery" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(delivery.id, "Delivered")
                      }
                    >
                      Marquer comme livré
                    </Button>
                  )}
                  {delivery.status === "In Transit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(delivery.id, "Out for Delivery")
                      }
                    >
                      Démarrer la livraison
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(delivery);
                      openModal();
                    }}
                  >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Voir les détails
                  </Button>
                  <Button size="sm" onClick={() => handleExportPDF(delivery)}>
                    Exporter en PDF
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl p-6">
        {selected && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Détails de la livraison
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Numéro de suivi</Label>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {selected.trackingNumber}
                </p>
              </div>
              <div>
                <Label>Destinataire</Label>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {selected.recipient}
                </p>
              </div>
              <div>
                <Label>Destination</Label>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {selected.destination}
                </p>
              </div>
              <div>
                <Label>Statut</Label>
                <p className="mt-1">
                  <Badge
                    size="sm"
                    color={
                      selected.status === "Delivered"
                        ? "success"
                        : selected.status === "In Transit" ||
                          selected.status === "Out for Delivery"
                        ? "info"
                        : selected.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {deliveryStatusLabels[selected.status]}
                  </Badge>
                </p>
              </div>
              <div>
                <Label>Livraison estimée</Label>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {selected.estimatedDelivery}
                </p>
              </div>
              <div>
                <Label>Poids</Label>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {selected.weight}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={() => handleExportPDF(selected)}>
                Exporter en PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
