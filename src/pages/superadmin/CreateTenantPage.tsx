
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { superadminApi } from '@/api/superadmin';
import { CreateTenantRequest } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';

export default function CreateTenantPage() {
  useRoleGuard(['superadmin']);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: '',
    planId: 'basic',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: ''
  });

  const createTenantMutation = useMutation({
    mutationFn: (data: CreateTenantRequest) => superadminApi.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast({
        title: "Success",
        description: "Tenant created successfully with owner user",
      });
      navigate('/superadmin/tenants');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tenant",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ownerEmail || !formData.ownerPassword || !formData.ownerName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createTenantMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/superadmin/tenants')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Tenant</h1>
          <p className="text-muted-foreground">Add a new tenant organization with owner user</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tenant Information
          </CardTitle>
          <CardDescription>
            This will create a new tenant organization with isolated data access via tenant_id
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tenant Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Shell Fuel South"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="planId">Plan Type</Label>
              <Select value={formData.planId} onValueChange={(value) => setFormData({ ...formData, planId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Enter owner full name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ownerEmail">Owner Email *</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="owner@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ownerPassword">Owner Password *</Label>
              <Input
                id="ownerPassword"
                type="password"
                value={formData.ownerPassword}
                onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                placeholder="Enter secure password"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Data Isolation</h4>
              <p className="text-sm text-blue-700">
                All tenant data is securely isolated using tenant_id (UUID). The owner user will have full access to manage this tenant's resources including stations, users, and operations data.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={createTenantMutation.isPending}
                className="flex-1"
              >
                {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/superadmin/tenants')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
