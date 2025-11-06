import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(({ label, leftIcon, error, ...rest }, ref) => {
  return (
    <div className="relative w-full">
      {label && (
        <label className="absolute left-3 top-1.5 text-gray-500 text-xs pointer-events-none transition-all duration-200 peer-focus:top-0 peer-focus:text-indigo-600 peer-focus:text-xs">
          {label}
        </label>
      )}
      {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</span>}
      <input
        ref={ref}
        className={`peer border-[1.5px] ${error ? 'border-red-500' : 'border-gray-300'} shadow-lg 
        focus:border-indigo-600 focus:outline-none focus:ring-2 
        ${error ? 'focus:ring-red-200' : 'focus:ring-indigo-200'} 
        rounded-lg px-3 py-3 text-md w-full bg-transparent transition-all duration-200 ${leftIcon ? 'pl-10' : ''}`}
        aria-invalid={error ? "true" : "false"}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert">{error}</p>
      )}
    </div>
  );
});

export default Input;
