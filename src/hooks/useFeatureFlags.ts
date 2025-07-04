import { useQuery } from '@tanstack/react-query';
import { tenantSettingsApi, TenantSetting } from '@/api/tenant-settings';
import { useAuth } from '@/contexts/AuthContext';

export interface FeatureFlags {
  allowExport: boolean;
  autoSalesGeneration: boolean;
  [key: string]: boolean;
}

export const useFeatureFlags = () => {
  const { user } = useAuth();

  return useQuery<FeatureFlags>({
    queryKey: ['feature-flags', user?.tenantId],
    queryFn: async () => {
      const flags: FeatureFlags = {
        allowExport: true,
        autoSalesGeneration: true,
      };

      if (!user?.tenantId) return flags;

      const settings = await tenantSettingsApi.getTenantSettings();
      settings.forEach((s: TenantSetting) => {
        if (s.key.startsWith('features.')) {
          const key = s.key.replace('features.', '');
          const value = s.value === 'true';
          switch (key) {
            case 'allow_export':
              flags.allowExport = value;
              break;
            case 'auto_sales_generation':
              flags.autoSalesGeneration = value;
              break;
            default:
              flags[key] = value;
          }
        }
      });
      return flags;
    },
    enabled: !!user?.tenantId,
  });
};
