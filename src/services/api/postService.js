import postsData from '@/services/mockData/posts.json'

class PostService {
  constructor() {
    this.posts = [...postsData]
  }

  async getAll() {
    await this.delay()
    return [...this.posts]
  }

  async getById(id) {
    await this.delay()
    const post = this.posts.find(p => p.Id === id)
    if (!post) {
      throw new Error('Post not found')
    }
    return { ...post }
  }

  async create(postData) {
    await this.delay()
    const newPost = {
      ...postData,
      Id: this.getNextId(),
      createdAt: postData.createdAt || new Date().toISOString(),
      updatedAt: postData.updatedAt || new Date().toISOString()
    }
    this.posts.push(newPost)
    return { ...newPost }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.posts.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    
    this.posts[index] = {
      ...this.posts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...this.posts[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.posts.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    
    this.posts.splice(index, 1)
    return true
  }

  async getByWorkspace(workspaceId) {
    await this.delay()
    return this.posts.filter(p => p.workspaceId === workspaceId)
  }

  async getByStatus(status) {
    await this.delay()
    return this.posts.filter(p => p.status === status)
  }

  getNextId() {
    return Math.max(...this.posts.map(p => p.Id), 0) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new PostService()