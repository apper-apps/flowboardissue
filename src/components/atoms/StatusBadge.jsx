import { motion } from 'framer-motion'

const StatusBadge = ({ status, className = '' }) => {
  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'status-badge status-draft'
      case 'in review':
      case 'review':
        return 'status-badge status-review'
      case 'approved':
        return 'status-badge status-approved'
      case 'published':
        return 'status-badge status-published'
      default:
        return 'status-badge status-draft'
    }
  }
  
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'Draft'
      case 'in review':
      case 'review':
        return 'In Review'
      case 'approved':
        return 'Approved'
      case 'published':
        return 'Published'
      default:
        return 'Draft'
    }
  }
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${getStatusClasses(status)} ${className}`}
    >
      {getStatusText(status)}
    </motion.span>
  )
}

export default StatusBadge