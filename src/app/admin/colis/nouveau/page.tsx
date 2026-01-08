"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import HeaderOptions, {
  FragileValue,
} from "@/components/admin/colis/HeaderOptions";
import TrackingRecipientPhone from "@/components/admin/colis/TrackingRecipientPhone";
import CityAddressComment from "@/components/admin/colis/CityAddressComment";
import ProductWeightPrice from "@/components/admin/colis/ProductWeightPrice";
import DeliveryFeesSummary from "@/components/admin/colis/DeliveryFeesSummary";
import FormActions from "@/components/admin/colis/FormActions";
import type { Shipment } from "@/types/expedition";

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
        sender: "Admin",
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
      <HeaderOptions
        colisAction={colisAction}
        fragile={fragile}
        exchange={exchange}
        onChangeColisAction={setColisAction}
        onChangeFragile={(v) => setFragile(v)}
        onChangeExchange={(v) => setExchange(v)}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TrackingRecipientPhone
            trackingCode={trackingCode}
            recipient={recipient}
            phone={phone}
            onChangeTracking={setTrackingCode}
            onChangeRecipient={setRecipient}
            onChangePhone={setPhone}
          />
          <CityAddressComment
            city={city}
            address={address}
            comment={comment}
            cities={MOROCCO_CITIES}
            cityFees={CITY_DELIVERY_FEES}
            onChangeCity={setCity}
            onChangeAddress={setAddress}
            onChangeComment={setComment}
          />
          <ProductWeightPrice
            productNature={productNature}
            weight={weight}
            price={price}
            onChangeProductNature={setProductNature}
            onChangeWeight={setWeight}
            onChangePrice={setPrice}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DeliveryFeesSummary
          pickupFee={deliveryFees.pickup}
          pickupOutFee={deliveryFees.pickupOut}
        />
        <FormActions
          onCancel={() => router.back()}
          onSubmit={handleSubmit}
          disabled={!canSubmit || isSaving}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
