"use client";
import Label from "@/components/form/Label";

type Props = {
  productNature: string;
  weight: string;
  price: string;
  onChangeProductNature: (val: string) => void;
  onChangeWeight: (val: string) => void;
  onChangePrice: (val: string) => void;
};

export default function ProductWeightPrice({
  productNature,
  weight,
  price,
  onChangeProductNature,
  onChangeWeight,
  onChangePrice,
}: Props) {
  return (
    <>
      <div className="lg:col-span-3">
        <Label htmlFor="productNature">Nature Du Produit</Label>
        <input
          id="productNature"
          value={productNature}
          onChange={(e) => onChangeProductNature(e.target.value)}
          placeholder="Nature Du Produit"
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
      <div className="lg:col-span-3">
        <Label htmlFor="weight">Poids</Label>
        <input
          id="weight"
          value={weight}
          onChange={(e) => onChangeWeight(e.target.value)}
          placeholder="Poids (ex: 2,5 kg)"
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
      <div className="lg:col-span-3">
        <Label htmlFor="price">Prix *</Label>
        <input
          id="price"
          value={price}
          onChange={(e) => onChangePrice(e.target.value)}
          placeholder="Prix *"
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
    </>
  );
}
