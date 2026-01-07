import { NextResponse } from "next/server";

import { readAdminShipments } from "@/lib/shipmentsDb";

export const runtime = "nodejs";

function toBase64Png(buffer: Buffer) {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

function safe(value?: string | null) {
  return (value ?? "").trim();
}

export async function GET(
  req: Request,
  context: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await context.params;

    const url = new URL(req.url);
    const q = url.searchParams;

    const all = await readAdminShipments();
    const shipment = all.find((s) => s.packageNumber === trackingNumber);

    // Generate QR/Barcode even if shipment isn't found (e.g. seeded client list).
    // In that case, we fall back to values from query params / placeholders.

    const bwipjs = (await import("bwip-js")).default;

    const qrPng = await bwipjs.toBuffer({
      bcid: "qrcode",
      text: trackingNumber,
      scale: 4,
      includetext: false,
      padding: 2,
    });

    const barcodePng = await bwipjs.toBuffer({
      bcid: "code128",
      text: trackingNumber,
      scale: 3,
      height: 12,
      includetext: false,
      padding: 2,
    });

    const fromQuery = (key: string) => safe(q.get(key));

    return NextResponse.json({
      trackingNumber,
      sender:
        (shipment ? safe(shipment.sender) : "") || fromQuery("sender") || "—",
      senderPhone:
        (shipment ? safe(shipment.senderPhone) : "") ||
        fromQuery("senderPhone") ||
        "—",
      recipient:
        (shipment ? safe(shipment.recipient) : "") ||
        fromQuery("recipient") ||
        "—",
      recipientPhone:
        (shipment ? safe(shipment.recipientPhone) : "") ||
        fromQuery("recipientPhone") ||
        "—",
      city:
        (shipment ? safe(shipment.city) || safe(shipment.origin) : "") ||
        fromQuery("city") ||
        "—",
      address:
        (shipment
          ? safe(shipment.address) || safe(shipment.destination)
          : "") ||
        fromQuery("address") ||
        "—",
      product:
        (shipment ? safe(shipment.product) : "") ||
        fromQuery("product") ||
        "1 x (1)",
      comment: (shipment ? safe(shipment.comment) : "") || fromQuery("comment"),
      price:
        (shipment ? safe(shipment.price) : "") || fromQuery("price") || "—",
      createdAt:
        (shipment ? safe(shipment.createdAt) : "") ||
        fromQuery("createdAt") ||
        "—",
      createdAtTime:
        (shipment ? safe(shipment.createdAtTime) : "") ||
        fromQuery("createdAtTime") ||
        "",
      qrDataUrl: toBase64Png(qrPng),
      barcodeDataUrl: toBase64Png(barcodePng),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate label", error: String(error) },
      { status: 500 }
    );
  }
}
