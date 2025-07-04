/**
 * @file ReadingsPage.tsx
 * @description Page component for viewing and managing readings
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, Clock, AlertTriangle, CheckCircle, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { PageHeader } from '@/components/ui/page-header';
import { useReadings } from '@/hooks/useReadings';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { ReadingsTable } from '@/components/readings/ReadingsTable';

export default function ReadingsPage() {
  useRoleGuard(['owner', 'manager', 'attendant']);
  const navigate = useNavigate();
  const { data: features } = useFeatureFlags();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'discrepancy'>('all');
  
  // Fetch readings using the API hook
  const { data: readings, isLoading, error } = useReadings();

  // Filter readings based on selected filter
  const filteredReadings = readings?.filter(
    (reading) => filter === 'all' || reading.status === filter
  ) || [];

  // Calculate stats
  const totalReadings = readings?.length || 0;
  const pendingReadings = readings?.filter(r => r.status === 'pending').length || 0;
  const discrepancyReadings = readings?.filter(r => r.status === 'discrepancy').length || 0;
  const completedReadings = readings?.filter(r => r.status === 'completed').length || 0;


  return (
    <div className="space-y-6">
      {features && !features.autoSalesGeneration && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
          Automatic sales generation is disabled for this tenant.
        </div>
      )}
      <PageHeader
        title="Pump Readings"
        description="Record and monitor fuel pump readings across all stations"
        actions={
          <Button onClick={() => navigate('/dashboard/readings/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Reading
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Readings</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReadings}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Loading...' : `Total readings`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReadings}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discrepancies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discrepancyReadings}</div>
            <p className="text-xs text-muted-foreground">
              Requires review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReadings}</div>
            <p className="text-xs text-muted-foreground">
              Successfully recorded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'completed', 'discrepancy'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status === 'all' ? 'All Readings' : status}
          </Button>
        ))}
      </div>

      {/* Readings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Readings
          </CardTitle>
          <CardDescription>
            Latest pump readings from all stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center p-8 text-red-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading readings: {error.message}</p>
            </div>
          ) : (
            <ReadingsTable readings={filteredReadings} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}