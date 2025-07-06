import workspacesData from '@/services/mockData/workspaces.json'

class WorkspaceService {
  constructor() {
    this.workspaces = [...workspacesData]
  }

  async getAll() {
    await this.delay()
    return [...this.workspaces]
  }

  async getById(id) {
    await this.delay()
    const workspace = this.workspaces.find(w => w.Id === id)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return { ...workspace }
  }

  async create(workspaceData) {
    await this.delay()
    const newWorkspace = {
      ...workspaceData,
      Id: this.getNextId(),
      memberIds: workspaceData.memberIds || []
    }
    this.workspaces.push(newWorkspace)
    return { ...newWorkspace }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.workspaces.findIndex(w => w.Id === id)
    if (index === -1) {
      throw new Error('Workspace not found')
    }
    
    this.workspaces[index] = {
      ...this.workspaces[index],
      ...updates
    }
    return { ...this.workspaces[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.workspaces.findIndex(w => w.Id === id)
    if (index === -1) {
      throw new Error('Workspace not found')
    }
    
    this.workspaces.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.workspaces.map(w => w.Id), 0) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200))
  }
}

export default new WorkspaceService()