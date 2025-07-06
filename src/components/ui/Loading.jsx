import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'posts') {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-card border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="shimmer-bg h-6 w-3/4 rounded mb-2"></div>
                <div className="shimmer-bg h-4 w-full rounded mb-2"></div>
                <div className="shimmer-bg h-4 w-2/3 rounded"></div>
              </div>
              <div className="shimmer-bg h-6 w-20 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="shimmer-bg w-8 h-8 rounded-full"></div>
                <div>
                  <div className="shimmer-bg h-4 w-20 rounded mb-1"></div>
                  <div className="shimmer-bg h-3 w-16 rounded"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="shimmer-bg h-8 w-16 rounded"></div>
                <div className="shimmer-bg h-8 w-16 rounded"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow-card border border-gray-200 p-4"
          >
            <div className="shimmer-bg aspect-square rounded-lg mb-3"></div>
            <div className="shimmer-bg h-4 w-full rounded mb-2"></div>
            <div className="shimmer-bg h-3 w-2/3 rounded"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg shadow-card border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="shimmer-bg h-5 w-20 rounded"></div>
                <div className="shimmer-bg w-8 h-8 rounded-lg"></div>
              </div>
              <div className="shimmer-bg h-8 w-16 rounded mb-2"></div>
              <div className="shimmer-bg h-3 w-24 rounded"></div>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
          <div className="shimmer-bg h-6 w-32 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="shimmer-bg w-10 h-10 rounded-full"></div>
                <div className="flex-1">
                  <div className="shimmer-bg h-4 w-3/4 rounded mb-1"></div>
                  <div className="shimmer-bg h-3 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
      />
    </div>
  )
}

export default Loading