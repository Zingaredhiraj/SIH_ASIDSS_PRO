import { useAuth } from './AuthContext';

export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}
