import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";
import { adminExpeditionsSeed } from "@/data/adminExpeditionsSeed";

export const SHIPMENTS_DB_PATH = path.join(
  process.cwd(),
  "data",
  "shipments.json"
);

export const shipmentStatusSchema = z.enum([
  "Pending",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Failed",
]);

export const shipmentSchema = z.object({
  id: z.number().int().nonnegative(),
  packageNumber: z.string().min(1),
  sender: z.string(),
  senderPhone: z.string(),
  recipient: z.string(),
  recipientPhone: z.string(),
  origin: z.string(),
  destination: z.string(),
  city: z.string(),
  address: z.string(),
  weight: z.string(),
  product: z.string(),
  comment: z.string(),
  price: z.string(),
  status: shipmentStatusSchema,
  driver: z.string(),
  estimatedDelivery: z.string(),
  createdAt: z.string(),
  createdAtTime: z.string(),
});

export const shipmentsSchema = z.array(shipmentSchema);

export type AdminShipment = z.infer<typeof shipmentSchema>;

export async function readAdminShipments(): Promise<AdminShipment[]> {
  const raw = await readJsonFile(SHIPMENTS_DB_PATH, adminExpeditionsSeed);
  const shipments = shipmentsSchema.parse(raw);
  if (shipments.length === 0) {
    await writeJsonFile(SHIPMENTS_DB_PATH, adminExpeditionsSeed);
    return adminExpeditionsSeed as AdminShipment[];
  }
  return shipments;
}

export async function writeAdminShipments(
  shipments: AdminShipment[]
): Promise<void> {
  await writeJsonFile(SHIPMENTS_DB_PATH, shipments);
}
