export interface Issue {
  _id: string;
  user: { _id: string; fullName?: string; username?: string; email?: string } | string;
  bookingRef: string;
  category: string;
  description: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface Dispute {
  _id: string;
  booking: { _id: string; bookingRef: string; totalAmount: number } | string;
  renter: { _id: string; fullName?: string; username?: string } | string;
  vendor?: { _id: string; fullName?: string; username?: string } | string;
  issue: string;
  amount: number;
  status: 'open' | 'resolved';
  resolution?: 'refund_renter' | 'side_with_vendor';
  createdAt: string;
}

export type ChecklistCondition = 'none' | 'minor' | 'major';

export interface ChecklistItem {
  key: string;
  condition: ChecklistCondition;
}
