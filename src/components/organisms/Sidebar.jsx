import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import WorkspaceSwitcher from '@/components/molecules/WorkspaceSwitcher'

const Sidebar = ({ isOpen, onClose, workspaces, currentWorkspace, onWorkspaceChange }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(currentWorkspace)

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: 'BarChart3' },
    { name: 'Posts', href: '/posts', icon: 'FileText' },
    { name: 'Calendar', href: '/calendar', icon: 'Calendar' },
    { name: 'Media Library', href: '/media', icon: 'Image' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ]

  const handleWorkspaceChange = (workspace) => {
    setSelectedWorkspace(workspace)
    onWorkspaceChange(workspace)
  }

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">FlowBoard</h1>
        </div>

        <div className="mb-6">
          <WorkspaceSwitcher
            workspaces={workspaces}
            currentWorkspace={selectedWorkspace}
            onWorkspaceChange={handleWorkspaceChange}
          />
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" size={18} className="text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">FlowBoard</h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon="X"
                />
              </div>

              <div className="mb-6">
                <WorkspaceSwitcher
                  workspaces={workspaces}
                  currentWorkspace={selectedWorkspace}
                  onWorkspaceChange={handleWorkspaceChange}
                />
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar