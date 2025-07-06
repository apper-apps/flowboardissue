import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  elevated = false, 
  hoverable = false,
  ...props 
}) => {
  const baseClasses = elevated ? 'card-elevated' : 'card'
  const hoverClasses = hoverable ? 'hover:shadow-elevated transition-shadow duration-200' : ''
  
return (
    <motion.div
      whileHover={hoverable ? { y: -4, scale: 1.02 } : {}}
      whileTap={hoverable ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card