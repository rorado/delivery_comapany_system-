import { NextRequest, NextResponse } from "next/server";

const redirects: Record<string, string> = {
  "/signin": "/connexion",
  "/signup": "/inscription",
  "/admin/shipments": "/admin/expeditions",
  "/admin/customers": "/admin/clients",
  "/admin/drivers": "/admin/chauffeurs",
  "/admin/reports": "/admin/rapports",
  "/admin/reports/analytics": "/admin/rapports/analyses",
  "/admin/reports/deliveries": "/admin/rapports/livraisons",
  "/admin/tracking": "/admin/suivi",
  "/admin/vehicles": "/admin/vehicules",
  "/client/shipments": "/client/expeditions",
  "/client/track": "/client/suivi",
  "/client/profile": "/client/profil",
  "/delivery/deliveries": "/delivery/livraisons",
  "/delivery/profile": "/delivery/profil",
};

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const target = redirects[pathname];
  if (target) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    url.search = search;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/admin/:path*",
    "/client/:path*",
    "/delivery/:path*",
  ],
};