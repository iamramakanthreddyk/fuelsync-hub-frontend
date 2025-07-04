
/**
 * @file pages/dashboard/PumpsPage.tsx
 * @description Page for managing pumps with improved mobile layout
 * Updated layout for mobile-friendliness – 2025-07-03
 */
import { useState } from 'react';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useForm } from 'react-hook-form';
import { Plus, Fuel, Activity, Building2, ArrowLeft, Loader2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PumpCard } from '@/components/pumps/PumpCard';
import { MobileStatsCard } from '@/components/dashboard/MobileStatsCard';
import { usePumps, useCreatePump, useDeletePump } from '@/hooks/usePumps';
import { useStations, useStation } from '@/hooks/useStations';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function PumpsPage() {
  useRoleGuard(['owner', 'manager']);
  const { stationId } = useParams<{ stationId: string }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(stationId || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for stationId in query params if not in route params
  const queryParams = new URLSearchParams(location.search);
  const stationIdFromQuery = queryParams.get('stationId');
  const effectiveStationId = stationId || stationIdFromQuery || selectedStationId;

  const form = useForm({
    defaultValues: {
      name: '',
      serialNumber: ''
    }
  });

  // Fetch all stations
  const { data: stations = [], isLoading: stationsLoading } = useStations();
  
  // Fetch specific station details if we have a stationId
  const { data: station } = useStation(effectiveStationId);
  
  // Fetch pumps for selected station
  const { data: pumps = [], isLoading: pumpsLoading, refetch } = usePumps(effectiveStationId);

  // Create pump mutation using OpenAPI-compliant hook
  const createPumpMutation = useCreatePump();

  const onSubmit = async (data: any) => {
    if (!effectiveStationId) {
      toast({
        title: "Error",
        description: "Please select a station first",
        variant: "destructive",
      });
      return;
    }
    try {
      await createPumpMutation.mutateAsync({ ...data, stationId: effectiveStationId });
      setIsAddDialogOpen(false);
      form.reset();
      toast({ title: 'Success', description: 'Pump created successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create pump', variant: 'destructive' });
    }
  };

  // Handle station change
  const handleStationChange = (value: string) => {
    setSelectedStationId(value);
    navigate(`/dashboard/pumps?stationId=${value}`);
  };

  // Handle view nozzles navigation
  const handleViewNozzles = (pumpId: string) => {
    if (effectiveStationId) {
      navigate(`/dashboard/nozzles?pumpId=${pumpId}&stationId=${effectiveStationId}`);
    } else {
      navigate(`/dashboard/nozzles?pumpId=${pumpId}`);
    }
  };

  // Navigate to edit pump page
  const handleEditPump = (pumpId: string) => {
    navigate(`/dashboard/pumps/${pumpId}/settings`);
  };

  const deletePumpMutation = useDeletePump();

  const handleDeletePump = async (pumpId: string) => {
    if (window.confirm('Delete this pump?')) {
      try {
        await deletePumpMutation.mutateAsync(pumpId);
        toast({ title: 'Deleted', description: 'Pump removed' });
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to delete', variant: 'destructive' });
      }
    }
  };

  // Handle back to stations navigation
  const handleBackToStations = () => {
    navigate('/dashboard/stations');
  };

  const isLoading = stationsLoading || pumpsLoading;

  // If no station is selected, show station selector
  if (!effectiveStationId) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Pumps</h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              Please select a station to manage its pumps
            </p>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Select a Station</CardTitle>
            <CardDescription className="text-sm">Choose a station to view its pumps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="station-select" className="text-sm font-medium">
                  Station
                </label>
                <Select 
                  value={selectedStationId} 
                  onValueChange={handleStationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stationsLoading ? (
                      <SelectItem value="loading" disabled>Loading stations...</SelectItem>
                    ) : stations.length === 0 ? (
                      <SelectItem value="no-stations" disabled>No stations available</SelectItem>
                    ) : (
                      stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-3 pt-2">
                <Button variant="outline" onClick={handleBackToStations} className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-4 w-4" />
                  View All Stations
                </Button>
                
                <Button 
                  onClick={() => navigate('/dashboard/stations/new')}
                  disabled={stationsLoading}
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Station
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const mobileStats = [
    { title: 'Total', value: pumps.length, icon: Fuel, color: 'text-blue-600' },
    { title: 'Active', value: pumps.filter(p => p.status === 'active').length, icon: Activity, color: 'text-green-600' },
    { title: 'Nozzles', value: pumps.reduce((sum, pump) => sum + (pump.nozzleCount || 0), 0), icon: Settings, color: 'text-purple-600' },
    { title: 'Maintenance', value: pumps.filter(p => p.status === 'maintenance').length, icon: Settings, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <Breadcrumbs />
      <div className="flex items-center mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/stations/${effectiveStationId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Pumps</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
            <p className="text-muted-foreground text-sm hidden sm:block">Station:</p>
            <Select value={effectiveStationId} onValueChange={handleStationChange}>
              <SelectTrigger className="w-full sm:w-[200px] h-8 text-xs sm:text-sm">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Add pump button - full width on mobile */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto sm:self-start">
              <Plus className="mr-2 h-4 w-4" />
              Add Pump
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] mx-4">
            <DialogHeader>
              <DialogTitle>Add New Pump</DialogTitle>
              <DialogDescription>
                Add a new pump to {station?.name || 'selected station'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pump Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pump name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter serial number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPumpMutation.isPending}
                    className="order-1 sm:order-2"
                  >
                    {createPumpMutation.isPending ? "Creating..." : "Create Pump"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Stats Card */}
      <MobileStatsCard stats={mobileStats} />

      {/* Desktop Stats Cards */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pumps</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pumps.length}</div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nozzles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.reduce((sum, pump) => sum + (pump.nozzleCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pumps.filter(p => p.status === 'maintenance').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pumps Grid with improved mobile layout */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TooltipProvider>
          {pumps.map((pump) => (
            <div key={pump.id} className="overflow-hidden">
              <PumpCard
                pump={{
                  id: pump.id,
                  name: pump.name,
                  serialNumber: pump.serialNumber,
                  status: pump.status,
                  nozzleCount: pump.nozzleCount || 0,
                }}
                onViewNozzles={() => handleViewNozzles(pump.id)}
                onEdit={() => handleEditPump(pump.id)}
                onDelete={() => handleDeletePump(pump.id)}
              />
            </div>
          ))}
        </TooltipProvider>
      </div>

      {pumps.length === 0 && !isLoading && (
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            <Fuel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pumps found</h3>
            <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
              Get started by adding your first pump to this station.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add First Pump
            </Button>
          </CardContent>
        </Card>
      )}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg"
        onClick={() => setIsAddDialogOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
