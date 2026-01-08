import { Suspense } from "react";
import AdminColisListePage from "./AdminColisListeClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminColisListePage />
    </Suspense>
  );
}
