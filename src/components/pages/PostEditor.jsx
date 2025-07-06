import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PostEditorComponent from '@/components/organisms/PostEditor'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import postService from '@/services/api/postService'

const PostEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, currentWorkspace } = useOutletContext()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadPost()
    }
  }, [id])

  const loadPost = async () => {
    try {
      setLoading(true)
      setError('')
      const postData = await postService.getById(parseInt(id))
      setPost(postData)
    } catch (err) {
      setError('Failed to load post')
      console.error('Post load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (postData) => {
    try {
      let savedPost
      if (post?.Id) {
        // Update existing post
        savedPost = await postService.update(post.Id, {
          ...postData,
          updatedAt: new Date().toISOString()
        })
      } else {
        // Create new post
        savedPost = await postService.create({
          ...postData,
          authorId: currentUser?.Id || 1,
          workspaceId: currentWorkspace?.Id || 1,
          status: 'Draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      setPost(savedPost)
      if (!post?.Id) {
        navigate(`/posts/${savedPost.Id}/edit`)
      }
    } catch (err) {
      console.error('Save error:', err)
      throw err
    }
  }

  const handleStatusChange = async (postId, newStatus) => {
    try {
      const updatedPost = await postService.update(postId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      setPost(updatedPost)
    } catch (err) {
      console.error('Status change error:', err)
      throw err
    }
  }

  const handleCancel = () => {
    navigate('/posts')
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Editor Error" message={error} onRetry={loadPost} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PostEditorComponent
        post={post}
        onSave={handleSave}
        onCancel={handleCancel}
        onStatusChange={handleStatusChange}
        currentUser={currentUser}
        currentWorkspace={currentWorkspace}
      />
    </motion.div>
  )
}

export default PostEditor