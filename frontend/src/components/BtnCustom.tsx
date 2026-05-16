import React from 'react';
import clsx from 'clsx';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'outline'
  | 'dashed';

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = {
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  active?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  active = false,
  fullWidth = false,
  disabled = false,
  className,
  onClick,
  title,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 font-medium',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98]',
        fullWidth && 'w-full',
        // Sizes
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2.5 text-sm': size === 'md',
          'px-5 py-3 text-base': size === 'lg',
          'w-9 h-9 p-0': size === 'icon',
        },
        {
          // PRIMARY
          'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30':
            variant === 'primary',
          // SECONDARY
          'bg-[#1a1a2e] border border-white/[0.07] text-gray-300 hover:border-white/15':
            variant === 'secondary',
          // GHOST
          'text-gray-500 hover:text-gray-300 hover:bg-white/4':
            variant === 'ghost',
          // DANGER
          'bg-red-500/80 hover:bg-red-500 text-white': variant === 'danger',
          // OUTLINE
          'border border-white/8 hover:border-indigo-500/40 text-gray-300':
            variant === 'outline',
          // DASHED
          'border-2 border-dashed border-white/[0.07] hover:border-indigo-500/40 bg-[#13131f] hover:bg-indigo-500/5 text-gray-500 hover:text-indigo-400':
            variant === 'dashed',
        },
        // Active state
        active && 'bg-indigo-600 text-white',
        className,
      )}>
      {icon && icon}
      {children}
    </button>
  );
};
