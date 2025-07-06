import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Textarea from '@/components/atoms/Textarea'
import CommentItem from '@/components/molecules/CommentItem'
import { toast } from 'react-toastify'

const CommentSidebar = ({ 
  isOpen, 
  onClose, 
  comments = [], 
  onAddComment, 
  onReplyToComment,
  onResolveComment,
  onDeleteComment,
  users = [] 
}) => {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment('')
      toast.success('Comment added successfully')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const organizeComments = (comments) => {
    const commentMap = new Map()
    const rootComments = []

    // First pass: create comment map
    comments.forEach(comment => {
      commentMap.set(comment.Id, { ...comment, replies: [] })
    })

    // Second pass: organize into tree structure
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId)
        if (parent) {
          parent.replies.push(commentMap.get(comment.Id))
        }
      } else {
        rootComments.push(commentMap.get(comment.Id))
      }
    })

    return rootComments
  }

  const renderComment = (comment, depth = 0) => (
    <div key={comment.Id}>
      <CommentItem
        comment={comment}
        onReply={onReplyToComment}
        onResolve={onResolveComment}
        onDelete={onDeleteComment}
        depth={depth}
        users={users}
      />
      {comment.replies?.map(reply => renderComment(reply, depth + 1))}
    </div>
  )

  const organizedComments = organizeComments(comments)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 w-96 h-full bg-white border-l border-gray-200 z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comments</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon="X"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {organizedComments.length > 0 ? (
                  organizedComments.map(comment => renderComment(comment))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No comments yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewComment('')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={isSubmitting}
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CommentSidebar