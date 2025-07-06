import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const MediaItem = ({ 
  media, 
  onSelect, 
  onDelete, 
  selected = false,
  selectable = false 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleSelect = () => {
    if (selectable) {
      onSelect(media)
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this media file?')) {
      onDelete(media.Id)
    }
  }

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image'
    if (type?.startsWith('video/')) return 'Video'
    if (type?.startsWith('audio/')) return 'Music'
    return 'File'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        {media.type?.startsWith('image/') ? (
          <img 
            src={media.url} 
            alt={media.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name={getFileIcon(media.type)} size={48} className="text-gray-400" />
          </div>
        )}
        
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelect}
              className="text-white hover:text-white hover:bg-white/20"
              icon="Eye"
            >
              View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-white hover:text-white hover:bg-white/20"
              icon="Trash2"
            >
              Delete
            </Button>
          </motion.div>
        )}
      </div>
      
      <div className="p-3">
        <h4 className="font-medium text-sm truncate">{media.name}</h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {formatFileSize(media.size)}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(media.createdAt), 'MMM d')}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default MediaItem