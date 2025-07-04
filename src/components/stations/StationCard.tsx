import { Button } from '@/components/ui/button';
import { ColorfulCard, CardContent, CardHeader } from '@/components/ui/colorful-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Eye, Edit, Trash2, Settings, Fuel, Building2, DollarSign } from 'lucide-react';

interface StationCardProps {
  station: {
    id: string;
    name: string;
    address: string;
    status: string;
    pumpCount: number;
    metrics?: { totalSales?: number };
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSettings?: (id: string) => void;
  onViewPumps?: (id: string) => void;
}

export function StationCard({
  station,
  onView,
  onEdit,
  onDelete,
  onSettings,
  onViewPumps,
}: StationCardProps) {
  const getGradientByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'from-green-50 via-emerald-50 to-teal-50 border-green-200';
      case 'maintenance':
        return 'from-yellow-50 via-orange-50 to-amber-50 border-yellow-200';
      case 'inactive':
        return 'from-red-50 via-pink-50 to-rose-50 border-red-200';
      default:
        return 'from-gray-50 via-slate-50 to-zinc-50 border-gray-200';
    }
  };

  return (
    <ColorfulCard gradient={getGradientByStatus(station.status)} className="border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                {station.name}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                {station.address}
              </p>
            </div>
          </div>
          <StatusBadge status={station.status} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Pumps</p>
                <p className="font-bold text-gray-900">{station.pumpCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">Today's Sales</p>
                <p className="font-bold text-gray-900">
                  ₹{station.metrics?.totalSales?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button variant="default" size="sm" className="flex-1" onClick={() => onView(station.id)}>
            <Eye className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(station.id)}>
            <Edit className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700"
            onClick={() => onDelete(station.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
          {onSettings && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onSettings(station.id)}>
              <Settings className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          )}
          {onViewPumps && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewPumps(station.id)}>
              <Fuel className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Pumps</span>
            </Button>
          )}
        </div>
      </CardContent>
    </ColorfulCard>
  );
}
