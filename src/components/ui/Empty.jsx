import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const Empty = ({ 
  title = 'No content found',
  message = 'Get started by creating your first item.',
  actionLabel = 'Create New',
  onAction,
  icon = 'Plus'
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
          className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            icon="Plus"
          >
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export default Empty