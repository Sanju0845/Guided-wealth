import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, Lock, Sparkles, ChevronDown, Clock3 } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import axios from 'axios';

export default function LoginModal() {
  const { isLoginOpen, closeLoginModal, loginWithData } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp' | 'success' | 'pending'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isLoginOpen) {
      setStep('phone');
      setPhoneNumber('');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setIsLoading(false);
    }
  }, [isLoginOpen]);

  // Resend OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginOpen, closeLoginModal]);

  // Setup reCAPTCHA
  useEffect(() => {
    if (isLoginOpen && isFirebaseConfigured && auth && !(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (err) {
        console.error("Error setting up recaptcha", err);
      }
    }

    return () => {
      if (!isLoginOpen && (window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
        } catch (e) {}
      }
    };
  }, [isLoginOpen]);

  if (!isLoginOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!isFirebaseConfigured || !auth) {
      setError('Phone login is not available in this preview.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhone = `${countryCode}${cleanPhone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setError(err.message || 'Failed to send OTP. Try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    // Handle single digit input or pasted string
    if (value.length > 1) {
      const pastedDigits = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedDigits[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value !== '' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      if (!confirmationResult) throw new Error("Please request OTP first");
      
      const result = await confirmationResult.confirm(fullOtp);
      const firebaseToken = await result.user.getIdToken();
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      // Call backend to authenticate
      const response = await axios.post(`${apiUrl}/auth/login`, {
        firebaseToken,
        name: 'User' // We can let user set name later
      });
      
      const userData = response.data;
      setIsLoading(false);
      
      if (userData.isPending && userData.role !== 'user') {
        setStep('pending');
      } else {
        setStep('success');
        setTimeout(() => {
          loginWithData(userData);
          closeLoginModal();
        }, 1400);
      }
    } catch (err: any) {
      setIsLoading(false);
      const backendError = err.response?.data?.message;
      setError(backendError || err.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with rich blur */}
      <div 
        className="fixed inset-0 bg-ink/70 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={closeLoginModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-primary/10 overflow-hidden transform transition-all duration-300 z-10 animate-scaleUp">
        
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-accent-light w-full" />

        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 p-2 text-primary/60 hover:text-primary hover:bg-cream rounded-full transition-colors z-20"
          aria-label="Close login modal"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cream border border-accent/30 text-accent mb-3 shadow-inner">
              {step === 'phone' && <Smartphone size={28} className="text-accent" />}
              {step === 'otp' && <Lock size={28} className="text-accent" />}
              {step === 'success' && <CheckCircle2 size={32} className="text-emerald-600 animate-bounce" />}
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-ink tracking-tight">
              {step === 'phone' && 'Welcome to Guided Wealthy'}
              {step === 'otp' && 'Verify Phone Number'}
              {step === 'success' && 'Login Successful!'}
              {step === 'pending' && 'Approval Pending'}
            </h3>
            
            <p className="text-xs text-primary/70 mt-1 max-w-xs mx-auto">
              {step === 'phone' && 'Enter your mobile number to get access to custom wealth tools & insights'}
              {step === 'otp' && (
                <span>
                  Enter the 6-digit OTP sent to <strong className="text-ink">{countryCode} {phoneNumber}</strong>
                </span>
              )}
              {step === 'success' && 'Authentication complete. Redirecting you...'}
              {step === 'pending' && 'Your account is pending admin approval.'}
            </p>
          </div>

          {/* STEP 1: Phone Number Entry */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-2xl border-2 border-primary/15 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all overflow-hidden bg-cream/40">
                  {/* Country Code Prefix */}
                  <div className="flex items-center gap-1 px-3 bg-cream border-r border-primary/10 text-xs font-semibold text-primary">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>{countryCode}</span>
                    <ChevronDown size={12} className="text-primary/50" />
                  </div>
                  
                  {/* Number Input */}
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''));
                      if (error) setError('');
                    }}
                    placeholder="Enter 10-digit number"
                    className="w-full px-4 py-3.5 bg-transparent text-sm font-bold text-ink placeholder:font-normal placeholder:text-primary/40 focus:outline-none"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full bg-primary text-cream hover:bg-ink disabled:opacity-50 disabled:cursor-not-allowed py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <>
                    <span>Get OTP</span>
                    <ArrowRight size={16} className="text-accent" />
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="pt-2 flex items-center justify-center gap-2 text-primary/60 text-[11px]">
                <ShieldCheck size={14} className="text-accent" />
                <span>100% Secure & Confidential | No Password Required</span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              {/* Back & Change number */}
              <div className="flex justify-between items-center text-xs pb-1">
                <span className="text-primary/60 font-medium">Verification Code</span>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-between gap-2 sm:gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold text-ink bg-cream rounded-xl border-2 border-primary/15 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none transition-all shadow-sm"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

              {/* Resend Timer */}
              <div className="flex items-center justify-between text-xs text-primary/70 pt-1">
                <span>Didn't receive code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="flex items-center gap-1 text-accent font-bold hover:underline cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    Resend OTP
                  </button>
                ) : (
                  <span className="font-mono text-primary/50">
                    Resend in <strong className="text-accent">{resendTimer}s</strong>
                  </span>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otp.join('').length < 6}
                className="w-full bg-primary text-cream hover:bg-ink disabled:opacity-50 disabled:cursor-not-allowed py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    <span>Verifying OTP...</span>
                  </div>
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <Sparkles size={16} className="text-accent" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-50 text-emerald-600 mb-1">
                <CheckCircle2 size={48} />
              </div>
              <p className="text-sm font-semibold text-ink">
                Welcome back! You are now securely logged in.
              </p>
              <div className="w-full bg-cream rounded-full h-1.5 overflow-hidden">
                <div className="bg-accent h-full w-full animate-pulse" />
              </div>
            </div>
          )}

          {/* STEP 4: Pending Screen */}
          {step === 'pending' && (
            <div className="py-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-50 text-amber-600 mb-1">
                <Clock3 size={48} />
              </div>
              <p className="text-sm font-semibold text-ink">
                Your account is currently under review by our team.
              </p>
              <p className="text-xs text-primary/70">
                You will receive a notification once your account has been approved and activated.
              </p>
            </div>
          )}

          {/* Always mount recaptcha-container */}
          <div id="recaptcha-container"></div>
        </div>

        {/* Footer info bar */}
        <div className="bg-cream/80 px-6 py-3 border-t border-primary/5 text-center text-[11px] text-primary/60">
          By logging in, you agree to our{' '}
          <a href="/legal" className="text-primary font-semibold hover:underline">Terms</a> &{' '}
          <a href="/privacy-policy" className="text-primary font-semibold hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
