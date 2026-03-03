import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft, Loader2 } from 'lucide-react';
import ValidateCouponForm from './_components/ValidateCouponForm';

export const metadata: Metadata = {
  title: 'Validate Coupon',
  description:
    'Enter your Pantum coupon code to check its validity, view discount details, and calculate savings on your order.',
  openGraph: {
    title: 'Validate Your Coupon | Pantum Coupon System',
    description:
      'Check if your Pantum coupon code is valid and see how much you can save on your next purchase.',
  },
};

export default function ValidateCouponPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-blue-600" aria-hidden="true" />
              <h1 className="text-xl font-bold text-gray-900">Validate Coupon</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
          <ValidateCouponForm />
        </Suspense>
      </main>
    </div>
  );
}
