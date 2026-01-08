import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";

export const DELIVERY_PROFILE_DB_PATH = path.join(
  process.cwd(),
  "data",
  "delivery-profile.json"
);

export const deliveryProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  vehicle: z.string().min(1),
  licenseNumber: z.string().min(1),
});

export type DeliveryProfile = z.infer<typeof deliveryProfileSchema>;

export const deliveryProfileSeed: DeliveryProfile = {
  name: "Livreur",
  email: "delivery@fastdeliver.com",
  phone: "+212 6 45 67 89 10",
  address: "Boulevard Zerktouni, Casablanca 20000",
  vehicle: "Camion #DLV-001",
  licenseNumber: "MA-123456",
};

export async function readDeliveryProfile(): Promise<DeliveryProfile> {
  const raw = await readJsonFile(DELIVERY_PROFILE_DB_PATH, deliveryProfileSeed);
  return deliveryProfileSchema.parse(raw);
}

export async function writeDeliveryProfile(
  profile: DeliveryProfile
): Promise<void> {
  const next = deliveryProfileSchema.parse(profile);
  await writeJsonFile(DELIVERY_PROFILE_DB_PATH, next);
}
