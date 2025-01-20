export interface Review {
  id: number;
  userId: number;
  serviceId: number;
  comment: string;
  rating: number;
  isApproved: boolean;
}
