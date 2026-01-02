import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(72, 'Password must be less than 72 characters');

export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .max(100, 'Must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens and apostrophes allowed');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be less than 15 digits')  npm install @capacitor/core @capacitor/cli
  npx cap init
  .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

export const getAuthErrorMessage = (errorCode: string | undefined): string => {
  switch (errorCode) {
    case 'invalid_credentials':
      return 'Invalid email or password. Please check your credentials.';
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists. Please sign in instead.';
    case 'weak_password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'invalid_email':
      return 'Please enter a valid email address.';
    case 'signup_disabled':
      return 'Sign ups are currently disabled.';
    case 'email_not_confirmed':
      return 'Please confirm your email address before signing in.';
    case 'user_not_found':
      return 'No account found with this email. Please sign up first.';
    default:
      return 'An error occurred. Please try again.';
  }
};
