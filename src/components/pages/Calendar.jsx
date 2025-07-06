import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import StatusBadge from '@/components/atoms/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import postService from '@/services/api/postService'

const Calendar = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const postsData = await postService.getAll()
      setPosts(postsData)
    } catch (err) {
      setError('Failed to load calendar data')
      console.error('Calendar load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  const getPostsForDate = (date) => {
    return posts.filter(post => {
      const publishDate = post.publishDate ? new Date(post.publishDate) : null
      const createdDate = new Date(post.createdAt)
      return publishDate ? isSameDay(date, publishDate) : isSameDay(date, createdDate)
    })
  }

  const getSelectedDatePosts = () => {
    return getPostsForDate(selectedDate)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Calendar Error" message={error} onRetry={loadPosts} />
  }

  const days = getDaysInMonth()
  const selectedDatePosts = getSelectedDatePosts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600">
            Schedule and track your content publishing dates
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/posts/new'}
          icon="Plus"
        >
          Schedule Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(-1)}
                  icon="ChevronLeft"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth(1)}
                  icon="ChevronRight"
                />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayPosts = getPostsForDate(day)
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentDay = isToday(day)

                return (
                  <motion.button
                    key={day.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 min-h-[80px] border rounded-lg transition-all hover:shadow-md ${
                      isSelected
                        ? 'bg-primary text-white border-primary'
                        : isCurrentDay
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 2).map((post, idx) => (
                        <div
                          key={post.Id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-800'
                          }`}
                          title={post.title}
                        >
                          {post.title}
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          +{dayPosts.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            
            {selectedDatePosts.length === 0 ? (
              <Empty
                title="No posts scheduled"
                message="No content scheduled for this date."
                actionLabel="Schedule Post"
                onAction={() => window.location.href = '/posts/new'}
                icon="Calendar"
              />
            ) : (
              <div className="space-y-4">
                {selectedDatePosts.map((post) => (
                  <motion.div
                    key={post.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/posts/${post.Id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 line-clamp-2">
                        {post.title}
                      </h4>
                      <StatusBadge status={post.status} />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Posts</span>
                <span className="font-medium">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Published</span>
                <span className="font-medium text-green-600">
                  {posts.filter(p => p.status === 'Published').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Review</span>
                <span className="font-medium text-yellow-600">
                  {posts.filter(p => p.status === 'In Review').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Draft</span>
                <span className="font-medium text-gray-600">
                  {posts.filter(p => p.status === 'Draft').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default Calendar