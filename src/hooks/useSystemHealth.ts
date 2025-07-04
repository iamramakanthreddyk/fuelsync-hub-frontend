import { useQuery } from '@tanstack/react-query';
import { ownerService } from '@/api/contract/owner.service';

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: () => ownerService.getSystemHealth(),
    staleTime: 60000,
  });
};
