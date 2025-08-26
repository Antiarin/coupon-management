'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Ticket, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  usedCount: number;
  usageLimit: number;
  createdAt: string;
  product?: {
    name: string;
    category: string;
  };
  purchaseOrder?: {
    customerName: string;
    email: string;
    orderNumber: string;
  };
}

interface Analytics {
  statistics: {
    totalCoupons: number;
    activeCoupons: number;
    usedCoupons: number;
    expiredCoupons: number;
    usageRate: number;
  };
  recentCoupons: Coupon[];
}

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async (): Promise<{ success: boolean; data: Analytics }> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  const { data: couponsData, isLoading: couponsLoading } = useQuery({
    queryKey: ['admin-coupons', searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('limit', '20');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/coupons?${params.toString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch coupons');
      return response.json();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}%`;
    }
    return `$${coupon.discountValue}`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      USED: 'bg-blue-100 text-blue-800',
      EXPIRED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.ACTIVE;
  };

  const stats = analytics?.data.statistics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Dashboard
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsLoading ? '...' : stats?.totalCoupons || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analyticsLoading ? '...' : stats?.activeCoupons || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Used Coupons</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {analyticsLoading ? '...' : stats?.usedCoupons || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {analyticsLoading ? '...' : `${stats?.usageRate || 0}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Coupon Management</CardTitle>
            <CardDescription>
              Search and filter coupons in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search coupons, customers, or order numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="USED">Used</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Coupons Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Coupons</CardTitle>
            <CardDescription>
              {couponsLoading ? 'Loading coupons...' : 
               `Showing ${couponsData?.data.coupons?.length || 0} coupons`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {couponsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Code</th>
                      <th className="text-left py-3 px-4">Discount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Usage</th>
                      <th className="text-left py-3 px-4">Expires</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponsData?.data.coupons?.map((coupon: Coupon) => (
                      <tr key={coupon.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{formatDiscount(coupon)}</span>
                          <div className="text-xs text-gray-500">
                            {coupon.discountType === 'PERCENTAGE' ? 'Percentage' : 'Fixed'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(coupon.status)}>
                            {coupon.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="font-medium">
                              {coupon.purchaseOrder?.customerName || 'Manual'}
                            </div>
                            <div className="text-gray-500">
                              {coupon.purchaseOrder?.email || '-'}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <span className="font-medium">{coupon.usedCount}</span>
                            <span className="text-gray-500"> / {coupon.usageLimit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {formatDate(coupon.expiresAt)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                          No coupons found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Ticket className="h-4 w-4 mr-2" />
                Create Manual Coupon
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Analytics Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {analytics?.data.recentCoupons?.slice(0, 5).map((coupon: Coupon) => (
                  <div key={coupon.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <code className="text-xs bg-gray-100 px-1 rounded">{coupon.code}</code>
                      <div className="text-gray-500 text-xs mt-1">
                        Created {formatDate(coupon.createdAt)}
                      </div>
                    </div>
                    <Badge size="sm" className={getStatusColor(coupon.status)}>
                      {coupon.status}
                    </Badge>
                  </div>
                )) || (
                  <div className="text-gray-500 text-center py-4">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}