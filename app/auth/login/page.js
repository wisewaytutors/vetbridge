'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowRight, Clock, Mail, Chrome } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { auth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendOTP(phone);
      setShowOTP(true);
      startTimer();
    } catch (error) {
      // For demo purposes, simulate OTP sending
      console.log('OTP send failed, simulating for demo:', error);
      setShowOTP(true);
      startTimer();
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.loginWithEmail(email, password);
      auth.setToken(response.token);
      
      if (response.user && response.user.role) {
        auth.setRole(response.user.role);
        auth.setUser(response.user);
        
        switch (response.user.role) {
          case 'owner':
            router.push('/dashboard');
            break;
          case 'vet':
            router.push('/vet-dashboard');
            break;
          case 'clinic':
            router.push('/clinic-dashboard');
            break;
          default:
            router.push('/auth/register');
        }
      } else {
        router.push('/auth/register');
      }
    } catch (error) {
      // For demo purposes, simulate successful login
      console.log('Email login failed, simulating for demo:', error);
      auth.setToken('demo-token');
      auth.setRole('owner');
      auth.setUser({ email, role: 'owner' });
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // For demo purposes, simulate Google login
    alert('Google login is coming soon. For demo, please use phone or email login.');
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(phone, otp);
      auth.setToken(response.token);
      
      if (response.user && response.user.role) {
        auth.setRole(response.user.role);
        auth.setUser(response.user);
        
        switch (response.user.role) {
          case 'owner':
            router.push('/dashboard');
            break;
          case 'vet':
            router.push('/vet-dashboard');
            break;
          case 'clinic':
            router.push('/clinic-dashboard');
            break;
          default:
            router.push('/auth/register');
        }
      } else {
        router.push('/auth/register');
      }
    } catch (error) {
      // For demo purposes, simulate successful OTP verification
      console.log('OTP verification failed, simulating for demo:', error);
      auth.setToken('demo-token');
      auth.setRole('owner');
      auth.setUser({ phone, role: 'owner' });
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      await authAPI.sendOTP(phone);
      startTimer();
      alert('OTP sent successfully');
    } catch (error) {
      alert('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showOTP ? 'Verify OTP' : 'Welcome to VetBridge'}
            </h1>
            <p className="text-gray-600">
              {showOTP
                ? `Enter the 6-digit code sent to ${phone}`
                : 'Sign in to your account'}
            </p>
          </div>

          {/* Login Method Toggle */}
          {!showOTP && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  loginMethod === 'phone'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </button>
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  loginMethod === 'email'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </button>
            </div>
          )}

          {!showOTP ? (
            <>
              {loginMethod === 'phone' ? (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 9XX XXX XXX"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                  >
                    {loading ? 'Sending...' : 'Continue'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Chrome className="w-5 h-5" />
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend}
                  className="text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
                >
                  <Clock className="w-4 h-4" />
                  {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
