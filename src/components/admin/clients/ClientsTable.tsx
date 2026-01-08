"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, MailIcon, PencilIcon, TrashBinIcon } from "@/icons";
import type { Customer } from "@/types/customer";

const DEFAULT_AVATAR = "/images/user/user-01.jpg";

interface ClientsTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function ClientsTable({
  customers,
  onEdit,
  onDelete,
}: ClientsTableProps) {
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
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={customer.image ?? DEFAULT_AVATAR}
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
                        onClick={() => onEdit(customer)}
                        className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                        title="Modifier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(customer)}
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
