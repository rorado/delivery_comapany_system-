"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Define the TypeScript interface for the table rows
interface Delivery {
  id: number;
  trackingNumber: string;
  recipient: string;
  destination: string;
  weight: string;
  status: "Delivered" | "In Transit" | "Pending" | "Failed";
  driver: string;
}

// Define the table data using the interface
const tableData: Delivery[] = [
  {
    id: 1,
    trackingNumber: "DLV-2024-001",
    recipient: "Khadija El Amrani",
    destination: "Casablanca",
    weight: "2.5 kg",
    status: "Delivered",
    driver: "Omar El Fassi",
  },
  {
    id: 2,
    trackingNumber: "DLV-2024-002",
    recipient: "Yassine Benali",
    destination: "Rabat",
    weight: "5.0 kg",
    status: "In Transit",
    driver: "Sara Aït Lahcen",
  },
  {
    id: 3,
    trackingNumber: "DLV-2024-003",
    recipient: "Amina El Idrissi",
    destination: "Tanger",
    weight: "1.2 kg",
    status: "Delivered",
    driver: "Hicham Berrada",
  },
  {
    id: 4,
    trackingNumber: "DLV-2024-004",
    recipient: "Imane Bennani",
    destination: "Marrakech",
    weight: "8.5 kg",
    status: "Pending",
    driver: "Ayoub El Khatib",
  },
  {
    id: 5,
    trackingNumber: "DLV-2024-005",
    recipient: "Rachid El Moutaouakil",
    destination: "Fès",
    weight: "3.8 kg",
    status: "Delivered",
    driver: "Nour El Ghali",
  },
];

export default function RecentDeliveries() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | "Delivered" | "In Transit" | "Pending" | "Failed"
  >("All");

  const statusLabels: Record<
    "All" | "Delivered" | "In Transit" | "Pending" | "Failed",
    string
  > = {
    All: "Toutes",
    Delivered: "Livré",
    "In Transit": "En transit",
    Pending: "En attente",
    Failed: "Échoué",
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const handleStatusFilter = (
    status: "All" | "Delivered" | "In Transit" | "Pending" | "Failed"
  ) => {
    setSelectedStatus(status);
    closeFilter();
  };

  // Filter the table data based on selected status
  const filteredData =
    selectedStatus === "All"
      ? tableData
      : tableData.filter((delivery) => delivery.status === selectedStatus);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Livraisons récentes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={toggleFilter}
              className="dropdown-toggle inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
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
              Filtrer
              {selectedStatus !== "All" && ` : ${statusLabels[selectedStatus]}`}
            </button>
            <Dropdown
              isOpen={isFilterOpen}
              onClose={closeFilter}
              className="w-48"
            >
              <div className="p-2">
                <div className="mb-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  Filtrer par statut
                </div>
                <DropdownItem
                  onClick={() => handleStatusFilter("All")}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    selectedStatus === "All"
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  Toutes les livraisons
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleStatusFilter("Delivered")}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    selectedStatus === "Delivered"
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  Livré
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleStatusFilter("In Transit")}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    selectedStatus === "In Transit"
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  En transit
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleStatusFilter("Pending")}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    selectedStatus === "Pending"
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  En attente
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleStatusFilter("Failed")}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    selectedStatus === "Failed"
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  Échoué
                </DropdownItem>
              </div>
            </Dropdown>
          </div>
          <button
            onClick={() => router.push("/admin/expeditions")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Voir tout
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                N° de suivi
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Destinataire
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Destination
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Chauffeur
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Statut
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                >
                  Aucune livraison trouvée avec le statut "
                  {statusLabels[selectedStatus]}"
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((delivery) => (
                <TableRow key={delivery.id} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {delivery.trackingNumber}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {delivery.weight}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {delivery.recipient}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {delivery.destination}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {delivery.driver}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        delivery.status === "Delivered"
                          ? "success"
                          : delivery.status === "In Transit"
                          ? "info"
                          : delivery.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {statusLabels[delivery.status]}
                    </Badge>
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
