"use client";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { CalenderIcon, MoreDotIcon } from "@/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Shipment } from "@/types/expedition";

interface ColisTableProps {
  shipments: Shipment[];
  selectedIds: Set<number>;
  allVisibleSelected: boolean;
  onToggleSelectAllVisible: () => void;
  onToggleSelectOne: (id: number) => void;
  formatPriceDh: (value?: string) => string;
  getStatusColor: (
    status: Shipment["status"]
  ) => "success" | "info" | "warning" | "error";
  onExportPDF: (shipment: Shipment) => void;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: number) => void;
}

export default function ColisTable({
  shipments,
  selectedIds,
  allVisibleSelected,
  onToggleSelectAllVisible,
  onToggleSelectOne,
  formatPriceDh,
  getStatusColor,
  onExportPDF,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onDelete,
}: ColisTableProps) {
  return (
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
                    onChange={onToggleSelectAllVisible}
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
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="px-6 py-10 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                  >
                    Aucun colis trouvé
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="align-middle">
                    <TableCell className="px-4 py-4 text-start">
                      <input
                        aria-label={`Select ${shipment.packageNumber}`}
                        type="checkbox"
                        checked={selectedIds.has(shipment.id)}
                        onChange={() => onToggleSelectOne(shipment.id)}
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
                      <Badge size="sm" color={getStatusColor(shipment.status)}>
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
                        onClick={() => onExportPDF(shipment)}
                      >
                        Exporter en PDF
                      </Button>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start relative">
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/6"
                        aria-label="Actions"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === shipment.id ? null : shipment.id
                          )
                        }
                      >
                        <MoreDotIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </button>
                      <Dropdown
                        isOpen={openMenuId === shipment.id}
                        onClose={() => setOpenMenuId(null)}
                        className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50"
                      >
                        <ul className="flex flex-col gap-1">
                          <li>
                            <DropdownItem
                              onItemClick={() => onEdit(shipment)}
                              className="flex items-center gap-3 px-3 py-2 text-theme-sm rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                              Éditer
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              onItemClick={() => onDelete(shipment.id)}
                              className="flex items-center gap-3 px-3 py-2 text-theme-sm rounded-lg hover:bg-gray-100 text-red-600 dark:hover:bg-white/5"
                            >
                              Supprimer
                            </DropdownItem>
                          </li>
                        </ul>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
