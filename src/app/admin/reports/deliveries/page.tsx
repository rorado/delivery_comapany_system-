"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { DownloadIcon } from "@/icons";

interface DeliveryReport {
  id: number;
  date: string;
  totalDeliveries: number;
  completed: number;
  inTransit: number;
  failed: number;
  successRate: string;
  totalRevenue: string;
  avgDeliveryTime: string;
}

const reportsData: DeliveryReport[] = [
  {
    id: 1,
    date: "2024-01-12",
    totalDeliveries: 287,
    completed: 265,
    inTransit: 18,
    failed: 4,
    successRate: "92.3%",
    totalRevenue: "$12,450",
    avgDeliveryTime: "2.5 hours",
  },
  {
    id: 2,
    date: "2024-01-11",
    totalDeliveries: 312,
    completed: 298,
    inTransit: 10,
    failed: 4,
    successRate: "95.5%",
    totalRevenue: "$14,230",
    avgDeliveryTime: "2.3 hours",
  },
  {
    id: 3,
    date: "2024-01-10",
    totalDeliveries: 298,
    completed: 285,
    inTransit: 8,
    failed: 5,
    successRate: "95.6%",
    totalRevenue: "$13,890",
    avgDeliveryTime: "2.4 hours",
  },
  {
    id: 4,
    date: "2024-01-09",
    totalDeliveries: 275,
    completed: 262,
    inTransit: 9,
    failed: 4,
    successRate: "95.3%",
    totalRevenue: "$12,980",
    avgDeliveryTime: "2.6 hours",
  },
  {
    id: 5,
    date: "2024-01-08",
    totalDeliveries: 301,
    completed: 289,
    inTransit: 7,
    failed: 5,
    successRate: "96.0%",
    totalRevenue: "$14,560",
    avgDeliveryTime: "2.2 hours",
  },
];

export default function DeliveryReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Delivery Reports
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            View detailed reports on delivery performance and statistics.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <DownloadIcon className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Deliveries</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">1,473</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Last 5 days</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">95.0%</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Average</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">$68,110</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Last 5 days</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Delivery Time</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">2.4 hrs</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Average</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Deliveries
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Completed
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  In Transit
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Failed
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Success Rate
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Revenue
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Avg. Time
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reportsData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {report.date}
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {report.totalDeliveries}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {report.completed}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {report.inTransit}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {report.failed}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Badge
                      size="sm"
                      color={parseFloat(report.successRate) >= 95 ? "success" : "warning"}
                    >
                      {report.successRate}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {report.totalRevenue}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {report.avgDeliveryTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
