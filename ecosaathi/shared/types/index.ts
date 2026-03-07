// Shared TypeScript interfaces used by 2+ features
// Add cross-feature types here

export interface User {
  _id: string;
  name: string;
  phone: string;
  hostel: string;
  points: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
