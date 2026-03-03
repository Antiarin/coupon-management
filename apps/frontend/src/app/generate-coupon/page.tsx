import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ticket, ArrowLeft, Loader2 } from 'lucide-react';
import GenerateCouponForm from './_components/GenerateCouponForm';

export const metadata: Metadata = {
  title: 'Generate Coupon',
  description:
    'Generate a discount coupon for your Pantum purchase. Provide your invoice number and verify via OTP to receive an exclusive coupon code.',
  openGraph: {
    title: 'Generate Your Coupon | Pantum Coupon System',
    description:
      'Get an exclusive discount coupon by verifying your Pantum purchase with invoice number and OTP verification.',
  },
};

export default function GenerateCouponPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
              <Ticket className="h-6 w-6 text-purple-600" aria-hidden="true" />
              <h1 className="text-xl font-bold text-gray-900">Generate Coupon</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
          <GenerateCouponForm />
        </Suspense>
      </main>
    </div>
  );
}
