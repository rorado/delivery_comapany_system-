"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import type { Shipment } from "@/types/expedition";

type FragileValue = "Oui" | "Non";

type DeliveryFees = {
  pickup: number;
  pickupOut: number;
};

const MOROCCO_CITIES = [
  "Agadir",
  "Aïn Harrouda",
  "Aït Melloul",
  "Al Hoceïma",
  "Assilah",
  "Azemmour",
  "Azrou",
  "Béni Mellal",
  "Berkane",
  "Berrechid",
  "Bouskoura",
  "Boujdour",
  "Casablanca",
  "Chefchaouen",
  "Dakhla",
  "El Jadida",
  "El Kelaâ des Sraghna",
  "Errachidia",
  "Essaouira",
  "Fès",
  "Fquih Ben Salah",
  "Fnideq",
  "Guelmim",
  "Guercif",
  "Ifrane",
  "Inezgane",
  "Jerada",
  "Kénitra",
  "Khemisset",
  "Khenifra",
  "Khouribga",
  "Ksar El Kébir",
  "Laâyoune",
  "Larache",
  "Marrakech",
  "Martil",
  "M'diq",
  "Médiouna",
  "Meknès",
  "Midelt",
  "Mohammedia",
  "Nador",
  "Nouaceur",
  "Ouarzazate",
  "Ouezzane",
  "Oujda",
  "Rabat",
  "Safi",
  "Salé",
  "Saïdia",
  "Sefrou",
  "Settat",
  "Sidi Bennour",
  "Sidi Ifni",
  "Sidi Kacem",
  "Sidi Slimane",
  "Skhirat",
  "Smara",
  "Tanger",
  "Tan-Tan",
  "Taourirt",
  "Tarfaya",
  "Taroudant",
  "Taza",
  "Témara",
  "Tétouan",
  "Tinghir",
  "Tiznit",
  "Youssoufia",
  "Zagora",
].sort((a, b) => a.localeCompare(b, "fr"));

const DEFAULT_DELIVERY_FEES: DeliveryFees = { pickup: 25, pickupOut: 35 };

// Delivery fees by city (MAD)
const CITY_DELIVERY_FEES: Record<string, DeliveryFees> = (() => {
  const all: Record<string, DeliveryFees> = Object.fromEntries(
    MOROCCO_CITIES.map((c) => [c, { ...DEFAULT_DELIVERY_FEES }])
  );

  const overrides: Record<string, DeliveryFees> = {
    Casablanca: { pickup: 20, pickupOut: 30 },
    Rabat: { pickup: 20, pickupOut: 30 },
    Salé: { pickup: 20, pickupOut: 30 },
    Témara: { pickup: 20, pickupOut: 30 },
    Tanger: { pickup: 25, pickupOut: 35 },
    Tétouan: { pickup: 25, pickupOut: 35 },
    Marrakech: { pickup: 25, pickupOut: 35 },
    Fès: { pickup: 25, pickupOut: 35 },
    Agadir: { pickup: 25, pickupOut: 35 },
    Kénitra: { pickup: 25, pickupOut: 35 },
    Meknès: { pickup: 25, pickupOut: 35 },
    Oujda: { pickup: 35, pickupOut: 45 },
    Nador: { pickup: 35, pickupOut: 45 },
    Laâyoune: { pickup: 45, pickupOut: 60 },
    Dakhla: { pickup: 55, pickupOut: 75 },
  };

  for (const [city, fees] of Object.entries(overrides)) all[city] = fees;
  return all;
})();

function getDeliveryFeesForCity(city: string): DeliveryFees {
  const trimmed = city.trim();
  if (!trimmed) return { pickup: 0, pickupOut: 0 };
  return CITY_DELIVERY_FEES[trimmed] ?? DEFAULT_DELIVERY_FEES;
}

function generateTrackingCode(nextId: number, date = new Date()) {
  return `DLV-${date.getFullYear()}-${String(nextId).padStart(3, "0")}`;
}

