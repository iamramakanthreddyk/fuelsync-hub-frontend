/**
 * @file ReadingsPage.tsx
 * @description Page component for viewing and managing readings
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for recording readings
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Clock, AlertTriangle, CheckCircle, Plus, FileText, Eye, Edit, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { PageHeader } from '@/components/ui/page-header';
import { useReadings } from '@/hooks/useReadings';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function ReadingsPage() {
  useRoleGuard(['owner', 'manager', 'attendant']);
  const navigate = useNavigate();
  const { data: features } = useFeatureFlags();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'discrepancy'>('all');
  
  // Fetch readings using the API hook
  const { data: readings, isLoading, error } = useReadings();

  // Filter readings based on selected filter
  const filteredReadings = readings?.filter(reading => 
    filter === 'all' || reading.status === filter
  ) || [];

  // Calculate stats
  const totalReadings = readings?.length || 0;
  const pendingReadings = readings?.filter(r => r.status === 'pending').length || 0;
  const discrepancyReadings = readings?.filter(r => r.status === 'discrepancy').length || 0;
  const completedReadings = readings?.filter(r => r.status === 'completed').length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'discrepancy':
        return <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Discrepancy
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading readings: {error.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => navigate('/dashboard/readings/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Reading
              </Button>
            </div>
          ) : filteredReadings.length === 0 ? (
            <div className="text-center p-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No readings found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? 'Get started by recording your first reading' 
                  : `No ${filter} readings found`}
              </p>
              <Button onClick={() => navigate('/dashboard/readings/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Record Reading
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReadings.map((reading) => (
                <div key={reading.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h4 className="font-medium">{reading.pumpName || `Nozzle ${reading.nozzleNumber || '#'}`}</h4>
                      {getStatusBadge(reading.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{reading.stationName}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <span>Current: <span className="font-mono">{reading.reading?.toFixed(2) || '0.00'}L</span></span>
                      <span>Previous: <span className="font-mono">{reading.previousReading?.toFixed(2) || '0.00'}L</span></span>
                      <span className="font-medium text-green-600">
                        Difference: +{((reading.reading || 0) - (reading.previousReading || 0)).toFixed(2)}L
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recorded by {reading.recordedBy || 'Unknown'} at {reading.recordedAt || 'Unknown time'}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/readings/${reading.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard/readings/${reading.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}