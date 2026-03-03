import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import PurchaseDemoForm from './_components/PurchaseDemoForm';

export const metadata: Metadata = {
  title: 'Demo Purchase',
  description:
    'Try the Pantum coupon generation system with a simulated product purchase. See how coupons are automatically created after buying Pantum products.',
  openGraph: {
    title: 'Demo Purchase | Pantum Coupon System',
    description:
      'Experience the Pantum coupon system with a demo purchase simulation. See automatic coupon generation in action.',
  },
};

export default function PurchaseDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <ShoppingBag className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h1 className="text-xl font-bold text-gray-900">Demo Purchase</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
          <PurchaseDemoForm />
        </Suspense>
      </main>
    </div>
  );
}
