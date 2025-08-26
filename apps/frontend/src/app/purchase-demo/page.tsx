'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShoppingBag, 
  ArrowLeft,
  CheckCircle,
  Gift,
  Mail,
  Sparkles,
  Package,
  CreditCard,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

const demoProducts: Product[] = [
  {
    id: 'demo-printer-1',
    name: 'Pantum P2502W Wireless Laser Printer',
    price: 99.99,
    category: 'Printers',
    imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400'
  },
  {
    id: 'demo-cartridge-1', 
    name: 'Pantum TL-410H High Yield Toner',
    price: 49.99,
    category: 'Cartridges',
    imageUrl: 'https://images.unsplash.com/photo-1586953983027-d7508698449c?w=400'
  },
  {
    id: 'demo-paper-1',
    name: 'Premium A4 Paper 500 Sheets',
    price: 12.99,
    category: 'Paper',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
  }
];

export default function PurchaseDemoPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(demoProducts[0]);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  const createPurchaseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create purchase');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setPurchaseResult(data.data);
      toast.success('Purchase successful! Coupon generated.');
    },
    onError: (error) => {
      toast.error(`Purchase failed: ${error.message}`);
    },
  });

  const handlePurchase = () => {
    if (!customerName || !email) {
      toast.error('Please fill in all required fields');
      return;
    }

    createPurchaseMutation.mutate({
      customerName,
      email,
      phone,
      productId: selectedProduct.id,
      totalAmount: selectedProduct.price,
      serialNumber: `SN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    });
  };

  const formatDiscount = (coupon: any) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `${coupon.discountValue}% off`;
    }
    return `$${coupon.discountValue} off`;
  };

  if (purchaseResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Purchase Successful!</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank you for your purchase!
              </h2>
              <p className="text-gray-600 mb-6">
                Your order has been processed successfully and a discount coupon has been generated.
              </p>
            </div>

            {/* Coupon Card */}
            <Card className="mb-8 border-2 border-dashed border-green-300 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-green-700">
                  <Gift className="h-6 w-6" />
                  Your Exclusive Coupon
                </CardTitle>
                <CardDescription>Use this code for your next purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">
                    {formatDiscount(purchaseResult.coupon)}
                  </div>
                  <div className="text-2xl font-mono bg-white p-4 rounded-lg border-2 border-dashed border-green-400">
                    {purchaseResult.coupon.code}
                  </div>
                  <div className="text-sm text-gray-600">
                    Valid until {new Date(purchaseResult.coupon.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {purchaseResult.purchaseOrder.orderNumber}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">${selectedProduct.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Serial Number:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {purchaseResult.purchaseOrder.serialNumber}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-blue-700 mb-4">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Demo Mode Notice</span>
                </div>
                <div className="text-sm text-blue-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email delivery is simulated in demo mode</span>
                  </div>
                  <p>In production, this coupon would be sent to your email address automatically.</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex gap-4 justify-center">
              <Button asChild>
                <Link href="/validate-coupon">
                  Test Your Coupon
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin">
                  View in Admin Panel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <ShoppingBag className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Demo Purchase</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Demo Product Purchase
            </h2>
            <p className="text-gray-600">
              Simulate a product purchase to see the automatic coupon generation system in action
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Selection */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Select Product
                  </CardTitle>
                  <CardDescription>
                    Choose a product for your demo purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedProduct.id === product.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <span className="text-lg font-bold text-blue-600">
                                ${product.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Information */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>
                    Enter your details for the demo purchase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Coupon will be generated for this email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 234 567 8900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Product:</span>
                        <span className="font-medium">{selectedProduct.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span>{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total:</span>
                        <span>${selectedProduct.price}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={createPurchaseMutation.isPending || !customerName || !email}
                    className="w-full"
                    size="lg"
                  >
                    {createPurchaseMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-4 w-4 mr-2" />
                    )}
                    Complete Demo Purchase
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    This is a demo purchase. No actual payment will be processed.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}