export type ShipmentStatus =
  | "Pending"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Failed";

export interface Shipment {
  id: number;
  packageNumber: string;
  sender: string;
  senderPhone: string;
  recipient: string;
  recipientPhone: string;
  origin: string;
  destination: string;
  city: string;
  address: string;
  weight: string;
  product: string;
  comment: string;
  price: string;
  status: ShipmentStatus;
  driver: string;
  estimatedDelivery: string;
  createdAt: string;
  createdAtTime: string;
}
