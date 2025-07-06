import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'
import workspaceService from '@/services/api/workspaceService'
import userService from '@/services/api/userService'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState([])
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workspacesData, usersData] = await Promise.all([
          workspaceService.getAll(),
          userService.getAll()
        ])
        
        setWorkspaces(workspacesData)
        setCurrentWorkspace(workspacesData[0])
        setCurrentUser(usersData[0])
      } catch (error) {
        console.error('Failed to load layout data:', error)
      }
    }

    loadData()
  }, [])

  const handleSearch = (searchTerm) => {
    // Handle global search
    console.log('Search:', searchTerm)
  }

  const handleWorkspaceChange = (workspace) => {
    setCurrentWorkspace(workspace)
  }

return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onWorkspaceChange={handleWorkspaceChange}
      />
      
      <div className="lg:ml-64 transition-all duration-300">
        <Header
          onSearch={handleSearch}
          onMenuToggle={() => setSidebarOpen(true)}
          currentUser={currentUser}
        />
        
        <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden min-h-[calc(100vh-72px)]">
          <div className="max-w-8xl mx-auto">
            <Outlet context={{ currentWorkspace, currentUser }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout