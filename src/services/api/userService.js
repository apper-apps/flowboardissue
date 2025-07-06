import usersData from '@/services/mockData/users.json'

class UserService {
  constructor() {
    this.users = [...usersData]
  }

  async getAll() {
    await this.delay()
    return [...this.users]
  }

  async getById(id) {
    await this.delay()
    const user = this.users.find(u => u.Id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  async create(userData) {
    await this.delay()
    const newUser = {
      ...userData,
      Id: this.getNextId(),
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=5B21B6&color=fff`
    }
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.users.findIndex(u => u.Id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updates
    }
    return { ...this.users[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.users.findIndex(u => u.Id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    this.users.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.users.map(u => u.Id), 0) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200))
  }
}

export default new UserService()