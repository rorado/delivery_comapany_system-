import { Suspense } from "react";
import ShipmentsPage from "./ShipmentsPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShipmentsPage />
    </Suspense>
  );
}
