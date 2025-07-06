import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import StatusBadge from '@/components/atoms/StatusBadge'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const PostCard = ({ 
  post, 
  onApprove, 
  onEdit, 
  onDelete, 
  onShare,
  users = [] 
}) => {
  const author = users.find(u => u.Id === post.authorId)

  const handleApprove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onApprove(post.Id)
  }

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit(post.Id)
  }

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(post.Id)
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onShare(post.Id)
  }

return (
    <Card hoverable className="p-6 h-full">
      <Link to={`/posts/${post.Id}`}>
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
              </p>
            </div>
            <div className="flex-shrink-0">
              <StatusBadge status={post.status} />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex items-center gap-3">
              <Avatar 
                src={author?.avatar} 
                alt={author?.name}
                size="sm"
                fallback={author?.name}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{author?.name}</div>
                <div className="text-xs text-gray-500">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

<div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              {post.status === 'In Review' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleApprove}
                  icon="Check"
                  className="flex-1"
                >
                  Approve
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                icon="Edit"
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                icon="Share"
                className="flex-1"
              >
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                icon="Trash2"
                className="text-error hover:text-error flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default PostCard