import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import workspaceService from '@/services/api/workspaceService'
import userService from '@/services/api/userService'

const Settings = () => {
  const [workspaces, setWorkspaces] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('workspace')
  const [workspaceForm, setWorkspaceForm] = useState({
    name: '',
    color: '#5B21B6',
    logo: ''
  })
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Editor'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError('')
      const [workspacesData, usersData] = await Promise.all([
        workspaceService.getAll(),
        userService.getAll()
      ])
      setWorkspaces(workspacesData)
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load settings')
      console.error('Settings load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async (e) => {
    e.preventDefault()
    if (!workspaceForm.name.trim()) {
      toast.error('Workspace name is required')
      return
    }

    try {
      const newWorkspace = await workspaceService.create({
        ...workspaceForm,
        memberIds: [users[0]?.Id || 1]
      })
      setWorkspaces([...workspaces, newWorkspace])
      setWorkspaceForm({ name: '', color: '#5B21B6', logo: '' })
      toast.success('Workspace created successfully')
    } catch (err) {
      toast.error('Failed to create workspace')
      console.error('Create workspace error:', err)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!userForm.name.trim() || !userForm.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    try {
      const newUser = await userService.create({
        ...userForm,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userForm.name)}&background=5B21B6&color=fff`
      })
      setUsers([...users, newUser])
      setUserForm({ name: '', email: '', role: 'Editor' })
      toast.success('User created successfully')
    } catch (err) {
      toast.error('Failed to create user')
      console.error('Create user error:', err)
    }
  }

  const handleDeleteWorkspace = async (workspaceId) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      try {
        await workspaceService.delete(workspaceId)
        setWorkspaces(workspaces.filter(w => w.Id !== workspaceId))
        toast.success('Workspace deleted successfully')
      } catch (err) {
        toast.error('Failed to delete workspace')
        console.error('Delete workspace error:', err)
      }
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(userId)
        setUsers(users.filter(u => u.Id !== userId))
        toast.success('User deleted successfully')
      } catch (err) {
        toast.error('Failed to delete user')
        console.error('Delete user error:', err)
      }
    }
  }

  const tabs = [
    { id: 'workspace', label: 'Workspaces', icon: 'Building' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error title="Settings Error" message={error} onRetry={loadSettings} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your workspaces, users, and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'workspace' && (
          <>
            {/* Create Workspace */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Workspace</h3>
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Workspace Name"
                    value={workspaceForm.name}
                    onChange={(e) => setWorkspaceForm({...workspaceForm, name: e.target.value})}
                    placeholder="Enter workspace name"
                    required
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Brand Color
                    </label>
                    <input
                      type="color"
                      value={workspaceForm.color}
                      onChange={(e) => setWorkspaceForm({...workspaceForm, color: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <Input
                  label="Logo URL"
                  value={workspaceForm.logo}
                  onChange={(e) => setWorkspaceForm({...workspaceForm, logo: e.target.value})}
                  placeholder="https://example.com/logo.png"
                />
                <Button type="submit" variant="primary" icon="Plus">
                  Create Workspace
                </Button>
              </form>
            </Card>

            {/* Workspaces List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Existing Workspaces</h3>
              <div className="space-y-4">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={workspace.logo}
                        alt={workspace.name}
                        size="md"
                        fallback={workspace.name}
                      />
                      <div>
                        <h4 className="font-medium">{workspace.name}</h4>
                        <p className="text-sm text-gray-600">
                          {workspace.memberIds?.length || 0} members
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWorkspace(workspace.Id)}
                      icon="Trash2"
                      className="text-error hover:text-error"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* Create User */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    placeholder="Enter user name"
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" icon="Plus">
                  Add User
                </Button>
              </form>
            </Card>

            {/* Users List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        size="md"
                        fallback={user.name}
                      />
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                        {user.role}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.Id)}
                        icon="Trash2"
                        className="text-error hover:text-error"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'preferences' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Application Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">
                    Receive notifications for new comments and approvals
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-save</h4>
                  <p className="text-sm text-gray-600">
                    Automatically save drafts while editing
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-gray-600">
                    Use dark theme for the interface
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

export default Settings