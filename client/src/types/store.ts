export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  assignedUsers: number;
  redemptions: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreFormData {
  name: string;
  address: string;
  phone: string;
}