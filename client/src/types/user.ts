export interface User {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  isActive: boolean;
  storeId: string;
  storeName: string;
  balance: number;
  redemptionsCount: number;
  lastActivity: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'LOGIN' | 'REDEMPTION' | 'UPDATE' | 'OTHER';
  description: string;
  timestamp: string;
}

export type FilterStatus = 'all' | 'online' | 'disabled';