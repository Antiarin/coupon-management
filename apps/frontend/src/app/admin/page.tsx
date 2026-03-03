import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, ArrowLeft, Loader2 } from 'lucide-react';
import AdminDashboard from './_components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description:
    'Manage coupons, view analytics, and configure system settings for the Pantum Coupon System.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Dashboard
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  );
}
