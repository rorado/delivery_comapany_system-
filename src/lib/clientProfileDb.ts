import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";

export const CLIENT_PROFILE_DB_PATH = path.join(
  process.cwd(),
  "data",
  "client-profile.json"
);

export const clientProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  company: z.string().min(1),
});

export type ClientProfile = z.infer<typeof clientProfileSchema>;

export const clientProfileSeed: ClientProfile = {
  name: "Jean Dupont",
  email: "client@fastdeliver.com",
  phone: "+212 6 12 34 56 78",
  address: "12 Avenue Mohammed V, Rabat 10000",
  company: "ABC Société",
};

export async function readClientProfile(): Promise<ClientProfile> {
  const raw = await readJsonFile(CLIENT_PROFILE_DB_PATH, clientProfileSeed);
  return clientProfileSchema.parse(raw);
}

export async function writeClientProfile(
  profile: ClientProfile
): Promise<void> {
  const next = clientProfileSchema.parse(profile);
  await writeJsonFile(CLIENT_PROFILE_DB_PATH, next);
}
