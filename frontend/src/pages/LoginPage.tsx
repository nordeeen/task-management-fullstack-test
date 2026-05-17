import { useState } from 'react';
import { PackageCheck } from 'lucide-react';
import { PasswordToggleButton } from '../components/PasswordToggleBtn';
import { PrimaryButton } from '../components/PrimaryBtn';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { mutate, isPending } = useLogin();

  const isFormValid = form.email.trim() !== '' && form.password.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    mutate(
      { email: form.email, password: form.password },
      {
        onError: (err: any) => {
          setError(err?.response?.data?.message || 'Login failed. Try again.');
        },
      },
    );
  };

  return (
    <section className="min-h-screen bg-[#0f0f1a] flex font-sans">
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] min-h-screen p-12 relative overflow-hidden shrink-0"
        style={{
          background:
            'linear-gradient(145deg, #4338ca 0%, #5b50e8 45%, #7c6ff0 100%)',
        }}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full bg-indigo-900/40 pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
            <PackageCheck className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Task Management System
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-screen flex items-center justify-center px-6 py-12 lg:px-16 bg-[#0f0f1a]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <PackageCheck className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              Task Management System
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="james@company.com"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (error) setError('');
                }}
                className="w-full bg-[#1a1a2e] text-white placeholder-gray-600 rounded-xl px-4 py-3.5 text-sm border
                 border-white/8 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-gray-300 text-sm font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (error) setError('');
                  }}
                  className={`w-full bg-[#1a1a2e] text-white placeholder-gray-600 rounded-xl px-4 py-3.5 pr-12 
                    text-sm border transition-all focus:outline-none focus:ring-1 ${
                      error
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/8 focus:border-indigo-500 focus:ring-indigo-500/40'
                    }`}
                  required
                />
                <PasswordToggleButton
                  showPassword={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
              </div>
              {error && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                  {error}
                </p>
              )}
            </div>
            <PrimaryButton type="submit" disabled={!isFormValid || isPending}>
              {isPending ? 'Loading...' : 'Sign in'}
            </PrimaryButton>
          </form>
          <p className="text-center text-gray-500 text-sm mt-8 cursor-pointer">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
