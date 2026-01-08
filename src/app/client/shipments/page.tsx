import { Suspense } from "react";
import MyShipmentsPage from "./MyShipmentsPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyShipmentsPage />
    </Suspense>
  );
}
