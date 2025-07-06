import { forwardRef } from 'react'

const Textarea = forwardRef(({ 
  label, 
  error, 
  className = '', 
  rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={`textarea ${error ? 'border-error focus:ring-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea