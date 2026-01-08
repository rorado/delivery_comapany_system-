"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "@/icons";
import type { Driver } from "@/types/driver";

const DEFAULT_AVATAR = "/images/user/user-01.jpg";

interface DriversTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}

export default function DriversTable({
  drivers,
  onEdit,
  onDelete,
}: DriversTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Livreur
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
                Véhicule
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
                Livraisons
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Note
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
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun livreur trouvé
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={driver.image ?? DEFAULT_AVATAR}
                          alt={driver.name}
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {driver.name}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          ID: DLV-{String(driver.id).padStart(3, "0")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div>
                      <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                        {driver.email}
                      </p>
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {driver.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {driver.vehicle}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Badge
                      size="sm"
                      color={
                        driver.status === "Active" ||
                        driver.status === "On Route"
                          ? "success"
                          : driver.status === "On Break"
                          ? "warning"
                          : "error"
                      }
                    >
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {driver.deliveries}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-800 text-theme-sm font-medium dark:text-white/90">
                        {driver.rating}
                      </span>
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(driver)}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                        title="Modifier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(driver)}
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
  );
}
