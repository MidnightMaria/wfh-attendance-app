export type UserProfile = {
  userId: number;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  employee_id?: number | null;
};

const TOKEN_KEY = 'token';
const PROFILE_KEY = 'profile';

export const saveAuthData = (token: string, profile: UserProfile) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getProfile = (): UserProfile | null => {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
};

export const isAuthenticated = () => !!getToken();