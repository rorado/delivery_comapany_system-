import { Suspense } from "react";
import MyShipmentsPage from "./MyShipmentsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyShipmentsPage />
    </Suspense>
  );
}
