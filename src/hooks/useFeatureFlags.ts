import { useQuery } from '@tanstack/react-query';
import { tenantSettingsApi, TenantSetting } from '@/api/tenant-settings';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureFlags {
  [key: string]: string;
}

export const useFeatureFlags = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['feature-flags', user?.tenantId],
    queryFn: async () => {
      if (!user?.tenantId) return {} as FeatureFlags;
      const settings = await tenantSettingsApi.getTenantSettings();
      const flags: FeatureFlags = {};
      settings.forEach((s: TenantSetting) => {
        if (s.key.startsWith('features.')) {
          flags[s.key] = s.value;
        }
      });
      return flags;
    },
    enabled: !!user?.tenantId,
  });
};
