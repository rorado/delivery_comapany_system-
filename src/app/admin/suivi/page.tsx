import { Suspense } from "react";
import AdminSuiviPage from "./AdminSuiviPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminSuiviPage />
    </Suspense>
  );
}
