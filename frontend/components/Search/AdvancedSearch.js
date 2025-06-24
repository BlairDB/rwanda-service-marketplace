import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

export default function AdvancedSearch({ onSearch, initialFilters = {} }) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    location: '',
    priceRange: '',
    rating: '',
    serviceType: '',
    businessType: '',
    verified: false,
    featured: false,
    sortBy: 'relevance',
    ...initialFilters
  })
  
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)

  const priceRanges = [
    { value: '', label: 'Any Price' },
    { value: 'budget', label: 'Budget (Under $100)' },
    { value: 'moderate', label: 'Moderate ($100 - $500)' },
    { value: 'premium', label: 'Premium ($500 - $1000)' },
    { value: 'luxury', label: 'Luxury ($1000+)' }
  ]

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'distance', label: 'Nearest First' }
  ]

  const businessTypes = [
    { value: '', label: 'All Business Types' },
    { value: 'individual', label: 'Individual Professional' },
    { value: 'small_business', label: 'Small Business' },
    { value: 'company', label: 'Company' },
    { value: 'corporation', label: 'Corporation' }
  ]

  useEffect(() => {
    loadCategories()
    loadLocations()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data.categories)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadLocations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/locations')
      const data = await response.json()
      if (data.success) {
        setLocations(data.data.locations)
      }
    } catch (error) {
      console.error('Error loading locations:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Auto-search on filter change (debounced)
    if (onSearch) {
      clearTimeout(window.searchTimeout)
      window.searchTimeout = setTimeout(() => {
        onSearch(newFilters)
      }, 500)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (onSearch) {
      onSearch(filters)
    } else {
      // Navigate to search results page
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value)
        }
      })
      router.push(`/search?${queryParams.toString()}`)
    }
    
    setLoading(false)
  }

  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      category: '',
      location: '',
      priceRange: '',
      rating: '',
      serviceType: '',
      businessType: '',
      verified: false,
      featured: false,
      sortBy: 'relevance'
    }
    setFilters(clearedFilters)
    if (onSearch) {
      onSearch(clearedFilters)
    }
  }

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'query' || key === 'sortBy') return false
      if (typeof value === 'boolean') return value
      return value && value !== ''
    }).length
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              placeholder="Search for services, businesses, or keywords..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center px-4 py-3 border rounded-lg transition-colors ${
              isExpanded || getActiveFilterCount() > 0
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPinIcon className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.slug}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <StarIcon className="inline h-4 w-4 mr-1" />
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <BuildingOfficeIcon className="inline h-4 w-4 mr-1" />
                Business Type
              </label>
              <select
                value={filters.businessType}
                onChange={(e) => handleFilterChange('businessType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <AdjustmentsHorizontalIcon className="inline h-4 w-4 mr-1" />
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Verified businesses only</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured businesses only</span>
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
            
            <div className="text-sm text-gray-500">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
