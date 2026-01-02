import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, signupSchema, getAuthErrorMessage } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Mail, Lock, Eye, EyeOff, Wallet, ArrowRight, Loader2, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'signup';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = (): boolean => {
    const schema = mode === 'login' ? loginSchema : signupSchema;
    const data = mode === 'login' 
      ? { email, password }
      : { firstName, lastName, phone, email, password };
    
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          const message = getAuthErrorMessage(error.code);
          toast({
            title: 'Sign in failed',
            description: message,
            variant: 'destructive',
          });
        }
      } else {
        const { error } = await signUp({
          email,
          password,
          firstName,
          lastName,
          phone,
        });
        
        if (error) {
          const message = getAuthErrorMessage(error.code);
          toast({
            title: 'Sign up failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'You can now start tracking your expenses.',
          });
          navigate('/', { replace: true });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Expense Tracker
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {/* Signup-only fields */}
          {mode === 'signup' && (
            <>
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className={cn(
                        'input-touch pl-10 rounded-xl border-2',
                        'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                        errors.firstName && 'border-destructive'
                      )}
                      autoComplete="given-name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className={cn(
                        'input-touch pl-10 rounded-xl border-2',
                        'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                        errors.lastName && 'border-destructive'
                      )}
                      autoComplete="family-name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={cn(
                      'input-touch pl-12 rounded-xl border-2',
                      'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      errors.phone && 'border-destructive'
                    )}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={cn(
                  'input-touch pl-12 rounded-xl border-2',
                  'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  errors.email && 'border-destructive'
                )}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  'input-touch pl-12 pr-12 rounded-xl border-2',
                  'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  errors.password && 'border-destructive'
                )}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-xl font-semibold text-base bg-primary hover:bg-primary/90 shadow-lg mt-6"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-semibold text-primary hover:underline mt-1"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          Track expenses • Manage budgets • Stay organized
        </p>
      </div>
    </div>
  );
};

export default Auth;
