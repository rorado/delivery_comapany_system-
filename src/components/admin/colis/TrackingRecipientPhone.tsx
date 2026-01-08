"use client";
import Label from "@/components/form/Label";

type Props = {
  trackingCode: string;
  recipient: string;
  phone: string;
  onChangeTracking: (val: string) => void;
  onChangeRecipient: (val: string) => void;
  onChangePhone: (val: string) => void;
};

export default function TrackingRecipientPhone({
  trackingCode,
  recipient,
  phone,
  onChangeTracking,
  onChangeRecipient,
  onChangePhone,
}: Props) {
  return (
    <>
      <div className="lg:col-span-1">
        <Label htmlFor="trackingCode">Code suivi *</Label>
        <input
          id="trackingCode"
          value={trackingCode}
          onChange={(e) => onChangeTracking(e.target.value)}
          placeholder="Code suivi *"
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
      <div className="lg:col-span-1">
        <Label htmlFor="recipient">Destinataire *</Label>
        <input
          id="recipient"
          value={recipient}
          onChange={(e) => onChangeRecipient(e.target.value)}
          placeholder="Destinataire *"
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
      <div className="lg:col-span-1">
        <Label htmlFor="phone">Téléphone *</Label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder="Téléphone *"
          className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
        />
      </div>
    </>
  );
}
