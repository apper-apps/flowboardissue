import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import Textarea from '@/components/atoms/Textarea'
import { toast } from 'react-toastify'

const CommentItem = ({ 
  comment, 
  onReply, 
  onResolve, 
  onDelete, 
  depth = 0,
  users = [] 
}) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')

  const user = users.find(u => u.Id === comment.userId)
  const maxDepth = 3

  const handleReply = async () => {
    if (replyText.trim()) {
      try {
        await onReply(comment.Id, replyText)
        setReplyText('')
        setIsReplying(false)
        toast.success('Reply added successfully')
      } catch (error) {
        toast.error('Failed to add reply')
      }
    }
  }

  const handleResolve = async () => {
    try {
      await onResolve(comment.Id)
      toast.success('Comment resolved')
    } catch (error) {
      toast.error('Failed to resolve comment')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await onDelete(comment.Id)
        toast.success('Comment deleted')
      } catch (error) {
        toast.error('Failed to delete comment')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}
    >
      <div className={`p-4 rounded-lg ${comment.resolved ? 'bg-green-50' : 'bg-gray-50'}`}>
        <div className="flex items-start gap-3">
          <Avatar 
            src={user?.avatar} 
            alt={user?.name}
            size="sm"
            fallback={user?.name}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{user?.name || 'Unknown User'}</span>
              <span className="text-xs text-gray-500">
                {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
              </span>
              {comment.resolved && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Resolved
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
            <div className="flex items-center gap-2">
              {depth < maxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  icon="Reply"
                >
                  Reply
                </Button>
              )}
              {!comment.resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResolve}
                  icon="Check"
                >
                  Resolve
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                icon="Trash2"
                className="text-error hover:text-error"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 ml-11"
          >
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                Reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default CommentItem