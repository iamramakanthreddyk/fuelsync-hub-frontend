import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRoleGuard = (allowedRoles: string[]) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [allowedRoles, user, isLoading, isAuthenticated, navigate]);
};
