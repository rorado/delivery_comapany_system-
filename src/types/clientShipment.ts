export type ClientShipmentStatus =
  | "En attente"
  | "En transit"
  | "En livraison"
  | "Livré"
  | "Échoué";

export interface ClientShipment {
  id: number;
  trackingNumber: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  weight: string;
  status: ClientShipmentStatus;
  estimatedDelivery: string;
  createdAt: string;
}
