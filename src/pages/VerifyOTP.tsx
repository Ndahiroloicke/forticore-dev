import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const VerifyOTP = () => {
  const { user, loading, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If no email is provided, redirect to signup
  useEffect(() => {
    if (!email && !loading) {
      navigate('/signup', { replace: true });
    }
  }, [email, loading, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // If user is already authenticated, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error } = await verifyOTP(email, otpCode);
    
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    setError(null);
    
    const { error } = await resendOTP(email);
    
    setResending(false);
    
    if (error) {
      setError(error);
    } else {
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout title="Verify your email">
      <div className="space-y-6">
        {/* Success State */}
        {success && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                Email verified successfully!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        {!success && (
          <>
            {/* Email icon and description */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to
                </p>
                <p className="text-sm font-semibold mt-1">{email}</p>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> If you receive a verification link instead of a code, 
                    click the link to verify your email. This happens if OTP emails aren't configured yet.
                    <br />
                    <a 
                      href="/SUPABASE_OTP_SETUP.md" 
                      target="_blank"
                      className="text-purple-600 dark:text-purple-400 hover:underline mt-1 inline-block"
                    >
                      Learn how to enable OTP emails →
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* OTP Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl font-semibold sm:w-14 sm:h-16 sm:text-2xl"
                    disabled={submitting}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <Button 
                type="submit" 
                disabled={submitting || otp.some(d => !d)} 
                className="w-full"
                size="lg"
              >
                {submitting ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                {resending
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend code in ${countdown}s`
                  : 'Resend code'}
              </Button>
            </div>

            {/* Back to signup */}
            <div className="pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate('/signup')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign up
              </Button>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;

