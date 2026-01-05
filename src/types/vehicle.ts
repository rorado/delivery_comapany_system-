export type VehicleStatus = "Active" | "In Use" | "Maintenance" | "Available";

export interface Vehicle {
  id: number;
  vehicleNumber: string;
  type: string;
  model: string;
  year: number;
  driver: string;
  status: VehicleStatus;
  mileage: string;
  lastService: string;
  capacity: string;
}
