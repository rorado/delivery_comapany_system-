import { Suspense } from "react";
import { TrackPackageContent } from "./TrackPackageContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackPackageContent />
    </Suspense>
  );
}
