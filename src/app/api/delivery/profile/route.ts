import { NextResponse } from "next/server";

import {
  deliveryProfileSchema,
  readDeliveryProfile,
  writeDeliveryProfile,
} from "@/lib/deliveryProfileDb";

export async function GET() {
  try {
    const profile = await readDeliveryProfile();
    return NextResponse.json(profile);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to read delivery profile", details: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const profile = deliveryProfileSchema.parse(body);
    await writeDeliveryProfile(profile);
    return NextResponse.json(profile);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Invalid delivery profile payload", details: message },
      { status: 400 }
    );
  }
}
