import { NextResponse } from "next/server";

import {
  clientProfileSchema,
  readClientProfile,
  writeClientProfile,
} from "@/lib/clientProfileDb";

export async function GET() {
  try {
    const profile = await readClientProfile();
    return NextResponse.json(profile);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to read profile", details: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const profile = clientProfileSchema.parse(body);
    await writeClientProfile(profile);
    return NextResponse.json(profile);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Invalid profile payload", details: message },
      { status: 400 }
    );
  }
}
