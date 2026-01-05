export type DriverStatus = "Active" | "On Route" | "Offline" | "On Break";

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: DriverStatus;
  deliveries: number;
  rating: number;
  image?: string;
}
