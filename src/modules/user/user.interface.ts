export interface IUser {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  gender?: 'male' | 'female' | 'other';
  paymentStatus?: 'paid' | 'pending';
  isTermsAndConditionAccepted?: Boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
