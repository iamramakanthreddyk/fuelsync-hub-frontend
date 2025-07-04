
import { useInventory } from '@/hooks/useInventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { InventoryTable } from '@/components/fuel-deliveries/InventoryTable';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function InventoryPage() {
  useRoleGuard(['owner', 'manager']);
  const { data: inventory = [], isLoading } = useInventory();
  const lowStock = inventory.filter(
    (item: any) => item.currentStock < item.lowStockThreshold
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fuel Inventory</h1>
        <p className="text-muted-foreground">Monitor current fuel stock levels across all stations</p>
      </div>

      {lowStock.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              Low Stock Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800">
              {lowStock.length} fuel type(s) are below the low stock threshold.
            </p>
          </CardContent>
        </Card>
      )}

      <InventoryTable inventory={inventory} isLoading={isLoading} />
    </div>
  );
}
