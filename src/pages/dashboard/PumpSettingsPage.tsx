import { useParams, useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PumpSettingsPage() {
  useRoleGuard(['owner', 'manager']);
  const { pumpId } = useParams<{ pumpId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Pump Settings {pumpId}</h1>
      </div>
      <p className="text-muted-foreground">Pump settings form coming soon.</p>
    </div>
  );
}
