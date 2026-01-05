import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";
import { adminClientsSeed } from "@/data/adminClientsSeed";

export const runtime = "nodejs";

const DB_PATH = path.join(process.cwd(), "data", "admin-clients.json");
const DEFAULT_AVATAR = "/images/user/user-01.jpg";

const normalizeImage = (value: unknown) => {
  const image = typeof value === "string" ? value.trim() : "";
  return image.length > 0 ? image : DEFAULT_AVATAR;
};

const customerSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  totalOrders: z.number().int().nonnegative(),
  totalSpent: z.string(),
  lastOrder: z.string(),
  image: z.string().optional(),
});

const customersSchema = z.array(customerSchema);

type Customer = z.infer<typeof customerSchema>;

export async function GET() {
  try {
    const raw = await readJsonFile(DB_PATH, adminClientsSeed);
    const customers = customersSchema.parse(raw);
    if (customers.length === 0) {
      const seeded = adminClientsSeed.map((c) => ({
        ...c,
        image: normalizeImage(c.image),
      }));
      await writeJsonFile(DB_PATH, seeded);
      return NextResponse.json(seeded);
    }

    const normalized = customers.map((c) => ({
      ...c,
      image: normalizeImage(c.image),
    }));
    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to read customers", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const customers = customersSchema.parse(body) as Customer[];
    const normalized = customers.map((c) => ({
      ...c,
      image: normalizeImage(c.image),
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
