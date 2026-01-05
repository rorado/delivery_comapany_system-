export type TrackingStatus =
  | "En attente"
  | "En transit"
  | "En livraison"
  | "Livré"
  | "Échoué";

export interface TrackingEvent {
  time: string;
  location: string;
  status: string;
  description: string;
}

export interface ShipmentTracking {
  trackingNumber: string;
  sender: string;
  recipient: string;
  recipientPhone?: string;
  origin: string;
  destination: string;
  city?: string;
  address?: string;
  currentLocation: string;
  status: TrackingStatus;
  estimatedDelivery: string;
  weight: string;
  product?: string;
  price?: string;
  comment?: string;
  createdAt?: string;
  createdAtTime?: string;
  events: TrackingEvent[];
}
