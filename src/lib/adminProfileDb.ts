import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";

export const ADMIN_PROFILE_DB_PATH = path.join(
  process.cwd(),
  "data",
  "admin-profile.json"
);

export const adminProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  company: z.string().min(1),
});

export type AdminProfile = z.infer<typeof adminProfileSchema>;

export const adminProfileSeed: AdminProfile = {
  name: "Admin Principal",
  email: "admin@fastdeliver.com",
  phone: "+212 6 22 33 44 55",
  address: "Siège FastDeliver, Casablanca 20000",
  company: "FastDeliver",
};

export async function readAdminProfile(): Promise<AdminProfile> {
  const raw = await readJsonFile(ADMIN_PROFILE_DB_PATH, adminProfileSeed);
  return adminProfileSchema.parse(raw);
}

export async function writeAdminProfile(profile: AdminProfile): Promise<void> {
  const next = adminProfileSchema.parse(profile);
  await writeJsonFile(ADMIN_PROFILE_DB_PATH, next);
}
