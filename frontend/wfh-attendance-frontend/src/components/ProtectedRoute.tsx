import { Navigate } from 'react-router-dom';
import { getProfile, isAuthenticated } from '../utils/auth';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<'ADMIN' | 'EMPLOYEE'>;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const authenticated = isAuthenticated();
  const profile = getProfile();

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}