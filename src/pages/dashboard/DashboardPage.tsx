
/**
 * @file DashboardPage.tsx
 * @description Dashboard page showing key metrics and stats with enhanced analytics
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, Fuel, Loader2, Building2, Shield, Package, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStations } from '@/hooks/api/useStations';
import { usePumps } from '@/hooks/api/usePumps';
import { useFuelPrices } from '@/hooks/api/useFuelPrices';
import { useReadings } from '@/hooks/api/useReadings';
import { useAnalyticsDashboard, useAdminDashboard } from '@/hooks/useDashboard';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { EnhancedMetricsCard } from '@/components/ui/enhanced-metrics-card';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch basic data
  const { data: stations = [], isLoading: stationsLoading, refetch: refetchStations } = useStations();
  const { data: pumps = [], isLoading: pumpsLoading, refetch: refetchPumps } = usePumps();
  const { data: fuelPrices = [], isLoading: pricesLoading, refetch: refetchPrices } = useFuelPrices();
  const { data: readings = [], isLoading: readingsLoading, refetch: refetchReadings } = useReadings();
  
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useAnalyticsDashboard();
  const { data: adminData, isLoading: adminLoading, refetch: refetchAdmin } = useAdminDashboard();
  const { data: systemHealth } = useSystemHealth();
  
  // Calculate metrics
  const totalRevenue = readings.reduce((sum, reading) => sum + (reading.amount || 0), 0);
  const totalVolume = readings.reduce((sum, reading) => sum + (reading.volume || 0), 0);
  const activeStations = stations.filter(s => s.status === 'active').length;
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchStations(),
      refetchPumps(),
      refetchPrices(),
      refetchReadings(),
      refetchAnalytics(),
      refetchAdmin()
    ]);
    setIsRefreshing(false);
  };
  
  const isLoading = stationsLoading || pumpsLoading || pricesLoading || readingsLoading || analyticsLoading || adminLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || 'User'}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isRefreshing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedMetricsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="This month's earnings"
          gradient="from-emerald-500 to-teal-600"
          trend={{ value: 12.5, isPositive: true }}
        />

        <EnhancedMetricsCard
          title="Fuel Volume"
          value={`${totalVolume.toFixed(2)}L`}
          icon={<Fuel className="h-5 w-5" />}
          description="Total fuel dispensed"
          gradient="from-blue-500 to-cyan-600"
          trend={{ value: 8.3, isPositive: true }}
        />

        <EnhancedMetricsCard
          title="Active Stations"
          value={activeStations}
          icon={<Building2 className="h-5 w-5" />}
          description={`${stations.length} total stations`}
          gradient="from-purple-500 to-indigo-600"
        />

        <EnhancedMetricsCard
          title="Analytics Score"
          value={`${Math.round((activeStations / Math.max(stations.length, 1)) * 100)}%`}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Performance rating"
          gradient="from-orange-500 to-red-600"
          trend={{ value: 5.2, isPositive: true }}
        />
      </div>

      {/* Analytics Cards - Only show if we have analytics data */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnhancedMetricsCard
            title="Total Tenants"
            value={analytics.overview?.totalTenants || analytics.totalTenants || 0}
            icon={<Users className="h-5 w-5" />}
            description="Across all stations"
            gradient="from-pink-500 to-rose-600"
          />
          
          <EnhancedMetricsCard
            title="System Health"
            value={systemHealth ? `${systemHealth.uptime.toFixed(1)}%` : 'N/A'}
            icon={<Shield className="h-5 w-5" />}
            description="Platform uptime"
            gradient="from-green-500 to-emerald-600"
          />
          
          <EnhancedMetricsCard
            title="Features Active"
            value={fuelPrices.length}
            icon={<Package className="h-5 w-5" />}
            description="Fuel price configurations"
            gradient="from-violet-500 to-purple-600"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">Station Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your fuel stations, pumps, and nozzles efficiently.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/dashboard/stations">View Stations</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/pumps">Manage Pumps</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Fuel Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Monitor readings, set prices, and track inventory.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                <Link to="/dashboard/readings">New Reading</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/fuel-prices">Set Prices</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">Reports & Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate insights and export business reports.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link to="/dashboard/reports">View Reports</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/analytics">Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {readings.length > 0 && (
        <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readings.slice(0, 5).map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <div className="font-medium">Reading #{reading.id.slice(0, 8)}</div>
                    <div className="text-sm text-muted-foreground">
                      {reading.volume?.toFixed(2)}L • ₹{reading.amount?.toFixed(2)} • {reading.paymentMethod}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(reading.recordedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
