export interface ReviewAuthor {
  _id: string;
  fullName?: string;
  username?: string;
}

export interface Review {
  _id: string;
  booking: string;
  vehicle: string | { _id: string; name: string };
  user: ReviewAuthor | string;
  rating: number;
  comment: string;
  hidden: boolean;
  createdAt: string;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}
