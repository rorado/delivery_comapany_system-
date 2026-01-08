export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  image?: string;
  password?: string;
}
