"use client";
import Label from "@/components/form/Label";

type DeliveryFees = { pickup: number; pickupOut: number };

type Props = {
  city: string;
  address: string;
  comment: string;
  cities: string[];
  cityFees: Record<string, DeliveryFees>;
  onChangeCity: (val: string) => void;
  onChangeAddress: (val: string) => void;
  onChangeComment: (val: string) => void;
};

export default function CityAddressComment({
  city,
  address,
  comment,
  cities,
  cityFees,
  onChangeCity,
  onChangeAddress,
  onChangeComment,
}: Props) {
  return (
    <>
      <div className="lg:col-span-1">
        <Label htmlFor="city">Ville *</Label>
        <select
          id="city"
          value={city}
          onChange={(e) => onChangeCity(e.target.value)}
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        >
          <option value="">Ville *</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c} ({cityFees[c]?.pickup.toFixed(2)})
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-1">
        <Label htmlFor="address">Adresse *</Label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => onChangeAddress(e.target.value)}
          placeholder="Adresse *"
          className="mt-1 min-h-11 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
      <div className="lg:col-span-3">
        <Label htmlFor="comment">
          Commentaire ( Autre téléphone, Date de livraison ... )
        </Label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => onChangeComment(e.target.value)}
          placeholder="Commentaire ( Autre téléphone, Date de livraison ... )"
          className="mt-1 min-h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
    </>
  );
}
