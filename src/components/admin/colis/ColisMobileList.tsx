"use client";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { MoreDotIcon, CalenderIcon } from "@/icons";
import type { Shipment } from "@/types/expedition";

interface ColisMobileListProps {
  shipments: Shipment[];
  formatPriceDh: (value?: string) => string;
  getStatusColor: (
    status: Shipment["status"]
  ) => "success" | "info" | "warning" | "error";
  onExportPDF: (shipment: Shipment) => void;
}

export default function ColisMobileList({
  shipments,
  formatPriceDh,
  getStatusColor,
  onExportPDF,
}: ColisMobileListProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {shipments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-white/5 dark:bg-white/3">
          <p className="text-gray-500 dark:text-gray-400">Aucun colis trouvé</p>
        </div>
      ) : (
        shipments.map((shipment) => (
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
                onClick={() => onExportPDF(shipment)}
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
  );
}
