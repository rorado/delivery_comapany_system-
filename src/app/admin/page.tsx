import type { Metadata } from "next";
import { DeliveryMetrics } from "@/components/delivery/DeliveryMetrics";
import React from "react";
import DeliveryTarget from "@/components/delivery/DeliveryTarget";
import DeliveryChart from "@/components/delivery/DeliveryChart";
import DeliveryStatisticsChart from "@/components/delivery/DeliveryStatisticsChart";
import RecentDeliveries from "@/components/delivery/RecentDeliveries";
import RouteMapCard from "@/components/delivery/RouteMapCard";

export const metadata: Metadata = {
  title: "Tableau de bord Admin | Système de gestion des livraisons",
  description: "Tableau de bord administrateur pour le système de gestion de livraison",
};

export default function DeliveryDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 ">
        <DeliveryMetrics />

        <DeliveryChart />
      </div>


      <div className="col-span-12">
        <DeliveryStatisticsChart />
      </div>

      <div className="col-span-12">
        <RecentDeliveries />
      </div>
    </div>
  );
}
