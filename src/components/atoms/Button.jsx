import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-primary focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-sm focus:ring-secondary',
    outline: 'border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 focus:ring-primary',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary',
    success: 'bg-success hover:bg-success/90 text-white shadow-sm focus:ring-success',
    warning: 'bg-warning hover:bg-warning/90 text-white shadow-sm focus:ring-warning',
    error: 'bg-error hover:bg-error/90 text-white shadow-sm focus:ring-error',
  }
  
const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const content = (
    <>
      {loading && <ApperIcon name="Loader2" className="animate-spin" size={16} />}
      {!loading && icon && iconPosition === 'left' && <ApperIcon name={icon} size={16} />}
      {children}
      {!loading && icon && iconPosition === 'right' && <ApperIcon name={icon} size={16} />}
    </>
  )
  
return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export default Button