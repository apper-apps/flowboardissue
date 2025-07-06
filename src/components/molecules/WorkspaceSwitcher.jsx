import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Avatar from '@/components/atoms/Avatar'

const WorkspaceSwitcher = ({ workspaces, currentWorkspace, onWorkspaceChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleWorkspaceSelect = (workspace) => {
    onWorkspaceChange(workspace)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between p-2 h-auto"
      >
        <div className="flex items-center gap-2">
          <Avatar 
            src={currentWorkspace?.logo} 
            alt={currentWorkspace?.name}
            size="sm"
            fallback={currentWorkspace?.name}
          />
          <div className="text-left">
            <div className="font-medium text-sm">{currentWorkspace?.name}</div>
            <div className="text-xs text-gray-500">Workspace</div>
          </div>
        </div>
        <ApperIcon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-elevated border border-gray-200 z-50"
          >
            <div className="p-2 space-y-1">
              {workspaces?.map((workspace) => (
                <button
                  key={workspace.Id}
                  onClick={() => handleWorkspaceSelect(workspace)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors ${
                    currentWorkspace?.Id === workspace.Id ? 'bg-gray-100' : ''
                  }`}
                >
                  <Avatar 
                    src={workspace.logo} 
                    alt={workspace.name}
                    size="sm"
                    fallback={workspace.name}
                  />
                  <div className="text-left">
                    <div className="font-medium text-sm">{workspace.name}</div>
                    <div className="text-xs text-gray-500">{workspace.memberIds?.length || 0} members</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorkspaceSwitcher