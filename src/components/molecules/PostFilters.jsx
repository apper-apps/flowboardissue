import { useState } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const PostFilters = ({ onFilterChange, activeFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'in review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' },
  ]

  const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
  ]

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...activeFilters, [key]: value })
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        icon={showFilters ? "ChevronUp" : "ChevronDown"}
      >
        Filters
      </Button>

      {showFilters && (
        <div className="flex items-center gap-4">
          <select
            value={activeFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={activeFilters.sort || 'created_desc'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            variant="ghost"
            onClick={() => onFilterChange({})}
            icon="X"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default PostFilters