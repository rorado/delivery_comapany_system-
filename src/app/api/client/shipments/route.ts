import { NextResponse } from "next/server";
import { z } from "zod";

import {
  readAdminShipments,
  shipmentStatusSchema,
  writeAdminShipments,
} from "@/lib/shipmentsDb";

export const runtime = "nodejs";

const clientStatusSchema = z.enum([
  "En attente",
  "En transit",
  "En livraison",
  "Livré",
  "Échoué",
]);

const shipmentSchema = z.object({
  id: z.number().int().nonnegative(),
  trackingNumber: z.string(),
  sender: z.string(),
  recipient: z.string(),
  recipientPhone: z.string().optional(),
  origin: z.string(),
  destination: z.string(),
  city: z.string().optional(),
  weight: z.string(),
  status: clientStatusSchema,
  estimatedDelivery: z.string(),
  createdAt: z.string(),
  createdAtTime: z.string().optional(),
  price: z.string().optional(),
  comment: z.string().optional(),
});

const shipmentsSchema = z.array(shipmentSchema);

type ClientShipment = z.infer<typeof shipmentSchema>;

type AdminStatus = z.infer<typeof shipmentStatusSchema>;
type ClientStatus = z.infer<typeof clientStatusSchema>;

const toClientStatus = (status: AdminStatus): ClientStatus => {
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

const toAdminStatus = (status: ClientStatus): AdminStatus => {
  switch (status) {
    case "En attente":
      return "Pending";
    case "En transit":
      return "In Transit";
    case "En livraison":
      return "Out for Delivery";
    case "Livré":
      return "Delivered";
    case "Échoué":
      return "Failed";
  }
};

export async function GET() {
  try {
    const adminShipments = await readAdminShipments();
    const mapped = adminShipments.map((s) => ({
      id: s.id,
      trackingNumber: s.packageNumber,
      sender: s.sender,
      recipient: s.recipient,
      recipientPhone: s.recipientPhone,
      origin: s.origin,
      destination: s.destination,
      city: s.city,
      weight: s.weight,
      status: toClientStatus(s.status),
      estimatedDelivery: s.estimatedDelivery,
      createdAt: s.createdAt,
      createdAtTime: s.createdAtTime,
      price: s.price,
      comment: s.comment,
    }));

    const shipments = shipmentsSchema.parse(mapped);
    return NextResponse.json(shipments);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to read shipments", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const clientShipments = shipmentsSchema.parse(body) as ClientShipment[];

    const existingAdmin = await readAdminShipments();
    const byId = new Map(existingAdmin.map((s) => [s.id, s]));
    let nextId = existingAdmin.length
      ? Math.max(...existingAdmin.map((s) => s.id)) + 1
      : 1;

    for (const c of clientShipments) {
      const existing = byId.get(c.id);

      if (existing) {
        byId.set(c.id, {
          ...existing,
          packageNumber: c.trackingNumber || existing.packageNumber,
          sender: c.sender,
          recipient: c.recipient,
          recipientPhone: c.recipientPhone ?? existing.recipientPhone,
          origin: c.origin,
          destination: c.destination,
          city: c.city ?? existing.city,
          weight: c.weight,
          price: c.price ?? existing.price,
          comment: c.comment ?? existing.comment,
          status: toAdminStatus(c.status),
          estimatedDelivery: c.estimatedDelivery,
          createdAt: c.createdAt,
          createdAtTime: c.createdAtTime ?? existing.createdAtTime,
        });
        continue;
      }

      const newId = c.id > 0 && !byId.has(c.id) ? c.id : nextId++;
      const now = new Date();
      const createdAtTime = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      byId.set(newId, {
        id: newId,
        packageNumber:
          c.trackingNumber || `DLV-${String(newId).padStart(6, "0")}`,
        sender: c.sender,
        senderPhone: "",
        recipient: c.recipient,
        recipientPhone: c.recipientPhone ?? "",
        origin: c.origin,
        destination: c.destination,
        city: c.city ?? "",
        address: "",
        weight: c.weight,
        product: "",
        comment: c.comment ?? "",
        price: c.price ?? "",
        status: toAdminStatus(c.status),
        driver: "",
        estimatedDelivery: c.estimatedDelivery,
        createdAt: c.createdAt,
        createdAtTime: c.createdAtTime ?? createdAtTime,
      });
    }

    const nextAdmin = Array.from(byId.values()).sort((a, b) => a.id - b.id);
    await writeAdminShipments(nextAdmin);

    const responseShipments = nextAdmin.map((s) => ({
      id: s.id,
      trackingNumber: s.packageNumber,
      sender: s.sender,
      recipient: s.recipient,
      recipientPhone: s.recipientPhone,
      origin: s.origin,
      destination: s.destination,
      city: s.city,
      weight: s.weight,
      status: toClientStatus(s.status),
      estimatedDelivery: s.estimatedDelivery,
      createdAt: s.createdAt,
      createdAtTime: s.createdAtTime,
      price: s.price,
      comment: s.comment,
    }));

    return NextResponse.json(shipmentsSchema.parse(responseShipments));
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid payload", error: String(error) },
      { status: 400 }
    );
  }
}
