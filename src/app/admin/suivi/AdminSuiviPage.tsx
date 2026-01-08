"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import type { Shipment } from "@/types/expedition";

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

export default function AdminSuiviPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const initial = searchParams.get("tracking") || "";
    setQuery(initial);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/admin/expeditions", { method: "GET" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = (await res.json()) as Shipment[];
        if (!Array.isArray(data)) throw new Error("Invalid payload");
        if (!mounted) return;
        setShipments(data);
      } catch {
        if (!mounted) return;
        setShipments([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shipments;
    return shipments.filter((s) => s.packageNumber.toLowerCase().includes(q));
  }, [shipments, query]);

  useEffect(() => {
    if (!query) {
      setSelected(null);
      return;
    }
    const exact = shipments.find((s) => s.packageNumber === query);
    if (exact) setSelected(exact);
  }, [query, shipments]);

  const getStatusColor = (status: Shipment["status"]) => {
    if (status === "Delivered") return "success" as const;
    if (status === "In Transit" || status === "Out for Delivery")
      return "info" as const;
    if (status === "Pending") return "warning" as const;
    return "error" as const;
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

  const drawLabelPage = (
    doc: jsPDF,
    payload: LabelPayload,
    shipment: Shipment
  ) => {
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
    const routeCode = shipment.packageNumber.slice(0, 8) || "0-25-ZNE";
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
    const senderName = payload.sender || shipment.sender || "—";
    const senderPhone = payload.senderPhone || shipment.senderPhone || "—";
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
    const recName = payload.recipient || shipment.recipient || "—";
    const recPhone = payload.recipientPhone || shipment.recipientPhone || "—";
    const city = payload.city || shipment.city || shipment.origin || "—";
    const addr =
      payload.address || shipment.address || shipment.destination || "—";
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
    doc.text(`Ville: ${fitText(doc, city, leftColW - 12)}`, leftColX + 1.5, ty);
    ty += 4;
    setTextRgb(BLACK);
    doc.text("Adresse:", leftColX + 1.5, ty);
    doc.setFont("helvetica", "normal");
    const addrLines = doc.splitTextToSize(addr, leftColW - 12).slice(0, 2);
    doc.text(addrLines, leftColX + 13, ty);
    setTextRgb(BLACK);

    const qrBoxH = 28;
    doc.rect(rightColX, leftColY, rightColW, qrBoxH);
    const qrSize = 20;
    const qrImgX = rightColX + (rightColW - qrSize) / 2;
    const qrImgY = leftColY + 4;
    if (payload.qrDataUrl) {
      try {
        doc.addImage(payload.qrDataUrl, "PNG", qrImgX, qrImgY, qrSize, qrSize);
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
  };

  const handleExportPDF = useCallback(async (shipment: Shipment) => {
    const popup = window.open("", "_blank");
    if (popup) {
      try {
        popup.opener = null;
        popup.document.open();
        popup.document.write(
          "<!doctype html><html><head><meta charset='utf-8'/><title>Génération du PDF…</title></head><body><p style='font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif'>Génération du PDF…</p></body></html>"
        );
        popup.document.close();
      } catch {
        // ignore
      }
    }

    try {
      const url = new URL(
        `/api/admin/colis-label/${encodeURIComponent(shipment.packageNumber)}`,
        window.location.origin
      );
      url.searchParams.set("sender", shipment.sender);
      url.searchParams.set("senderPhone", shipment.senderPhone);
      url.searchParams.set("recipient", shipment.recipient);
      url.searchParams.set("recipientPhone", shipment.recipientPhone);
      url.searchParams.set("city", shipment.city || shipment.origin || "");
      url.searchParams.set("address", shipment.address || shipment.destination);
      url.searchParams.set("price", shipment.price || "");
      url.searchParams.set("comment", shipment.comment || "");
      url.searchParams.set("product", shipment.product || "");
      url.searchParams.set("createdAt", shipment.createdAt || "");
      url.searchParams.set("createdAtTime", shipment.createdAtTime || "");

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
      drawLabelPage(doc, payload, shipment);

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
      if (popup) popup.close();
      const message = e instanceof Error ? e.message : String(e);
      window.alert(`Impossible de générer le PDF: ${message}`);
    }
  }, []);

  const handleSelect = useCallback(
    (s: Shipment) => {
      setSelected(s);
      const params = new URLSearchParams(window.location.search);
      params.set("tracking", s.packageNumber);
      router.replace(`?${params.toString()}`);
    },
    [router]
  );

  const handleSave = useCallback(async () => {
    if (!selected || !formRef.current) return;
    setIsSaving(true);
    try {
      const form = new FormData(formRef.current);
      const updated: Shipment = {
        ...selected,
        sender: String(form.get("sender") || selected.sender),
        senderPhone: String(form.get("senderPhone") || selected.senderPhone),
        recipient: String(form.get("recipient") || selected.recipient),
        recipientPhone: String(
          form.get("recipientPhone") || selected.recipientPhone
        ),
        origin: String(form.get("origin") || selected.origin),
        destination: String(form.get("destination") || selected.destination),
        city: String(form.get("city") || selected.city),
        address: String(form.get("address") || selected.address),
        weight: String(form.get("weight") || selected.weight),
        product: String(form.get("product") || selected.product),
        comment: String(form.get("comment") || selected.comment),
        price: String(form.get("price") || selected.price),
        status: String(
          form.get("status") || selected.status
        ) as Shipment["status"],
        driver: String(form.get("driver") || selected.driver),
        estimatedDelivery: String(
          form.get("estimatedDelivery") || selected.estimatedDelivery
        ),
        createdAt: String(form.get("createdAt") || selected.createdAt),
        createdAtTime: String(
          form.get("createdAtTime") || selected.createdAtTime
        ),
      };
      const next = shipments.map((s) => (s.id === updated.id ? updated : s));
      setShipments(next);
      setSelected(updated);
      const res = await fetch("/api/admin/expeditions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setIsEditing(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      window.alert(`Échec de la sauvegarde: ${message}`);
    } finally {
      setIsSaving(false);
    }
  }, [selected, shipments]);

  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-theme-sm text-gray-500 dark:text-gray-400">
          Chargement…
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Suivi de colis
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Recherchez par code d'envoi et gérez les détails.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Entrer le code d'envoi (packageNumber)"
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
            />
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (results.length > 0) handleSelect(results[0]);
              }}
            >
              Rechercher
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
              <h2 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
                Résultats{" "}
                {isLoading ? "(chargement...)" : `(${results.length})`}
              </h2>
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {results.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      selected?.id === s.id
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {s.packageNumber}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {s.recipient}
                        </p>
                      </div>
                      <Badge size="sm" color={getStatusColor(s.status)}>
                        {s.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {!isLoading && results.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    Aucun colis trouvé
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!selected ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500 dark:border-gray-800 dark:bg-white/3 dark:text-gray-400">
                Sélectionnez un colis pour voir les détails.
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                      {selected.packageNumber}
                    </h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {selected.sender} → {selected.recipient}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge size="sm" color={getStatusColor(selected.status)}>
                      {selected.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportPDF(selected)}
                    >
                      Exporter PDF
                    </Button>
                    {!isEditing ? (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        Éditer
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                        >
                          {isSaving ? "Enregistrement…" : "Sauvegarder"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                          disabled={isSaving}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <form
                  ref={formRef}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Code Envoi
                    </label>
                    <input
                      type="text"
                      value={selected.packageNumber}
                      disabled
                      className="mt-1 h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm dark:border-gray-800 dark:bg-gray-900"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Statut
                    </label>
                    <select
                      name="status"
                      defaultValue={selected.status}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Expéditeur
                    </label>
                    <input
                      name="sender"
                      type="text"
                      defaultValue={selected.sender}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Tél. Expéditeur
                    </label>
                    <input
                      name="senderPhone"
                      type="text"
                      defaultValue={selected.senderPhone}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Destinataire
                    </label>
                    <input
                      name="recipient"
                      type="text"
                      defaultValue={selected.recipient}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Tél. Destinataire
                    </label>
                    <input
                      name="recipientPhone"
                      type="text"
                      defaultValue={selected.recipientPhone}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Ville
                    </label>
                    <input
                      name="city"
                      type="text"
                      defaultValue={selected.city}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Adresse
                    </label>
                    <input
                      name="address"
                      type="text"
                      defaultValue={selected.address}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Origine
                    </label>
                    <input
                      name="origin"
                      type="text"
                      defaultValue={selected.origin}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Destination
                    </label>
                    <input
                      name="destination"
                      type="text"
                      defaultValue={selected.destination}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Poids
                    </label>
                    <input
                      name="weight"
                      type="text"
                      defaultValue={selected.weight}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Produit
                    </label>
                    <input
                      name="product"
                      type="text"
                      defaultValue={selected.product}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Prix
                    </label>
                    <input
                      name="price"
                      type="text"
                      defaultValue={selected.price}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Chauffeur
                    </label>
                    <input
                      name="driver"
                      type="text"
                      defaultValue={selected.driver}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Livraison estimée
                    </label>
                    <input
                      name="estimatedDelivery"
                      type="text"
                      defaultValue={selected.estimatedDelivery}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Commentaire
                    </label>
                    <textarea
                      name="comment"
                      defaultValue={selected.comment}
                      disabled={!isEditing}
                      className="mt-1 min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Créé le
                    </label>
                    <input
                      name="createdAt"
                      type="text"
                      defaultValue={selected.createdAt}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-theme-xs text-gray-500 dark:text-gray-400">
                      Heure création
                    </label>
                    <input
                      name="createdAtTime"
                      type="text"
                      defaultValue={selected.createdAtTime}
                      disabled={!isEditing}
                      className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 disabled:bg-gray-50 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
