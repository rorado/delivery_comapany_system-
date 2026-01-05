import { NextResponse } from "next/server";
import { z } from "zod";

import {
  readAdminShipments,
  shipmentSchema,
  shipmentsSchema,
  writeAdminShipments,
} from "@/lib/shipmentsDb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const shipments = await readAdminShipments();
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
    const shipments = shipmentsSchema.parse(body);
    await writeAdminShipments(shipments);
    return NextResponse.json(shipments);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid payload", error: String(error) },
      { status: 400 }
    );
  }
}
