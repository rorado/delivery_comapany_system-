import { NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

import { readJsonFile, writeJsonFile } from "@/lib/fileDb";
import { adminVehiclesSeed } from "@/data/adminVehiclesSeed";

export const runtime = "nodejs";

const DB_PATH = path.join(process.cwd(), "data", "admin-vehicles.json");

const vehicleSchema = z.object({
  id: z.number().int().nonnegative(),
  vehicleNumber: z.string(),
  type: z.string(),
  model: z.string(),
  year: z.number(),
  driver: z.string(),
  status: z.enum(["Active", "In Use", "Maintenance", "Available"]),
  mileage: z.string(),
  lastService: z.string(),
  capacity: z.string(),
});

const vehiclesSchema = z.array(vehicleSchema);

type Vehicle = z.infer<typeof vehicleSchema>;

export async function GET() {
  try {
    const raw = await readJsonFile(DB_PATH, adminVehiclesSeed);
    const vehicles = vehiclesSchema.parse(raw);
    if (vehicles.length === 0) {
      await writeJsonFile(DB_PATH, adminVehiclesSeed);
      return NextResponse.json(adminVehiclesSeed);
    }
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to read vehicles", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const vehicles = vehiclesSchema.parse(body) as Vehicle[];
    await writeJsonFile(DB_PATH, vehicles);
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid payload", error: String(error) },
      { status: 400 }
    );
  }
}
