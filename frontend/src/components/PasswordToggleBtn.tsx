import React from 'react';
import { Eye, EyeClosed } from 'lucide-react';

type PasswordToggleButtonProps = {
  showPassword: boolean;
  onToggle: () => void;
};

export const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({
  showPassword,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
      aria-label={showPassword ? 'Hide password' : 'Show password'}>
      {showPassword ? <Eye /> : <EyeClosed />}
    </button>
  );
};
