import { motion } from 'framer-motion'

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className = '',
  fallback 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  }
  
  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${className}`}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium text-gray-600">
          {getInitials(fallback || alt)}
        </span>
      )}
    </motion.div>
  )
}

export default Avatar