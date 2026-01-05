export type DeliveryStatus =
  | "Pending"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Failed";

export interface Delivery {
  id: number;
  trackingNumber: string;
  recipient: string;
  destination: string;
  status: DeliveryStatus;
  estimatedDelivery: string;
  weight: string;
}
