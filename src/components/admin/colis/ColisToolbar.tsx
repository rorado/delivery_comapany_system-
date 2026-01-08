"use client";
import Button from "@/components/ui/button/Button";
import { CalenderIcon, DownloadIcon, PlusIcon } from "@/icons";

interface ColisToolbarProps {
  pageSize: number;
  onChangePageSize: (size: number) => void;
  formatRangeLabel: string;
  onExportAll: () => void;
  onAddColis: () => void;
}

export default function ColisToolbar({
  pageSize,
  onChangePageSize,
  formatRangeLabel,
  onExportAll,
  onAddColis,
}: ColisToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="w-full sm:w-24">
        <select
          value={pageSize}
          onChange={(e) => onChangePageSize(Number(e.target.value))}
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
        onClick={onExportAll}
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
        onClick={onAddColis}
      >
        Nouveau Colis
      </Button>
    </div>
  );
}
