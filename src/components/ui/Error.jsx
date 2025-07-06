import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Error = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
  actionLabel = 'Try Again'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-8"
    >
      <Card className="p-8 text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
          >
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Error