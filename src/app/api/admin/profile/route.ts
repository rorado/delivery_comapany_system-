import { NextResponse } from "next/server";

import {
  adminProfileSchema,
  readAdminProfile,
  writeAdminProfile,
} from "@/lib/adminProfileDb";

export async function GET() {
  try {
    const profile = await readAdminProfile();
    return NextResponse.json(profile);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Failed to read admin profile", details: message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const profile = adminProfileSchema.parse(body);
    await writeAdminProfile(profile);
    return NextResponse.json(profile);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Invalid admin profile payload", details: message },
      { status: 400 }
    );
  }
}
