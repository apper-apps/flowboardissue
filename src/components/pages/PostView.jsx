import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/atoms/StatusBadge'
import Avatar from '@/components/atoms/Avatar'
import Card from '@/components/atoms/Card'
import CommentSidebar from '@/components/organisms/CommentSidebar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import postService from '@/services/api/postService'
import commentService from '@/services/api/commentService'
import userService from '@/services/api/userService'

const PostView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentSidebarOpen, setCommentSidebarOpen] = useState(false)

  useEffect(() => {
    loadPostData()
  }, [id])

  const loadPostData = async () => {
    try {
      setLoading(true)
      setError('')
      const [postData, commentsData, usersData] = await Promise.all([
        postService.getById(parseInt(id)),
        commentService.getByPostId(parseInt(id)),
        userService.getAll()
      ])
      setPost(postData)
      setComments(commentsData)
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load post')
      console.error('Post view load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedPost = await postService.update(post.Id, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      setPost(updatedPost)
      toast.success(`Post ${newStatus.toLowerCase()} successfully`)
    } catch (err) {
      toast.error('Failed to update post status')
      console.error('Status change error:', err)
    }
  }

  const handleAddComment = async (content) => {
    try {
      const newComment = await commentService.create({
        postId: post.Id,
        userId: users[0]?.Id || 1, // Using first user as current user
        content: content.trim(),
        createdAt: new Date().toISOString(),
        resolved: false
      })
      setComments([...comments, newComment])
    } catch (err) {
      console.error('Add comment error:', err)
      throw err
    }
  }

  const handleReplyToComment = async (parentId, content) => {
    try {
      const newComment = await commentService.create({
        postId: post.Id,
        userId: users[0]?.Id || 1,
        content: content.trim(),
        parentId: parentId,
        createdAt: new Date().toISOString(),
        resolved: false
      })
      setComments([...comments, newComment])
    } catch (err) {
      console.error('Reply comment error:', err)
      throw err
    }
  }

  const handleResolveComment = async (commentId) => {
    try {
      const updatedComment = await commentService.update(commentId, {
        resolved: true
      })
      setComments(comments.map(comment => 
        comment.Id === commentId ? updatedComment : comment
      ))
    } catch (err) {
      console.error('Resolve comment error:', err)
      throw err
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.delete(commentId)
      setComments(comments.filter(comment => comment.Id !== commentId))
    } catch (err) {
      console.error('Delete comment error:', err)
      throw err
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/posts/${post.Id}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard')
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Post Error" message={error} onRetry={loadPostData} />
  }

  if (!post) {
    return <Error title="Post Not Found" message="The post you're looking for doesn't exist." />
  }

  const author = users.find(u => u.Id === post.authorId)
  const postComments = comments.filter(c => !c.resolved)
  const resolvedComments = comments.filter(c => c.resolved)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/posts')}
          icon="ArrowLeft"
        >
          Back to Posts
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleShare}
            icon="Share"
          >
            Share
          </Button>
          <Button
            variant="outline"
            onClick={() => setCommentSidebarOpen(true)}
            icon="MessageCircle"
          >
            Comments ({comments.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/posts/${post.Id}/edit`)}
            icon="Edit"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Avatar
                  src={author?.avatar}
                  alt={author?.name}
                  size="sm"
                  fallback={author?.name}
                />
                <span>{author?.name}</span>
              </div>
              <span>•</span>
              <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
              <span>•</span>
              <span>Updated {format(new Date(post.updatedAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <StatusBadge status={post.status} />
        </div>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Tags:</span>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Status Actions */}
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

      {/* Comments Summary */}
      {comments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Comments Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{postComments.length}</div>
              <div className="text-sm text-gray-600">Active Comments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{resolvedComments.length}</div>
              <div className="text-sm text-gray-600">Resolved Comments</div>
            </div>
          </div>
        </Card>
      )}

      {/* Comment Sidebar */}
      <CommentSidebar
        isOpen={commentSidebarOpen}
        onClose={() => setCommentSidebarOpen(false)}
        comments={comments}
        onAddComment={handleAddComment}
        onReplyToComment={handleReplyToComment}
        onResolveComment={handleResolveComment}
        onDeleteComment={handleDeleteComment}
        users={users}
      />
    </motion.div>
  )
}

export default PostView