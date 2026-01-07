"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import Badge from "@/components/ui/badge/Badge";
import { CalenderIcon, DownloadIcon, MoreDotIcon, PlusIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";

import type { Shipment } from "@/types/expedition";

export default function AdminColisListePage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lastUrlStatus = useRef<string | null>(null);
  const lastUrlNew = useRef<string | null>(null);
  const isColisRoute = pathname.startsWith("/admin/colis");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());

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

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      return statusFilter === "all" || shipment.status === statusFilter;
    });
  }, [shipments, statusFilter]);

  const pageShipments = useMemo(() => {
    return filteredShipments.slice(0, pageSize);
  }, [filteredShipments, pageSize]);

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
        router.replace("/admin/colis/nouveau");
      }
      lastUrlNew.current = urlNew;
    }
  }, [router, searchParams]);

  const allVisibleSelected =
    pageShipments.length > 0 &&
    pageShipments.every((s) => selectedIds.has(s.id));

  const toggleSelectAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        pageShipments.forEach((s) => next.delete(s.id));
      } else {
        pageShipments.forEach((s) => next.add(s.id));
      }
      return next;
    });
  }, [allVisibleSelected, pageShipments]);

  const toggleSelectOne = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const formatRangeLabel = useMemo(() => {
    const now = new Date();
    const endLabel = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `Jul 1, 2023 – ${endLabel}`;
  }, []);

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

  const getStatusColor = (status: Shipment["status"]) => {
    if (status === "Delivered") return "success" as const;
    if (status === "In Transit" || status === "Out for Delivery")
      return "info" as const;
    if (status === "Pending") return "warning" as const;
    return "error" as const;
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
        } catch {
          // ignore
        }
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
      doc.text("OZON", innerX + 26, innerY + 6.8, { align: "right" });
      setTextRgb(ACCENT);
      doc.text("EXPRESS", innerX + 27, innerY + 6.8, { align: "left" });

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
      const comment = (payload.comment || shipment.comment || "").trim();
      const product = (payload.product || shipment.product || "").trim();

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
      doc.setFont("helvetica", "bold");
      void comment;
      void product;

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
        } catch {
          // ignore
        }
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

      setTextRgb(BLACK);
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
        } catch {
          // ignore
        }
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
          } catch {
            // ignore
          }
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Liste Des Colis
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="w-full sm:w-24">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <Button size="sm" variant="outline" onClick={() => {}}>
            Filters
          </Button>

          <Button
            size="sm"
            variant="outline"
            startIcon={<DownloadIcon className="h-4 w-4" />}
            onClick={() => {}}
          >
            Exporter Les Colis
          </Button>

          <Button
            size="sm"
            variant="outline"
            startIcon={<CalenderIcon className="h-4 w-4" />}
            onClick={() => {}}
            className="justify-between"
          >
            {formatRangeLabel}
          </Button>

          <Button
            size="sm"
            variant="primary"
            startIcon={<PlusIcon className="h-4 w-4" />}
            onClick={handleAddColis}
          >
            Nouveau Colis
          </Button>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {pageShipments.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-white/5 dark:bg-white/3">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun colis trouvé
            </p>
          </div>
        ) : (
          pageShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/admin/suivi?tracking=${shipment.packageNumber}`}
                    className="text-theme-sm font-semibold text-gray-800 underline underline-offset-2 dark:text-white/90"
                  >
                    {shipment.packageNumber}
                  </Link>
                  <div className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    {shipment.createdAt}
                    {shipment.createdAtTime ? ` ${shipment.createdAtTime}` : ""}
                  </div>
                </div>
                <Badge size="sm" color={getStatusColor(shipment.status)}>
                  {shipment.status}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    Destinataire
                  </div>
                  <div className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {shipment.recipient}
                  </div>
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    {shipment.recipientPhone || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    Ville
                  </div>
                  <div className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                    {shipment.city || shipment.origin || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    Prix
                  </div>
                  <div className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatPriceDh(shipment.price)}
                  </div>
                </div>
                <div>
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    Etat
                  </div>
                  <Badge size="sm" color="warning">
                    Non Payé
                  </Badge>
                </div>
              </div>

              {shipment.comment && (
                <div className="mt-3">
                  <div className="text-theme-xs text-gray-500 dark:text-gray-400">
                    Commentaire
                  </div>
                  <div className="mt-1 text-theme-sm text-gray-700 dark:text-gray-300">
                    {shipment.comment}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleExportPDF(shipment)}
                >
                  Exporter en PDF
                </Button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/6"
                  aria-label="Actions"
                >
                  <MoreDotIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 lg:block">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    <input
                      aria-label="Select all"
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-5 w-5 rounded border-gray-300 bg-white text-brand-500 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900"
                    />
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Code Envoi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Destinataire
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Ville
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Prix
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Etat
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Statut
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Ramassage
                    <br />
                    Dernier Statut
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Documents PDF
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {pageShipments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="px-6 py-10 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                    >
                      Aucun colis trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  pageShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="align-middle">
                      <TableCell className="px-4 py-4 text-start">
                        <input
                          aria-label={`Select ${shipment.packageNumber}`}
                          type="checkbox"
                          checked={selectedIds.has(shipment.id)}
                          onChange={() => toggleSelectOne(shipment.id)}
                          className="h-5 w-5 rounded border-gray-300 bg-white text-brand-500 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900"
                        />
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <div className="space-y-1">
                          <Link
                            href={`/admin/suivi?tracking=${shipment.packageNumber}`}
                            className="block text-theme-sm font-semibold text-gray-800 underline underline-offset-2 dark:text-white/90"
                          >
                            {shipment.packageNumber}
                          </Link>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                            {shipment.createdAt}
                            {shipment.createdAtTime
                              ? ` ${shipment.createdAtTime}`
                              : ""}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <div className="space-y-1">
                          <span className="block text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                            {shipment.recipient}
                          </span>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                            {shipment.recipientPhone || "—"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {shipment.city || shipment.origin || "—"}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                        {formatPriceDh(shipment.price)}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <Badge size="sm" color="warning">
                          Non Payé
                        </Badge>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          size="sm"
                          color={getStatusColor(shipment.status)}
                        >
                          {shipment.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <div className="space-y-1">
                          <span className="block text-theme-sm text-gray-800 dark:text-white/90">
                            <span className="inline-flex items-center gap-2">
                              <CalenderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span>
                                {shipment.createdAt}
                                {shipment.createdAtTime
                                  ? ` ${shipment.createdAtTime}`
                                  : ""}
                              </span>
                            </span>
                          </span>
                          <span className="block text-theme-sm text-gray-800 dark:text-white/90">
                            <span className="inline-flex items-center gap-2">
                              <CalenderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span>{shipment.estimatedDelivery || "—"}</span>
                            </span>
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleExportPDF(shipment)}
                        >
                          Exporter en PDF
                        </Button>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/6"
                          aria-label="Actions"
                        >
                          <MoreDotIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
