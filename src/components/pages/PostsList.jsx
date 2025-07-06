import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PostCard from '@/components/molecules/PostCard'
import PostFilters from '@/components/molecules/PostFilters'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import postService from '@/services/api/postService'
import userService from '@/services/api/userService'

const PostsList = () => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const [postsData, usersData] = await Promise.all([
        postService.getAll(),
        userService.getAll()
      ])
      setPosts(postsData)
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load posts')
      console.error('Posts load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (postId) => {
    try {
      await postService.update(postId, { status: 'Approved' })
      setPosts(posts.map(post => 
        post.Id === postId ? { ...post, status: 'Approved' } : post
      ))
      toast.success('Post approved successfully')
    } catch (err) {
      toast.error('Failed to approve post')
      console.error('Approve error:', err)
    }
  }

  const handleEdit = (postId) => {
    navigate(`/posts/${postId}/edit`)
  }

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.delete(postId)
        setPosts(posts.filter(post => post.Id !== postId))
        toast.success('Post deleted successfully')
      } catch (err) {
        toast.error('Failed to delete post')
        console.error('Delete error:', err)
      }
    }
  }

  const handleShare = (postId) => {
    const shareUrl = `${window.location.origin}/posts/${postId}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard')
  }

  const getFilteredPosts = () => {
    let filtered = posts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(post => 
        post.status.toLowerCase() === filters.status.toLowerCase()
      )
    }

    // Apply sorting
    const sort = filters.sort || 'created_desc'
    filtered.sort((a, b) => {
      switch (sort) {
        case 'created_asc':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'title_desc':
          return b.title.localeCompare(a.title)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }

  if (loading) {
    return <Loading type="posts" />
  }

  if (error) {
    return <Error title="Posts Error" message={error} onRetry={loadPosts} />
  }

  const filteredPosts = getFilteredPosts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">
            Manage your content and track approval progress
          </p>
        </div>
        <Button
          as={Link}
          to="/posts/new"
          variant="primary"
          icon="Plus"
        >
          Create Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search posts..."
          />
        </div>
        <PostFilters
          onFilterChange={setFilters}
          activeFilters={filters}
        />
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Empty
          title="No posts found"
          message={searchTerm || Object.keys(filters).length > 0 
            ? "No posts match your search criteria." 
            : "Create your first post to get started."
          }
          actionLabel="Create Post"
          onAction={() => navigate('/posts/new')}
          icon="FileText"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard
                post={post}
                onApprove={handleApprove}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
                users={users}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default PostsList