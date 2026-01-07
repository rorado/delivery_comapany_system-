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

import type { ClientShipment } from "@/types/clientShipment";
import { clientShipmentsSeed } from "@/data/clientShipmentsSeed";

export default function MyShipmentsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lastUrlStatus = useRef<string | null>(null);
  const lastUrlNew = useRef<string | null>(null);
  const isColisRoute = pathname.startsWith("/client/colis");
  const [shipments, setShipments] =
    useState<ClientShipment[]>(clientShipmentsSeed);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/client/shipments", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as ClientShipment[];
        if (isMounted && Array.isArray(data)) setShipments(data);
      } catch {
        // keep seed
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredShipments = useMemo(() => {
    const byStatus = shipments.filter((shipment) => {
      return statusFilter === "all" || shipment.status === statusFilter;
    });
    return byStatus;
  }, [shipments, statusFilter]);

  const pageShipments = useMemo(() => {
    return filteredShipments.slice(0, pageSize);
  }, [filteredShipments, pageSize]);

  const handleAddColis = useCallback(() => {
    router.push("/client/colis/nouveau");
  }, [router]);

  useEffect(() => {
    if (!isColisRoute) return;

    if (pathname.endsWith("/ramassage")) {
      setStatusFilter("En attente");
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
        router.replace("/client/colis/nouveau");
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
    // Keep a stable-looking range similar to the screenshot.
    return `Jul 1, 2023 – ${endLabel}`;
  }, []);

  const formatPriceDh = (value?: string) => {
    const v = (value ?? "").trim();
    if (!v) return "—";
    return /dh/i.test(v) ? v : `${v} DH`;
  };

  const getStatusColor = (status: string) => {
    if (status === "Livré") return "success" as const;
    if (status === "En transit" || status === "En livraison")
      return "info" as const;
    if (status === "En attente") return "warning" as const;
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

  const handleExportPDF = useCallback(async (shipment: ClientShipment) => {
    // Open a tab synchronously (popup-safe) and show a lightweight loading UI
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
        // If we can't write (browser restrictions), we'll still navigate when ready.
      }
    }

    try {
      const url = new URL(
        `/api/client/colis-label/${encodeURIComponent(
          shipment.trackingNumber
        )}`,
        window.location.origin
      );
      url.searchParams.set("sender", shipment.sender);
      url.searchParams.set("recipient", shipment.recipient);
      if (shipment.recipientPhone)
        url.searchParams.set("recipientPhone", shipment.recipientPhone);
      url.searchParams.set("city", shipment.city || shipment.origin || "");
      url.searchParams.set(
        "address",
        shipment.destination || shipment.origin || ""
      );
      url.searchParams.set("price", shipment.price || "");
      url.searchParams.set("comment", shipment.comment || "");
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

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const labelW = 420;
      const labelH = 420;
      const x0 = (pageWidth - labelW) / 2;
      const y0 = margin;
      const pad = 18;

      // Outer dashed border
      doc.setDrawColor(170);
      doc.setLineWidth(1);

      const anyDoc = doc as unknown as {
        setLineDashPattern?: (pattern: number[], phase: number) => void;
        setLineDash?: (pattern: number[], phase: number) => void;
      };

      if (typeof anyDoc.setLineDashPattern === "function") {
        anyDoc.setLineDashPattern([6, 4], 0);
      } else if (typeof anyDoc.setLineDash === "function") {
        anyDoc.setLineDash([6, 4], 0);
      }

      doc.rect(x0, y0, labelW, labelH);

      if (typeof anyDoc.setLineDashPattern === "function") {
        anyDoc.setLineDashPattern([], 0);
      } else if (typeof anyDoc.setLineDash === "function") {
        anyDoc.setLineDash([], 0);
      }

      // Inner content area
      const ix = x0 + pad;
      const iy = y0 + pad;
      const iw = labelW - pad * 2;

      doc.setDrawColor(0);
      doc.setLineWidth(2);
      doc.setTextColor(0);

      // Sender block (top-right)
      const senderX = ix + 120;
      const senderY = iy;
      doc.line(senderX - 10, senderY - 2, senderX - 10, senderY + 62);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Expéditeur :", senderX, senderY + 12);
      doc.text("Tél :", senderX, senderY + 30);
      doc.text("Date :", senderX, senderY + 48);

      doc.setFont("helvetica", "normal");
      doc.text(payload.sender || "—", senderX + 78, senderY + 12);
      doc.text(payload.senderPhone || "—", senderX + 42, senderY + 30);
      doc.text(
        `${payload.createdAt} ${payload.createdAtTime || ""}`.trim(),
        senderX + 42,
        senderY + 48
      );

      // Thick separator line
      const sep1Y = iy + 78;
      doc.setLineWidth(2);
      doc.line(ix - 4, sep1Y, ix + iw + 4, sep1Y);

      // Recipient section
      let y = sep1Y + 18;
      doc.setFont("helvetica", "bold");
      doc.text("Destinataire:", ix - 4, y);
      doc.setFont("helvetica", "normal");
      doc.text(payload.recipient || "—", ix + 78, y);

      y += 18;
      doc.setFont("helvetica", "bold");
      doc.text("Tél:", ix - 4, y);
      doc.setFont("helvetica", "normal");
      doc.text(payload.recipientPhone || "—", ix + 28, y);
      doc.setFont("helvetica", "bold");
      doc.text("Ville:", ix + 160, y);
      doc.setFont("helvetica", "normal");
      doc.text(payload.city || "—", ix + 200, y);

      y += 18;
      doc.setFont("helvetica", "bold");
      doc.text("Adresse:", ix - 4, y);
      doc.setFont("helvetica", "normal");
      const addr = payload.address || "—";
      const addrLines = doc.splitTextToSize(addr, iw);
      doc.text(addrLines, ix + 52, y);
      y += 18 + Math.max(0, (addrLines.length - 1) * 14);

      // Separator
      const sep2Y = y + 10;
      doc.setLineWidth(2);
      doc.line(ix - 4, sep2Y, ix + iw + 4, sep2Y);

      // QR + Barcode
      const blockY = sep2Y + 16;
      const qrSize = 92;
      const qrX = ix;
      const qrY = blockY;
      doc.setLineWidth(2);
      doc.rect(qrX, qrY, qrSize, qrSize);
      if (payload.qrDataUrl) {
        try {
          doc.addImage(
            payload.qrDataUrl,
            "PNG",
            qrX + 6,
            qrY + 6,
            qrSize - 12,
            qrSize - 12
          );
        } catch {
          // Keep layout even if image decoding fails.
        }
      }

      const barcodeX = qrX + qrSize + 14;
      const barcodeW = ix + iw - barcodeX;
      doc.rect(barcodeX, qrY, barcodeW, qrSize);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("#NUMÉRO DE COLIS", barcodeX + barcodeW / 2, qrY + 16, {
        align: "center",
      });

      if (payload.barcodeDataUrl) {
        try {
          doc.addImage(
            payload.barcodeDataUrl,
            "PNG",
            barcodeX + 8,
            qrY + 22,
            barcodeW - 16,
            46
          );
        } catch {
          // Keep layout even if image decoding fails.
        }
      }

      doc.setFontSize(12);
      doc.text(payload.trackingNumber, barcodeX + barcodeW / 2, qrY + 86, {
        align: "center",
      });

      // Separator
      const sep3Y = qrY + qrSize + 14;
      doc.setLineWidth(2);
      doc.line(ix - 4, sep3Y, ix + iw + 4, sep3Y);

      // Product + Commentaire + Price
      y = sep3Y + 18;
      doc.setFont("helvetica", "bold");
      doc.text("Produit:", ix - 4, y);
      doc.setFont("helvetica", "normal");
      doc.text(payload.product || "1 x (1)", ix + 52, y);

      y += 28;
      doc.setFont("helvetica", "bold");
      doc.text("Commentaire:", ix - 4, y);

      const priceBoxW = 120;
      const priceBoxH = 44;
      const priceX = ix + iw - priceBoxW;
      const priceY = y + 6;
      doc.setLineWidth(3);
      doc.rect(priceX, priceY, priceBoxW, priceBoxH);
      doc.setLineWidth(1.5);
      doc.rect(priceX + 6, priceY + 6, priceBoxW - 12, priceBoxH - 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(
        `${payload.price} DH`.trim(),
        priceX + priceBoxW / 2,
        priceY + 28,
        {
          align: "center",
        }
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
          // Final fallback if popups are blocked.
          window.location.href = pdfUrl;
        }
      }

      // Best-effort cleanup of the object URL.
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

      {/* Mobile cards */}
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
                    href={`/client/suivi?tracking=${shipment.trackingNumber}`}
                    className="text-theme-sm font-semibold text-gray-800 underline underline-offset-2 dark:text-white/90"
                  >
                    {shipment.trackingNumber}
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

      {/* Desktop table */}
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
                          aria-label={`Select ${shipment.trackingNumber}`}
                          type="checkbox"
                          checked={selectedIds.has(shipment.id)}
                          onChange={() => toggleSelectOne(shipment.id)}
                          className="h-5 w-5 rounded border-gray-300 bg-white text-brand-500 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900"
                        />
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <div className="space-y-1">
                          <Link
                            href={`/client/suivi?tracking=${shipment.trackingNumber}`}
                            className="block text-theme-sm font-semibold text-gray-800 underline underline-offset-2 dark:text-white/90"
                          >
                            {shipment.trackingNumber}
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
