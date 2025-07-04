
import { Badge } from '@/components/ui/badge';
import { Activity, Wrench, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (statusValue: string) => {
    switch (statusValue.toLowerCase()) {
      case 'active':
        return {
          icon: <Activity className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
          textColor: 'text-white'
        };
      case 'maintenance':
        return {
          icon: <Wrench className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
          textColor: 'text-white'
        };
      case 'inactive':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-red-500 to-pink-600',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'bg-gradient-to-r from-gray-500 to-slate-600',
          textColor: 'text-white'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <Badge className={`${config.color} ${config.textColor} ${sizeClasses[size]} border-0 shadow-sm flex items-center gap-1 font-medium`}>
      {config.icon}
      <span className="capitalize">{status}</span>
    </Badge>
  );
}
