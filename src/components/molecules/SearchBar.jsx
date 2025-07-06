import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ onSearch, placeholder = "Search posts..." }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value === '') {
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <ApperIcon 
        name="Search" 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-10 pr-4"
      />
    </form>
  )
}

export default SearchBar