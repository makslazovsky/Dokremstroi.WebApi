export interface Review {
  id: number;
  userId: number;
  userOrderId: number;
  comment: string;
  rating: number;
  isApproved: boolean;
}
