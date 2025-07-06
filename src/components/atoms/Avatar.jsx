import { useState } from 'react'
import { motion } from 'framer-motion'

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className = '',
  fallback 
}) => {
  const [imageLoading, setImageLoading] = useState(!!src)
  const [imageError, setImageError] = useState(false)
  
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
{src && !imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
        </>
      ) : (
        <span className="font-medium text-gray-600">
          {getInitials(fallback || alt)}
        </span>
      )}
    </motion.div>
  )
}

export default Avatar