import type { Delivery } from "@/types/delivery";

export const deliveryDeliveriesSeed: Delivery[] = [
  {
    id: 1,
    trackingNumber: "DLV-2024-001",
    recipient: "Khadija El Amrani",
    destination: "12 Avenue Mohammed V, Rabat 10000",
    status: "Out for Delivery",
    estimatedDelivery: "2026-01-05 14:00",
    weight: "2.5 kg",
  },
  {
    id: 2,
    trackingNumber: "DLV-2024-002",
    recipient: "Yassine Benali",
    destination: "Boulevard Hassan II, Marrakech 40000",
    status: "In Transit",
    estimatedDelivery: "2026-01-05 10:00",
    weight: "5.0 kg",
  },
  {
    id: 3,
    trackingNumber: "DLV-2024-003",
    recipient: "Amina El Idrissi",
    destination: "Boulevard Zerktouni, Casablanca 20000",
    status: "Delivered",
    estimatedDelivery: "2026-01-04 16:00",
    weight: "1.2 kg",
  },
];
