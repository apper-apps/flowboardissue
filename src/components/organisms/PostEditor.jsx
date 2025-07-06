import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Card from '@/components/atoms/Card'
import { toast } from 'react-toastify'

const PostEditor = ({ 
  post, 
  onSave, 
  onCancel, 
  onStatusChange,
  currentUser,
  currentWorkspace 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    publishDate: '',
    tags: '',
    ...post
  })
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        publishDate: post.publishDate ? new Date(post.publishDate).toISOString().split('T')[0] : '',
        tags: post.tags?.join(', ') || '',
        ...post
      })
    }
  }, [post])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-save after 2 seconds of inactivity
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }
    
    setAutoSaveTimeout(setTimeout(() => {
      handleAutoSave()
    }, 2000))
  }

  const handleAutoSave = async () => {
    if (!formData.title.trim()) return
    
    try {
      await onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      toast.success('Post saved successfully')
    } catch (error) {
      toast.error('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusChange(post?.Id, newStatus)
      toast.success(`Post status changed to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to change post status')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {post?.Id ? 'Edit Post' : 'Create New Post'}
              </h2>
              <p className="text-gray-600">
                {currentWorkspace?.name} • {currentUser?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSaving}
              >
                Save Post
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title..."
              required
            />

            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your post content..."
              rows={12}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Publish Date"
                type="date"
                value={formData.publishDate}
                onChange={(e) => handleInputChange('publishDate', e.target.value)}
              />

              <Input
                label="Tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </form>
      </Card>

      {post?.Id && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Post Actions</h3>
          <div className="flex items-center gap-3">
            {post.status === 'Draft' && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange('In Review')}
                icon="Send"
              >
                Submit for Review
              </Button>
            )}
            {post.status === 'In Review' && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleStatusChange('Approved')}
                  icon="Check"
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('Draft')}
                  icon="ArrowLeft"
                >
                  Back to Draft
                </Button>
              </>
            )}
            {post.status === 'Approved' && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange('Published')}
                icon="Globe"
              >
                Publish
              </Button>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  )
}

export default PostEditor