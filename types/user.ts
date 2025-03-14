export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer extends User {
  points: number;
}
