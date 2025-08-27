import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Ticket, 
  Settings, 
  Gift, 
  Sparkles,
  ArrowRight,
  Phone 
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Pantum Coupons</h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Sparkles className="h-3 w-3 mr-1" />
            Demo Mode
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Pantum Coupons
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your one-stop solution for generating, validating, and managing discount coupons 
            for Pantum products. Get exclusive deals after every purchase!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/validate-coupon">
                <Ticket className="mr-2 h-5 w-5" />
                Validate Coupon
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/generate-coupon">
                <Phone className="mr-2 h-5 w-5" />
                Generate Coupon
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/purchase-demo">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Demo Purchase
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>1. Make a Purchase</CardTitle>
              <CardDescription>
                Buy any Pantum product and provide your invoice details or serial number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/purchase-demo">
                  Try Demo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>2. Get Your Coupon</CardTitle>
              <CardDescription>
                Automatically receive a discount coupon via email with exclusive savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Up to 25% off your next purchase
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>3. Use & Save</CardTitle>
              <CardDescription>
                Validate your coupon code and enjoy instant savings on your next order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/validate-coupon">
                  Validate Now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white/50 backdrop-blur-sm border-y">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Ticket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Validate Coupon</CardTitle>
                <CardDescription>
                  Enter your coupon code to check validity and see discount amount
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full">
                  <Link href="/validate-coupon">
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Generate Coupon</CardTitle>
                <CardDescription>
                  Use your invoice and phone number to generate a new discount coupon
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild className="w-full">
                  <Link href="/generate-coupon">
                    Generate Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Manage coupons, view analytics, and configure system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin">
                    Access Admin
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="h-6 w-6" />
              <span className="text-xl font-semibold">Pantum Coupon System</span>
            </div>
            <p className="text-gray-400 mb-4">
              Demo version - Built with Next.js, Express.js, and PostgreSQL
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Pantum Coupon System. This is a demonstration application.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}