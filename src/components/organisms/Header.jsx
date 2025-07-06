import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Avatar from '@/components/atoms/Avatar'
import SearchBar from '@/components/molecules/SearchBar'

const Header = ({ onSearch, onMenuToggle, currentUser }) => {
  const location = useLocation()
  const [notifications, setNotifications] = useState([])

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/posts':
        return 'Posts'
      case '/posts/new':
        return 'Create Post'
      case '/calendar':
        return 'Calendar'
      case '/media':
        return 'Media Library'
      case '/settings':
        return 'Settings'
      default:
        if (location.pathname.includes('/posts/')) {
          return 'Post Details'
        }
        return 'FlowBoard'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
            icon="Menu"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block w-96">
            <SearchBar onSearch={onSearch} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
              )}
            </Button>

            <Avatar 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              size="sm"
              fallback={currentUser?.name}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header