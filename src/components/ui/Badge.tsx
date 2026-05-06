import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const VARIANTS = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  success: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
