import commentsData from '@/services/mockData/comments.json'

class CommentService {
  constructor() {
    this.comments = [...commentsData]
  }

  async getAll() {
    await this.delay()
    return [...this.comments]
  }

  async getById(id) {
    await this.delay()
    const comment = this.comments.find(c => c.Id === id)
    if (!comment) {
      throw new Error('Comment not found')
    }
    return { ...comment }
  }

  async getByPostId(postId) {
    await this.delay()
    return this.comments.filter(c => c.postId === postId)
  }

  async create(commentData) {
    await this.delay()
    const newComment = {
      ...commentData,
      Id: this.getNextId(),
      createdAt: commentData.createdAt || new Date().toISOString(),
      resolved: commentData.resolved || false
    }
    this.comments.push(newComment)
    return { ...newComment }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.comments.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    
    this.comments[index] = {
      ...this.comments[index],
      ...updates
    }
    return { ...this.comments[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.comments.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Comment not found')
    }
    
    this.comments.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.comments.map(c => c.Id), 0) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 250))
  }
}

export default new CommentService()