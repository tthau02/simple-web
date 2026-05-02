export type User = {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  avatar?: string | null;
  status: boolean;
  roles: string[];
  createdAt: string;
};

export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  expiresAtUtc: string;
  user: User;
};

export type RegisterRequest = {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
};
