import React from 'react';
import { cn } from '../../lib/utils';
import { Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  error: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthForm({
  isLogin,
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-gray-50/50 border border-gray-200",
              "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "placeholder:text-gray-400"
            )}
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-gray-50/50 border border-gray-200",
              "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "placeholder:text-gray-400"
            )}
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        className={cn(
          "w-full py-2 px-4 rounded-lg",
          "bg-blue-500 text-white font-medium",
          "hover:bg-blue-600 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        )}
      >
        {isLogin ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}