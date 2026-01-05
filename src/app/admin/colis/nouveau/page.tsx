"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import type { Shipment } from "@/types/expedition";
import { adminExpeditionsSeed } from "@/data/adminExpeditionsSeed";

type ShipmentFormData = Omit<
  Shipment,
  "id" | "packageNumber" | "createdAt" | "createdAtTime"
>;

export default function AdminNouveauColisPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [existingShipments, setExistingShipments] = useState<Shipment[] | null>(
    null
  );
  const [formData, setFormData] = useState<ShipmentFormData>({
    sender: "Deliverio",
    senderPhone: "0667449851",
    recipient: "",
    recipientPhone: "",
    origin: "",
    destination: "",
    city: "",
    address: "",
    weight: "",
    product: "",
    comment: "",
    price: "",
    status: "Pending",
    driver: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/expeditions", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as Shipment[];
        if (isMounted && Array.isArray(data)) setExistingShipments(data);
      } catch {
        if (isMounted) setExistingShipments(adminExpeditionsSeed);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return (
      formData.recipient.trim().length > 0 &&
      formData.recipientPhone.trim().length > 0 &&
      formData.origin.trim().length > 0 &&
      formData.destination.trim().length > 0
    );
  }, [formData]);

  const setField = <K extends keyof ShipmentFormData>(
    key: K,
    value: ShipmentFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (isSaving) return;
    const base = existingShipments ?? adminExpeditionsSeed;

    setIsSaving(true);
    try {
      const newId =
        base.length > 0 ? Math.max(...base.map((s) => s.id)) + 1 : 1;
      const now = new Date();
      const dateStr = now.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newShipment: Shipment = {
        id: newId,
        packageNumber: `TANG${String(newId + 142).padStart(6, "0")}MA`,
        ...formData,
        createdAt: dateStr,
        createdAtTime: timeStr,
      };

      const nextShipments = [...base, newShipment];

      const putRes = await fetch("/api/admin/expeditions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextShipments),
      });

      if (!putRes.ok) throw new Error("Failed to save");

      router.push("/admin/colis/liste");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Ajouter un nouveau colis
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Remplissez le formulaire puis enregistrez.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit || isSaving}
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="sender">Expéditeur</Label>
            <input
              id="sender"
              value={formData.sender}
              onChange={(e) => setField("sender", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="senderPhone">Téléphone expéditeur</Label>
            <input
              id="senderPhone"
              value={formData.senderPhone}
              onChange={(e) => setField("senderPhone", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="recipient">Destinataire</Label>
            <input
              id="recipient"
              value={formData.recipient}
              onChange={(e) => setField("recipient", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="recipientPhone">Téléphone destinataire</Label>
            <input
              id="recipientPhone"
              value={formData.recipientPhone}
              onChange={(e) => setField("recipientPhone", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="origin">Origine</Label>
            <input
              id="origin"
              value={formData.origin}
              onChange={(e) => setField("origin", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <input
              id="destination"
              value={formData.destination}
              onChange={(e) => setField("destination", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="city">Ville</Label>
            <input
              id="city"
              value={formData.city}
              onChange={(e) => setField("city", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <input
              id="address"
              value={formData.address}
              onChange={(e) => setField("address", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="weight">Poids</Label>
            <input
              id="weight"
              value={formData.weight}
              onChange={(e) => setField("weight", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="product">Produit</Label>
            <input
              id="product"
              value={formData.product}
              onChange={(e) => setField("product", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="price">Prix</Label>
            <input
              id="price"
              value={formData.price}
              onChange={(e) => setField("price", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="driver">Chauffeur</Label>
            <input
              id="driver"
              value={formData.driver}
              onChange={(e) => setField("driver", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="estimatedDelivery">Livraison estimée</Label>
            <input
              id="estimatedDelivery"
              value={formData.estimatedDelivery}
              onChange={(e) => setField("estimatedDelivery", e.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setField("status", e.target.value as Shipment["status"])
              }
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="comment">Commentaire</Label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setField("comment", e.target.value)}
              className="mt-1 min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
