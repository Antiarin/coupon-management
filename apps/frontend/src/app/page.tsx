import type { Metadata } from 'next';
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
  Phone,
  HelpCircle
} from 'lucide-react';

// Static generation - no dynamic data, best for SEO & LCP
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Generate & Validate Discount Coupons for Pantum Products',
  description:
    'Generate, validate, and manage discount coupons for Pantum products. Get exclusive deals and savings on printers and supplies after every purchase.',
  openGraph: {
    title: 'Pantum Coupon System - Generate & Validate Discount Coupons',
    description:
      'Your one-stop solution for generating, validating, and managing discount coupons for Pantum products.',
  },
};

const faqs = [
  {
    question: 'How do I get a Pantum coupon?',
    answer:
      'Purchase any Pantum product, then use the Generate Coupon page with your invoice number and phone number. After OTP verification, you will receive a unique discount coupon code.',
  },
  {
    question: 'How do I validate my coupon code?',
    answer:
      'Go to the Validate Coupon page, enter your coupon code and order value. The system will check if the coupon is valid and show you the discount amount you can save.',
  },
  {
    question: 'How long are coupons valid?',
    answer:
      'Each coupon has an expiration date set at the time of generation. You can check the validity period by validating your coupon code on the Validate Coupon page.',
  },
  {
    question: 'Can I use a coupon more than once?',
    answer:
      'Each coupon has a usage limit. Most coupons are single-use, but some promotional coupons may allow multiple uses. Check your coupon details for the specific usage limit.',
  },
  {
    question: 'What discount types are available?',
    answer:
      'Pantum coupons offer two types of discounts: percentage-based (e.g., 15% off) and fixed amount (e.g., $10 off). The discount type is determined at coupon generation.',
  },
  {
    question: 'What should I do if my coupon is not working?',
    answer:
      'Ensure the coupon code is entered correctly, the coupon has not expired, and your order meets the minimum order value requirement. If the issue persists, contact Pantum support.',
  },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://coupon.pantum.in.th';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Pantum Thailand',
      url: baseUrl,
      logo: `${baseUrl}/icon.png`,
      description:
        'Pantum provides high-quality printers, toners, and supplies with exclusive coupon promotions for customers in Thailand.',
    },
    {
      '@type': 'WebApplication',
      name: 'Pantum Coupon System',
      url: baseUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Generate, validate, and manage discount coupons for Pantum products.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'THB',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b" role="banner">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2" aria-label="Pantum Coupons - Home">
              <Gift className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <span className="text-2xl font-bold text-gray-900">Pantum Coupons</span>
            </Link>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
              Demo Mode
            </Badge>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 text-center" aria-label="Hero">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Pantum Coupons
                </span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Your one-stop solution for generating, validating, and managing discount coupons
                for Pantum products. Get exclusive deals after every purchase!
              </p>
              <nav aria-label="Primary actions" className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/validate-coupon">
                    <Ticket className="mr-2 h-5 w-5" aria-hidden="true" />
                    Validate Coupon
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <Link href="/generate-coupon">
                    <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                    Generate Coupon
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <Link href="/purchase-demo">
                    <ShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
                    Demo Purchase
                  </Link>
                </Button>
              </nav>
            </div>
          </section>

          {/* How It Works */}
          <section className="container mx-auto px-4 py-16" aria-label="How it works">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <article>
                <Card className="relative overflow-hidden h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <ShoppingBag className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <CardTitle>1. Make a Purchase                    </CardTitle>
                    <CardDescription>
                      Buy any Pantum product and provide your invoice details or serial number
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/purchase-demo">
                        Try Demo <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </article>

              <article>
                <Card className="relative overflow-hidden h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Gift className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <CardTitle>2. Get Your Coupon                    </CardTitle>
                    <CardDescription>
                      Automatically receive a discount coupon via email with exclusive savings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Up to 25% off your next purchase
                    </p>
                  </CardContent>
                </Card>
              </article>

              <article>
                <Card className="relative overflow-hidden h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Ticket className="h-6 w-6 text-purple-600" aria-hidden="true" />
                    </div>
                    <CardTitle>3. Use & Save                    </CardTitle>
                    <CardDescription>
                      Validate your coupon code and enjoy instant savings on your next order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/validate-coupon">
                        Validate Now <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </article>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="bg-white/50 backdrop-blur-sm border-y" aria-label="Quick actions">
            <div className="container mx-auto px-4 py-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Quick Actions
              </h2>
              <nav aria-label="Quick action links" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Ticket className="h-12 w-12 text-blue-600 mx-auto mb-4" aria-hidden="true" />
                    <CardTitle>Validate Coupon                    </CardTitle>
                    <CardDescription>
                      Enter your coupon code to check validity and see discount amount
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild className="w-full">
                      <Link href="/validate-coupon">
                        Validate Your Coupon
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Gift className="h-12 w-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
                    <CardTitle>Generate Coupon                    </CardTitle>
                    <CardDescription>
                      Use your invoice and phone number to generate a new discount coupon
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild className="w-full">
                      <Link href="/generate-coupon">
                        Generate New Coupon
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" aria-hidden="true" />
                    <CardTitle>Admin Panel                    </CardTitle>
                    <CardDescription>
                      Manage coupons, view analytics, and configure system settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin">
                        Access Admin Panel
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </nav>
            </div>
          </section>
          {/* FAQ Section */}
          <section className="container mx-auto px-4 py-16" aria-label="Frequently asked questions">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 flex items-center justify-center gap-3">
                <HelpCircle className="h-8 w-8 text-blue-600" aria-hidden="true" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                      <span className="text-sm sm:text-base pr-4">{faq.question}</span>
                      <ArrowRight className="h-4 w-4 text-gray-500 shrink-0 transition-transform group-open:rotate-90" aria-hidden="true" />
                    </summary>
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white" role="contentinfo">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="h-6 w-6" aria-hidden="true" />
                <span className="text-xl font-semibold">Pantum Coupon System</span>
              </div>
              <p className="text-gray-400 mb-4" aria-label="Application description">
                Demo version - Built with Next.js, Express.js, and PostgreSQL
              </p>
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Pantum Coupon System. This is a demonstration application.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
