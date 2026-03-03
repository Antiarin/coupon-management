'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Ticket,
  CheckCircle,
  XCircle,
  Loader2,
  Gift,
  Calendar,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

export default function ValidateCouponForm() {
  const [couponCode, setCouponCode] = useState('');
  const [orderValue, setOrderValue] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);

  const { data: validation, isLoading, error } = useQuery({
    queryKey: ['validate-coupon', couponCode, orderValue],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/validate/${encodeURIComponent(couponCode)}?orderValue=${orderValue}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate coupon');
      }

      return response.json();
    },
    enabled: shouldValidate && couponCode.length > 0,
    retry: false,
  });

  const handleValidate = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    if (!orderValue || parseFloat(orderValue) <= 0) {
      toast.error('Please enter a valid order value');
      return;
    }
    // Reset and re-enable to trigger a fresh query with current couponCode/orderValue
    setShouldValidate(false);
    setTimeout(() => setShouldValidate(true), 0);
  };

  const handleReset = () => {
    setCouponCode('');
    setOrderValue('');
    setShouldValidate(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDiscount = (coupon: any) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}% off`;
    }
    return `$${coupon.discountValue} off`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Input Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" aria-hidden="true" />
            Enter Coupon Details
          </CardTitle>
          <CardDescription>
            Enter your coupon code and optional order value to validate the discount
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-code">Coupon Code *</Label>
            <Input
              id="coupon-code"
              placeholder="e.g. SAVE-20-AB"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="font-mono text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order-value">Order Value *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" aria-hidden="true" />
              <Input
                id="order-value"
                type="number"
                placeholder="0.00"
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
                className="pl-10"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Enter your order value to calculate the discount amount
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleValidate}
              disabled={isLoading || !couponCode.trim() || !orderValue || parseFloat(orderValue) <= 0}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              Validate Coupon
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <XCircle className="h-5 w-5" aria-hidden="true" />
              <div>
                <p className="font-medium">Invalid Coupon</p>
                <p className="text-sm">{error.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {validation?.success && validation.data && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" aria-hidden="true" />
                Valid Coupon!
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {validation.data.coupon.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Coupon Details */}
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-300">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatDiscount(validation.data.coupon)}
                </div>
                <div className="text-xl font-mono text-gray-700">
                  {validation.data.coupon.code}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Expires On</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {formatDate(validation.data.coupon.expiresAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Usage Left</p>
                  <p className="font-medium">
                    {validation.data.coupon.usageLimit - validation.data.coupon.usedCount} / {validation.data.coupon.usageLimit}
                  </p>
                </div>
                {validation.data.coupon.minimumOrderValue && (
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Minimum Order Value</p>
                    <p className="font-medium flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                      ${validation.data.coupon.minimumOrderValue}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Discount Calculation */}
            {validation.data.discount > 0 && (
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Gift className="h-4 w-4" aria-hidden="true" />
                  Your Savings
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Value:</span>
                    <span className="font-medium">${validation.data.orderValue}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">-${validation.data.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Final Amount:</span>
                    <span>${(validation.data.orderValue - validation.data.discount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Product Info */}
            {validation.data.coupon.product && (
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-medium mb-3">Related Product</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{validation.data.coupon.product.name}</span>
                  <br />
                  Category: {validation.data.coupon.product.category}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sample Coupons */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Try These Demo Coupons</CardTitle>
          <CardDescription>
            Use these sample coupon codes to test the validation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {[
              { code: 'MV4Q-J7KQ-KU', description: '15% off - Demo coupon' },
              { code: 'XCMK-1OCK-E6', description: '15% off - Demo coupon' },
              { code: '4F1I-AD1K-GH', description: '20% off - Demo coupon' },
              { code: 'EXPIRED-DEMO', description: 'Expired coupon (for testing)' },
            ].map((sample) => (
              <div
                key={sample.code}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => setCouponCode(sample.code)}
              >
                <div>
                  <code className="font-mono text-sm font-bold">{sample.code}</code>
                  <p className="text-xs text-gray-500">{sample.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Use This
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
