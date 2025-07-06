import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import MediaItem from '@/components/molecules/MediaItem'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import mediaService from '@/services/api/mediaService'

const MediaLibrary = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    try {
      setLoading(true)
      setError('')
      const mediaData = await mediaService.getAll()
      setMedia(mediaData)
    } catch (err) {
      setError('Failed to load media library')
      console.error('Media load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        // Simulate file upload
        const url = URL.createObjectURL(file)
        return await mediaService.create({
          name: file.name,
          type: file.type,
          size: file.size,
          url: url,
          createdAt: new Date().toISOString()
        })
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      setMedia([...media, ...uploadedFiles])
      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (err) {
      toast.error('Failed to upload files')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (mediaId) => {
    try {
      await mediaService.delete(mediaId)
      setMedia(media.filter(m => m.Id !== mediaId))
      toast.success('Media file deleted successfully')
    } catch (err) {
      toast.error('Failed to delete media file')
      console.error('Delete error:', err)
    }
  }

  const getFilteredMedia = () => {
    let filtered = media

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType) {
      filtered = filtered.filter(m =>
        m.type.startsWith(selectedType)
      )
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getMediaStats = () => {
    const images = media.filter(m => m.type.startsWith('image/')).length
    const videos = media.filter(m => m.type.startsWith('video/')).length
    const documents = media.filter(m => !m.type.startsWith('image/') && !m.type.startsWith('video/')).length
    const totalSize = media.reduce((sum, m) => sum + m.size, 0)

    return { images, videos, documents, totalSize }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error title="Media Library Error" message={error} onRetry={loadMedia} />
  }

  const filteredMedia = getFilteredMedia()
  const stats = getMediaStats()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">
            Manage and organize your content assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            as="label"
            htmlFor="file-upload"
            variant="primary"
            loading={uploading}
            icon="Upload"
          >
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.images}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ApperIcon name="Image" size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="Video" size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ApperIcon name="File" size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <ApperIcon name="HardDrive" size={24} className="text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Types</option>
          <option value="image/">Images</option>
          <option value="video/">Videos</option>
          <option value="audio/">Audio</option>
        </select>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Empty
          title="No media files found"
          message={searchTerm || selectedType 
            ? "No media files match your search criteria." 
            : "Upload your first media file to get started."
          }
          actionLabel="Upload Files"
          onAction={() => document.getElementById('file-upload').click()}
          icon="Upload"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMedia.map((mediaItem, index) => (
            <motion.div
              key={mediaItem.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MediaItem
                media={mediaItem}
                onSelect={() => console.log('Selected:', mediaItem)}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default MediaLibrary