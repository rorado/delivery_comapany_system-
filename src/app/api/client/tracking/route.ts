import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";
import { clientTrackingSeed } from "@/data/clientTrackingSeed";
import { readAdminShipments, shipmentStatusSchema } from "@/lib/shipmentsDb";

export const runtime = "nodejs";

const DB_PATH = path.join(process.cwd(), "data", "client-tracking.json");

const trackingEventSchema = z.object({
  time: z.string(),
  location: z.string(),
  status: z.string(),
  description: z.string(),
});

const shipmentTrackingSchema = z.object({
  trackingNumber: z.string(),
  sender: z.string(),
  recipient: z.string(),
  recipientPhone: z.string().optional(),
  origin: z.string(),
  destination: z.string(),
  city: z.string().optional(),
  address: z.string().optional(),
  currentLocation: z.string(),
  status: z.enum([
    "En attente",
    "En transit",
    "En livraison",
    "Livré",
    "Échoué",
  ]),
  estimatedDelivery: z.string(),
  weight: z.string(),
  product: z.string().optional(),
  price: z.string().optional(),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
  createdAtTime: z.string().optional(),
  events: z.array(trackingEventSchema),
});

const trackingSchema = z.array(shipmentTrackingSchema);

type ShipmentTracking = z.infer<typeof shipmentTrackingSchema>;

type AdminStatus = z.infer<typeof shipmentStatusSchema>;
type TrackingStatus = ShipmentTracking["status"];

const toTrackingStatus = (status: AdminStatus): TrackingStatus => {
  switch (status) {
    case "Pending":
      return "En attente";
    case "In Transit":
      return "En transit";
    case "Out for Delivery":
      return "En livraison";
    case "Delivered":
      return "Livré";
    case "Failed":
      return "Échoué";
  }
};

const defaultTrackingForShipment = (s: {
  packageNumber: string;
  sender: string;
  recipient: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  city: string;
  address: string;
  status: AdminStatus;
  estimatedDelivery: string;
  weight: string;
  product: string;
  price: string;
  comment: string;
  createdAt: string;
  createdAtTime: string;
}): ShipmentTracking => {
  const status = toTrackingStatus(s.status);
  const time = `${s.createdAt}${
    s.createdAtTime ? " " + s.createdAtTime : ""
  }`.trim();
  const originLocation = s.origin || s.city || "";
  const destinationLocation = s.destination || "";

  const currentLocation =
    status === "Livré" || status === "Échoué"
      ? destinationLocation || s.city || originLocation
      : s.city || originLocation;

  return {
    trackingNumber: s.packageNumber,
    sender: s.sender,
    recipient: s.recipient,
    recipientPhone: s.recipientPhone,
    origin: s.origin,
    destination: s.destination,
    city: s.city,
    address: s.address,
    currentLocation,
    status,
    estimatedDelivery: s.estimatedDelivery,
    weight: s.weight,
    product: s.product,
    price: s.price,
    comment: s.comment,
    createdAt: s.createdAt,
    createdAtTime: s.createdAtTime,
    events: [
      {
        time: time || new Date().toLocaleString("fr-FR"),
        location: currentLocation || originLocation || "",
        status,
        description: "Colis créé",
      },
    ],
  };
};

export async function GET() {
  try {
    const raw = await readJsonFile(DB_PATH, clientTrackingSeed);
    const existing = trackingSchema.parse(raw);

    const adminShipments = await readAdminShipments();
    const byTracking = new Map(
      existing.map((t) => [t.trackingNumber.trim().toUpperCase(), t])
    );

    for (const s of adminShipments) {
      const key = s.packageNumber.trim().toUpperCase();
      const prev = byTracking.get(key);
      if (prev) {
        byTracking.set(key, {
          ...prev,
          trackingNumber: s.packageNumber,
          sender: s.sender,
          recipient: s.recipient,
          recipientPhone: s.recipientPhone,
          origin: s.origin,
          destination: s.destination,
          city: s.city,
          address: s.address,
          status: toTrackingStatus(s.status),
          estimatedDelivery: s.estimatedDelivery,
          weight: s.weight,
          product: s.product,
          price: s.price,
          comment: s.comment,
          createdAt: s.createdAt,
          createdAtTime: s.createdAtTime,
          currentLocation: prev.currentLocation || s.city || s.origin || "",
        });
      } else {
        byTracking.set(key, defaultTrackingForShipment(s));
      }
    }

    const merged = Array.from(byTracking.values());
    const normalized = trackingSchema.parse(merged);
    await writeJsonFile(DB_PATH, normalized);
    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to read tracking", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const data = trackingSchema.parse(body) as ShipmentTracking[];
    await writeJsonFile(DB_PATH, data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid payload", error: String(error) },
      { status: 400 }
    );
  }
}
