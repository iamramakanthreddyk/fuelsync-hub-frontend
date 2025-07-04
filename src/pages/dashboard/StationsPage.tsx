/**
 * @file pages/dashboard/StationsPage.tsx
 * @description Page for managing fuel stations
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useStations, useDeleteStation } from '@/hooks/useStations';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useToast } from '@/hooks/use-toast';
import { StationCard } from '@/components/stations/StationCard';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';

export default function StationsPage() {
  useRoleGuard(['owner', 'manager']);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const deleteStation = useDeleteStation();
  const { data: stations = [], isLoading, error } = useStations();

  // Transform stations data to ensure all properties exist
  const stationsWithDefaults = stations.map(station => ({
    ...station,
    pumpCount: (station as any).pumpCount || 0,
    metrics: (station as any).metrics || { totalSales: 0, activePumps: 0, totalPumps: 0 }
  }));

  const filteredStations = stationsWithDefaults.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Error loading stations</h2>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  const handleView = (id: string) => {
    navigate(`/dashboard/stations/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/stations/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await deleteStation.mutateAsync(id);
        toast({ title: 'Success', description: 'Station deleted successfully' });
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to delete station', variant: 'destructive' });
      }
    }
  };

  const handlePumps = (id: string) => {
    navigate(`/dashboard/stations/${id}/pumps`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Fuel Stations</h1>
          <p className="text-muted-foreground">
            Manage your fuel stations and their details.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Label htmlFor="search" className="sr-only">
              Search stations
            </Label>
            <Input
              id="search"
              type="search"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {user && user.role !== 'attendant' && (
            <Button asChild>
              <Link to="/dashboard/stations/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Station
              </Link>
            </Button>
          )}
        </div>
      </div>

      {stations.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No Stations Added Yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first fuel station.
          </p>
          {user && user.role !== 'attendant' && (
            <Button asChild>
              <Link to="/dashboard/stations/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Station
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewPumps={handlePumps}
            />
          ))}
        </div>
      )}
      {user && user.role !== 'attendant' && (
        <Button
          asChild
          className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
          <Link to="/dashboard/stations/new">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Create Station</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
