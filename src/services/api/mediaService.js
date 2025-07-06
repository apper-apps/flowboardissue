import mediaData from '@/services/mockData/media.json'

class MediaService {
  constructor() {
    this.media = [...mediaData]
  }

  async getAll() {
    await this.delay()
    return [...this.media]
  }

  async getById(id) {
    await this.delay()
    const media = this.media.find(m => m.Id === id)
    if (!media) {
      throw new Error('Media not found')
    }
    return { ...media }
  }

  async create(mediaData) {
    await this.delay()
    const newMedia = {
      ...mediaData,
      Id: this.getNextId(),
      createdAt: mediaData.createdAt || new Date().toISOString()
    }
    this.media.push(newMedia)
    return { ...newMedia }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.media.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Media not found')
    }
    
    this.media[index] = {
      ...this.media[index],
      ...updates
    }
    return { ...this.media[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.media.findIndex(m => m.Id === id)
    if (index === -1) {
      throw new Error('Media not found')
    }
    
    this.media.splice(index, 1)
    return true
  }

  getNextId() {
    return Math.max(...this.media.map(m => m.Id), 0) + 1
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new MediaService()