export default function AdminNouveauColisPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [existingShipments, setExistingShipments] = useState<Shipment[] | null>(
    null
  );

  const [colisAction, setColisAction] = useState("Ouvrir le colis");
  const [fragile, setFragile] = useState<FragileValue>("Non");
  const [exchange, setExchange] = useState(false);

  const [trackingCode, setTrackingCode] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [productNature, setProductNature] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  const deliveryFees = useMemo(() => getDeliveryFeesForCity(city), [city]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/expeditions", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as Shipment[];
        if (isMounted && Array.isArray(data)) setExistingShipments(data);
      } catch {
        if (isMounted) setExistingShipments([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!existingShipments) return;
    if (trackingCode.trim().length > 0) return;
    const nextId =
      existingShipments.length > 0
        ? Math.max(...existingShipments.map((s) => s.id)) + 1
        : 1;
    setTrackingCode(generateTrackingCode(nextId));
  }, [existingShipments, trackingCode]);

  const canSubmit = useMemo(() => {
    return (
      recipient.trim().length > 0 &&
      phone.trim().length > 0 &&
      city.trim().length > 0 &&
      address.trim().length > 0 &&
      price.trim().length > 0
    );
  }, [address, city, phone, price, recipient]);

  const handleSubmit = async () => {
    if (isSaving) return;
    const base = existingShipments ?? [];
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

      const trimmedTracking = trackingCode.trim();
      const packageNumber =
        trimmedTracking.length > 0
          ? trimmedTracking
          : `DLV-${now.getFullYear()}-${String(newId).padStart(3, "0")}`;

      const fullCommentParts = [
        fragile === "Oui" ? "Fragile: Oui" : "Fragile: Non",
        exchange ? "Échange: Oui" : "Échange: Non",
        colisAction ? `Action: ${colisAction}` : "",
        comment.trim(),
      ].filter(Boolean);
      const fullComment = fullCommentParts.join(" | ");

      const newShipment: Shipment = {
        id: newId,
        packageNumber,
        sender: "Client",
        senderPhone: "",
        recipient: recipient.trim(),
        recipientPhone: phone.trim(),
        origin: city.trim(),
        destination: address.trim(),
        city: city.trim(),
        address: address.trim(),
        weight: weight.trim(),
        product: productNature.trim(),
        comment: fullComment,
        price: price.trim(),
        status: "Pending",
        driver: "",
        estimatedDelivery: "",
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
              onChange={(e) => setColisAction(e.target.value)}
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
              onChange={(e) => setFragile(e.target.value as FragileValue)}
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
                onChange={(e) => setExchange(e.target.checked)}
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Label htmlFor="trackingCode">Code suivi *</Label>
            <input
              id="trackingCode"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Code suivi *"
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div className="lg:col-span-1">
            <Label htmlFor="recipient">Destinataire *</Label>
            <input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Destinataire *"
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div className="lg:col-span-1">
            <Label htmlFor="phone">Téléphone *</Label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Téléphone *"
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div className="lg:col-span-1">
            <Label htmlFor="city">Ville *</Label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            >
              <option value="">Ville *</option>
              {MOROCCO_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c} ({CITY_DELIVERY_FEES[c]?.pickup.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1">
            <Label htmlFor="address">Adresse *</Label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              onChange={(e) => setComment(e.target.value)}
              placeholder="Commentaire ( Autre téléphone, Date de livraison ... )"
              className="mt-1 min-h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="productNature">Nature Du Produit</Label>
            <input
              id="productNature"
              value={productNature}
              onChange={(e) => setProductNature(e.target.value)}
              placeholder="Nature Du Produit"
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="weight">Poids</Label>
            <input
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Poids (ex: 2,5 kg)"
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="price">Prix *</Label>
            <input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Prix *"
              className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div>
            Frais de livraison ( Ramassage ) : {deliveryFees.pickup.toFixed(2)}
          </div>
          <div>
            Frais de livraison ( Ramassage Hors ) :{" "}
            {deliveryFees.pickupOut.toFixed(2)}
          </div>
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
    </div>
  );
}
