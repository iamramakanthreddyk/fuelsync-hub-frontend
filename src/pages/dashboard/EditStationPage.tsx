import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function EditStationPage() {
  useRoleGuard(['owner', 'manager']);
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Station {stationId}</h1>
      </div>
      <p className="text-muted-foreground">Station editing form coming soon.</p>
    </div>
  );
}
