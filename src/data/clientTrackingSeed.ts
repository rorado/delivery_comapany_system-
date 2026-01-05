import type { ShipmentTracking } from "@/types/tracking";

export const clientTrackingSeed: ShipmentTracking[] = [
  {
    trackingNumber: "DLV-2024-001",
    sender: "Atlas Logistique",
    recipient: "Khadija El Amrani",
    origin: "Casablanca",
    destination: "12 Avenue Mohammed V, Rabat 10000",
    currentLocation: "Settat",
    status: "En transit",
    estimatedDelivery: "2026-01-06 14:00",
    weight: "2,5 kg",
    events: [
      {
        time: "2026-01-05 14:30",
        location: "Settat",
        status: "En transit",
        description: "Colis en route vers sa destination",
      },
      {
        time: "2026-01-04 10:15",
        location: "Casablanca",
        status: "En transit",
        description: "Colis parti du centre d'origine",
      },
      {
        time: "2026-01-04 09:00",
        location: "Casablanca",
        status: "En attente",
        description: "Colis récupéré chez l'expéditeur",
      },
    ],
  },
  {
    trackingNumber: "DLV-2024-002",
    sender: "Société Maghreb Express",
    recipient: "Yassine Benali",
    origin: "Tanger",
    destination: "Boulevard Hassan II, Marrakech 40000",
    currentLocation: "Marrakech",
    status: "Livré",
    estimatedDelivery: "2026-01-05 16:00",
    weight: "5,0 kg",
    events: [
      {
        time: "2026-01-05 15:30",
        location: "Marrakech",
        status: "Livré",
        description: "Colis livré avec succès",
      },
      {
        time: "2026-01-05 10:00",
        location: "Marrakech",
        status: "En livraison",
        description: "Le livreur est en route",
      },
      {
        time: "2026-01-04 18:30",
        location: "Marrakech",
        status: "En transit",
        description: "Colis arrivé au centre de destination",
      },
      {
        time: "2026-01-04 08:30",
        location: "Tanger",
        status: "En attente",
        description: "Colis récupéré chez l'expéditeur",
      },
    ],
  },
];
