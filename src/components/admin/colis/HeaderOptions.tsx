"use client";
import Label from "@/components/form/Label";

export type FragileValue = "Oui" | "Non";

type Props = {
  colisAction: string;
  fragile: FragileValue;
  exchange: boolean;
  onChangeColisAction: (val: string) => void;
  onChangeFragile: (val: FragileValue) => void;
  onChangeExchange: (val: boolean) => void;
};

export default function HeaderOptions({
  colisAction,
  fragile,
  exchange,
  onChangeColisAction,
  onChangeFragile,
  onChangeExchange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
        Nouveau Colis
      </h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
        <div>
          <Label htmlFor="colisAction">Colis</Label>
          <select
            id="colisAction"
            value={colisAction}
            onChange={(e) => onChangeColisAction(e.target.value)}
            className="mt-1 h-11 w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          >
            <option value="Ouvrir le colis">Ouvrir le colis</option>
          </select>
        </div>
        <div>
          <Label htmlFor="fragile">Fragile</Label>
          <select
            id="fragile"
            value={fragile}
            onChange={(e) => onChangeFragile(e.target.value as FragileValue)}
            className="mt-1 h-11 w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          >
            <option value="Non">Non</option>
            <option value="Oui">Oui</option>
          </select>
        </div>
        <div className="pt-6 sm:pt-0">
          <label className="inline-flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={exchange}
              onChange={(e) => onChangeExchange(e.target.checked)}
              className="mt-1"
            />
            <span>
              Échange
              <span className="block text-theme-xs text-gray-500 dark:text-gray-400 mt-1">
                ( Le colis sera remplacer avec l'ancien a la livraison. )
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
