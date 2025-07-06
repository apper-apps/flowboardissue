import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  placeholder,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`input ${error ? 'border-error focus:ring-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input