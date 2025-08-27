'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  FileText, 
  Loader2, 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Gift,
  Shield,
  Copy,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type Step = 'input' | 'otp' | 'success';

export default function GenerateCouponPage() {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [generatedCoupon, setGeneratedCoupon] = useState<any>(null);
  const [devOtp, setDevOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  // Auto-fetch phone number when invoice number changes
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (invoiceNumber.trim().length < 3) return;
      
      setIsLoadingInvoice(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/generate/invoice/${encodeURIComponent(invoiceNumber)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.phone) {
            setPhoneNumber(data.data.phone);
            toast.success('Phone number auto-filled from invoice');
          }
        }
      } catch (error) {
        // Silent fail - user can still enter phone manually
      } finally {
        setIsLoadingInvoice(false);
      }
    };

    const timer = setTimeout(fetchInvoiceDetails, 500); // Debounce
    return () => clearTimeout(timer);
  }, [invoiceNumber]);

  // Request OTP mutation
  const requestOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, invoiceNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send OTP');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.data.sessionId);
      setDevOtp(data.data.devOtp || '');
      setCurrentStep('otp');
      toast.success('OTP sent to your phone number');
      
      // Start timer
      let timer = 300;
      const interval = setInterval(() => {
        timer -= 1;
        setOtpTimer(timer);
        if (timer <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Verify OTP and generate coupon mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/verify-and-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify OTP');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedCoupon(data.data.coupon);
      setCurrentStep('success');
      toast.success('Coupon generated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend OTP');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setDevOtp(data.data.devOtp || '');
      toast.success('New OTP sent to your phone');
      setOtpTimer(300); // Reset timer
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleRequestOtp = () => {
    if (!phoneNumber.trim() || !invoiceNumber.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    requestOtpMutation.mutate();
  };

  const handleVerifyOtp = () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    verifyOtpMutation.mutate();
  };

  const handleCopyCoupon = () => {
    if (generatedCoupon?.code) {
      navigator.clipboard.writeText(generatedCoupon.code);
      toast.success('Coupon code copied to clipboard');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setPhoneNumber('');
    setInvoiceNumber('');
    setOtp('');
    setSessionId('');
    setGeneratedCoupon(null);
    setDevOtp('');
    setOtpTimer(300);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Gift className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Generate Coupon</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${currentStep === 'input' ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'input' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}>
                    1
                  </div>
                  <span className="font-medium">Enter Details</span>
                </div>
                
                <ArrowRight className="h-4 w-4 text-gray-400" />
                
                <div className={`flex items-center gap-2 ${currentStep === 'otp' ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'otp' ? 'bg-purple-600 text-white' : 
                    currentStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}>
                    2
                  </div>
                  <span className="font-medium">Verify OTP</span>
                </div>
                
                <ArrowRight className="h-4 w-4 text-gray-400" />
                
                <div className={`flex items-center gap-2 ${currentStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'success' ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}>
                    3
                  </div>
                  <span className="font-medium">Get Coupon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Input Form */}
          {currentStep === 'input' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enter Your Purchase Details
                </CardTitle>
                <CardDescription>
                  Provide your invoice number and phone number to generate a coupon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice Number *</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="invoice-number"
                      placeholder="e.g. INV-2024-001"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone-number"
                      placeholder="e.g. +1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 pr-10"
                      type="tel"
                      disabled={isLoadingInvoice}
                    />
                    {isLoadingInvoice && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 animate-spin" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {isLoadingInvoice ? 'Fetching phone number...' : 'We\'ll send a verification code to this number'}
                  </p>
                </div>

                <Button 
                  onClick={handleRequestOtp}
                  disabled={requestOtpMutation.isPending}
                  className="w-full"
                >
                  {requestOtpMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  Send Verification Code
                </Button>

                {/* Sample Invoices for Testing */}
                <Card className="bg-gray-50 border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Demo Invoice Numbers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {['GEN-2024-001', 'GEN-2024-002', 'GEN-2024-003'].map((inv) => (
                        <div
                          key={inv}
                          className="flex items-center justify-between p-2 bg-white rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => setInvoiceNumber(inv)}
                        >
                          <code className="font-mono">{inv}</code>
                          <Button variant="ghost" size="sm">Use</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 'otp' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify Your Phone Number
                </CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to {phoneNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {devOtp && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Development Mode</p>
                    <p className="text-lg font-mono mt-1">OTP: {devOtp}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="font-mono text-2xl text-center tracking-widest"
                    maxLength={6}
                  />
                  {otpTimer > 0 && (
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      Code expires in {formatTimer(otpTimer)}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleVerifyOtp}
                    disabled={verifyOtpMutation.isPending || otp.length !== 6}
                    className="flex-1"
                  >
                    {verifyOtpMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Verify & Generate Coupon
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => resendOtpMutation.mutate()}
                    disabled={resendOtpMutation.isPending || otpTimer > 240} // Can resend after 1 minute
                  >
                    {resendOtpMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Resend
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep('input')}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {currentStep === 'success' && generatedCoupon && (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Coupon Generated Successfully!
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {generatedCoupon.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Coupon Display */}
                <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-300 text-center">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p className="text-sm text-gray-600 mb-2">Your Coupon Code</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-3xl font-bold font-mono text-green-600">
                      {generatedCoupon.code}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCoupon}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-medium mt-4 text-gray-700">
                    {generatedCoupon.discountType === 'PERCENTAGE' 
                      ? `${generatedCoupon.discountValue}% OFF` 
                      : `$${generatedCoupon.discountValue} OFF`}
                  </p>
                </div>

                {/* Coupon Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-700">Coupon Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Valid Until</p>
                      <p className="font-medium">{formatDate(generatedCoupon.expiresAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Usage Limit</p>
                      <p className="font-medium">{generatedCoupon.usageLimit} time(s)</p>
                    </div>
                    {generatedCoupon.minimumOrderValue && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Minimum Order</p>
                        <p className="font-medium">${generatedCoupon.minimumOrderValue}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/validate-coupon">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Use Coupon Now
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleStartOver}>
                    Generate Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}