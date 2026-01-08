import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";
import { adminChauffeursSeed } from "@/data/adminChauffeursSeed";

export const runtime = "nodejs";

const DB_PATH = path.join(process.cwd(), "data", "admin-chauffeurs.json");
const DEFAULT_AVATAR = "/images/user/user-01.jpg";

const normalizeImage = (value: unknown) => {
  const image = typeof value === "string" ? value.trim() : "";
  return image.length > 0 ? image : DEFAULT_AVATAR;
};

const driverSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  vehicle: z.string(),
  status: z.enum(["Active", "On Route", "Offline", "On Break"]),
  deliveries: z.number(),
  rating: z.number(),
  image: z.string().optional(),
  password: z.string().optional(),
});

const driversSchema = z.array(driverSchema);

type Driver = z.infer<typeof driverSchema>;

export async function GET() {
  try {
    const raw = await readJsonFile(DB_PATH, adminChauffeursSeed);
    const drivers = driversSchema.parse(raw);

    if (drivers.length === 0) {
      const seeded = adminChauffeursSeed.map((d) => ({
        ...d,
        image: normalizeImage((d as unknown as { image?: string }).image),
      }));
      await writeJsonFile(DB_PATH, seeded);
      return NextResponse.json(seeded);
    }

    const normalized = drivers.map((d) => ({
      ...d,
      image: normalizeImage((d as unknown as { image?: string }).image),
    }));
    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to read drivers", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const drivers = driversSchema.parse(body) as Driver[];
    const normalized = drivers.map((d) => ({
      ...d,
      image: normalizeImage((d as unknown as { image?: string }).image),
    }));
    await writeJsonFile(DB_PATH, normalized);
    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid payload", error: String(error) },
      { status: 400 }
    );
  }
}
