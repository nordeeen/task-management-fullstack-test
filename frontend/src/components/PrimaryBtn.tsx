import React from 'react';

type PrimaryButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  type = 'button',
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold 
      py-3.5 rounded-xl text-sm transition-all mt-2 shadow-lg shadow-indigo-900/40 cursor-pointer">
      {children}
    </button>
  );
};
