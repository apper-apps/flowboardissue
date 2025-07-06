import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatusBadge from '@/components/atoms/StatusBadge'
import Avatar from '@/components/atoms/Avatar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import postService from '@/services/api/postService'
import userService from '@/services/api/userService'

const Dashboard = () => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
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
      setError('Failed to load dashboard data')
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCounts = () => {
    return {
      draft: posts.filter(p => p.status === 'Draft').length,
      inReview: posts.filter(p => p.status === 'In Review').length,
      approved: posts.filter(p => p.status === 'Approved').length,
      published: posts.filter(p => p.status === 'Published').length,
    }
  }

  const getRecentPosts = () => {
    return posts
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'text-gray-600'
      case 'In Review': return 'text-yellow-600'
      case 'Approved': return 'text-green-600'
      case 'Published': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft': return 'FileText'
      case 'In Review': return 'Clock'
      case 'Approved': return 'CheckCircle'
      case 'Published': return 'Globe'
      default: return 'FileText'
    }
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error title="Dashboard Error" message={error} onRetry={loadDashboardData} />
  }

  const statusCounts = getStatusCounts()
  const recentPosts = getRecentPosts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your content.</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { key: 'draft', label: 'Draft Posts', count: statusCounts.draft, status: 'Draft' },
          { key: 'inReview', label: 'In Review', count: statusCounts.inReview, status: 'In Review' },
          { key: 'approved', label: 'Approved', count: statusCounts.approved, status: 'Approved' },
          { key: 'published', label: 'Published', count: statusCounts.published, status: 'Published' },
        ].map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-lg ${getStatusColor(stat.status)} bg-gray-50`}>
                  <ApperIcon name={getStatusIcon(stat.status)} size={24} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
            <Button
              as={Link}
              to="/posts"
              variant="ghost"
              size="sm"
              icon="ArrowRight"
            >
              View All
            </Button>
          </div>
          
          {recentPosts.length === 0 ? (
            <Empty
              title="No posts yet"
              message="Create your first post to get started."
              actionLabel="Create Post"
              onAction={() => window.location.href = '/posts/new'}
              icon="FileText"
            />
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => {
                const author = users.find(u => u.Id === post.authorId)
                return (
                  <motion.div
                    key={post.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar
                      src={author?.avatar}
                      alt={author?.name}
                      size="sm"
                      fallback={author?.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{post.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <StatusBadge status={post.status} />
                  </motion.div>
                )
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-3">
            <Button
              as={Link}
              to="/posts/new"
              variant="outline"
              className="w-full justify-start"
              icon="Plus"
            >
              Create New Post
            </Button>
            <Button
              as={Link}
              to="/posts?status=in-review"
              variant="outline"
              className="w-full justify-start"
              icon="Clock"
            >
              Review Pending Posts
            </Button>
            <Button
              as={Link}
              to="/calendar"
              variant="outline"
              className="w-full justify-start"
              icon="Calendar"
            >
              View Content Calendar
            </Button>
            <Button
              as={Link}
              to="/media"
              variant="outline"
              className="w-full justify-start"
              icon="Image"
            >
              Manage Media Library
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard