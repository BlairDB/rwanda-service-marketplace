import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import { getBusinessUrl } from '../utils/slugify'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

export default function Businesses() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  // Sample data for now (will be replaced with API call)
  const sampleBusinesses = [
    {
      id: 1,
      business_name: 'Kigali Construction Ltd',
      category: 'Construction',
      description: 'Leading construction company specializing in residential and commercial buildings across Rwanda.',
      location: 'Kigali City',
      phone: '+250 788 123 456',
      email: 'info@kigaliconstruction.rw',
      rating: 4.8,
      reviews_count: 24,
      verified: true
    },
    {
      id: 2,
      business_name: 'Rwanda Property Management',
      category: 'Real Estate',
      description: 'Professional property management services for residential and commercial properties.',
      location: 'Kigali City',
      phone: '+250 788 234 567',
      email: 'contact@rwandaproperty.rw',
      rating: 4.6,
      reviews_count: 18,
      verified: true
    },
    {
      id: 3,
      business_name: 'Elite Interior Design',
      category: 'Design',
      description: 'Modern interior design solutions for homes and offices with Rwandan cultural elements.',
      location: 'Kigali City',
      phone: '+250 788 345 678',
      email: 'hello@elitedesign.rw',
      rating: 4.9,
      reviews_count: 31,
      verified: true
    },
    {
      id: 4,
      business_name: 'Gasabo Maintenance Services',
      category: 'Maintenance',
      description: 'Comprehensive maintenance and repair services for residential and commercial properties.',
      location: 'Gasabo District',
      phone: '+250 788 456 789',
      email: 'service@gasabomaintenance.rw',
      rating: 4.5,
      reviews_count: 12,
      verified: false
    },
    {
      id: 5,
      business_name: 'Rwanda Legal Advisors',
      category: 'Legal',
      description: 'Expert legal services for real estate transactions, property law, and regulatory compliance.',
      location: 'Kigali City',
      phone: '+250 788 567 890',
      email: 'legal@rwandalegal.rw',
      rating: 4.7,
      reviews_count: 22,
      verified: true
    }
  ]

  useEffect(() => {
    // Handle URL parameters
    if (router.isReady) {
      const { search, location, category } = router.query
      if (search) setSearchQuery(search)
      if (location) setSelectedLocation(location)
      if (category) setSelectedCategory(category)
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBusinesses(sampleBusinesses)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLocation = selectedLocation === 'all' ||
                           business.location.toLowerCase().includes(selectedLocation.toLowerCase())

    const matchesCategory = selectedCategory === 'all' ||
                           business.category.toLowerCase().includes(selectedCategory.toLowerCase())

    return matchesSearch && matchesLocation && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviews_count - a.reviews_count
      case 'name':
        return a.business_name.localeCompare(b.business_name)
      default:
        return 0
    }
  })

  return (
    <Layout
      title="Browse Services - ServiceRW"
      description="Discover verified real estate service providers across Rwanda. From construction to property management, find trusted professionals for your needs."
      keywords="Rwanda real estate services, property services, construction companies Rwanda, real estate professionals"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse Services
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover verified real estate service providers across Rwanda
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 backdrop-blur-sm">
              {/* Main Search Row */}
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search services, companies, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  />
                </div>
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none pl-12 pr-12 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[220px] bg-white hover:border-gray-300 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <option value="all">🇷🇼 All Rwanda</option>
                    <option value="kigali">🏙️ Kigali City</option>
                    <option value="gasabo">📍 Gasabo District</option>
                    <option value="kicukiro">📍 Kicukiro District</option>
                    <option value="nyarugenge">📍 Nyarugenge District</option>
                    <option value="northern">🏔️ Northern Province</option>
                    <option value="southern">🌄 Southern Province</option>
                    <option value="eastern">🌅 Eastern Province</option>
                    <option value="western">🌲 Western Province</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    // Trigger search - in a real app this would make an API call
                    console.log('Searching...', { searchQuery, selectedLocation, selectedCategory })
                  }}
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-8 py-3 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Search Services
                </button>
              </div>

              {/* Additional Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FunnelIcon className="h-4 w-4 mr-1 text-primary-500" />
                    Category
                  </label>
                  <div className="relative">
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md pr-10"
                    >
                      <option value="all">🏢 All Categories</option>
                      <option value="real estate">🏠 Real Estate</option>
                      <option value="construction">🏗️ Construction</option>
                      <option value="maintenance">🔧 Maintenance</option>
                      <option value="design">🎨 Design</option>
                      <option value="legal">⚖️ Legal</option>
                      <option value="financial">💰 Financial</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1 text-primary-500" />
                    Sort By
                  </label>
                  <div className="relative">
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all duration-200 font-medium cursor-pointer shadow-sm hover:shadow-md pr-10"
                    >
                      <option value="rating">⭐ Highest Rated</option>
                      <option value="reviews">💬 Most Reviews</option>
                      <option value="name">🔤 Name (A-Z)</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    ⚡ Quick Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('construction')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                        selectedCategory === 'construction'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      🏗️ Construction
                    </button>
                    <button
                      onClick={() => setSelectedCategory('real estate')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                        selectedCategory === 'real estate'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                      }`}
                    >
                      🏠 Real Estate
                    </button>
                    <button
                      onClick={() => setSelectedCategory('legal')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                        selectedCategory === 'legal'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                      }`}
                    >
                      ⚖️ Legal
                    </button>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedLocation('all')
                      setSelectedCategory('all')
                      setSortBy('rating')
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : `${filteredBusinesses.length} Services Found`}
                </h2>
                <p className="text-gray-600">
                  Verified professionals ready to help with your real estate needs
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-500">
                  Sorted by: <span className="font-medium text-gray-700">
                    {sortBy === 'rating' ? 'Highest Rated' :
                     sortBy === 'reviews' ? 'Most Reviews' : 'Name (A-Z)'}
                  </span>
                </p>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedLocation !== 'all' || selectedCategory !== 'all') && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedLocation !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Location: {selectedLocation}
                    <button
                      onClick={() => setSelectedLocation('all')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedLocation('all')
                    setSelectedCategory('all')
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Business Listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden flex flex-col h-full">
                  {/* Business Header */}
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mr-2 truncate">
                            {business.business_name}
                          </h3>
                          {business.verified && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-primary-600 font-semibold text-sm mb-2">
                          {business.category}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{business.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {business.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-4 w-4 ${
                              index < Math.floor(business.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {business.rating}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({business.reviews_count} reviews)
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 mt-auto">
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2 text-primary-500 flex-shrink-0" />
                        <span className="truncate">{business.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-primary-500 flex-shrink-0" />
                        <span className="truncate">{business.email}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => {
                          // Open contact modal or redirect to contact
                          window.open(`mailto:${business.email}?subject=Inquiry about ${business.business_name}&body=Hello, I'm interested in your services.`, '_blank')
                        }}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Contact
                      </button>
                      <Link
                        href={getBusinessUrl(business.business_name)}
                        className="flex-1 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedLocation('all')
                  setSelectedCategory('all')
                  setSortBy('rating')
                }}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
