import { NextResponse } from "next/server";
import { z } from "zod";

import {
  readAdminShipments,
  shipmentStatusSchema,
  writeAdminShipments,
} from "@/lib/shipmentsDb";

export const runtime = "nodejs";

const deliverySchema = z.object({
  id: z.number().int().nonnegative(),
  trackingNumber: z.string(),
  recipient: z.string(),
  destination: z.string(),
  status: shipmentStatusSchema,
  estimatedDelivery: z.string(),
  weight: z.string(),
});

const deliveriesSchema = z.array(deliverySchema);

type Delivery = z.infer<typeof deliverySchema>;

export async function GET() {
  try {
    const adminShipments = await readAdminShipments();
    const mapped = adminShipments.map((s) => ({
      id: s.id,
      trackingNumber: s.packageNumber,
      recipient: s.recipient,
      destination: s.destination,
      status: s.status,
      estimatedDelivery: s.estimatedDelivery,
      weight: s.weight,
    }));

    return NextResponse.json(deliveriesSchema.parse(mapped));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to read deliveries", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const deliveries = deliveriesSchema.parse(body) as Delivery[];

    const existingAdmin = await readAdminShipments();
    const byId = new Map(existingAdmin.map((s) => [s.id, s]));

    for (const d of deliveries) {
      const existing = byId.get(d.id);
      if (!existing) continue;
      byId.set(d.id, {
        ...existing,
        status: d.status,
        estimatedDelivery: d.estimatedDelivery,
        weight: d.weight,
        packageNumber: d.trackingNumber || existing.packageNumber,
        recipient: d.recipient,
        destination: d.destination,
      });
    }

    const nextAdmin = Array.from(byId.values()).sort((a, b) => a.id - b.id);
    await writeAdminShipments(nextAdmin);

    const responseDeliveries = nextAdmin.map((s) => ({
      id: s.id,
      trackingNumber: s.packageNumber,
      recipient: s.recipient,
      destination: s.destination,
      status: s.status,
      estimatedDelivery: s.estimatedDelivery,
      weight: s.weight,
    }));

    return NextResponse.json(deliveriesSchema.parse(responseDeliveries));
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid payload", error: String(error) },
      { status: 400 }
    );
  }
}
