import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function Hero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to businesses page with search parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (location) params.set('location', location)

    router.push(`/businesses?${params.toString()}`)
  }

  const handlePopularSearch = (searchTerm) => {
    setSearchQuery(searchTerm)
    const params = new URLSearchParams()
    params.set('search', searchTerm)
    router.push(`/businesses?${params.toString()}`)
  }

  const stats = [
    { label: 'Service Providers', value: '500+', icon: UserGroupIcon },
    { label: 'Services Listed', value: '1,200+', icon: BuildingOfficeIcon },
    { label: 'Happy Customers', value: '2,500+', icon: CheckCircleIcon },
  ]

  const popularSearches = [
    'Property Management',
    'Construction Services',
    'Real Estate Agents',
    'Interior Design',
    'Legal Services',
    'Home Maintenance'
  ]

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          {/* Main Heading */}
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <span className="text-secondary-400 mr-2">🇷🇼</span>
              Made for Rwanda
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Rwanda's Real Estate
              <span className="block text-secondary-400">Service Directory</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Digitizing and connecting Rwanda's Real Estate Value Chain Players. 
            From property developers to maintenance services, find trusted professionals for every need.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-3 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Service Search */}
                <div className="flex-1 relative min-w-0">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                {/* Location Search */}
                <div className="flex-1 relative min-w-0">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Location in Rwanda"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-8 py-4 rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Search Services
                </button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mb-16">
            <p className="text-primary-200 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handlePopularSearch(search)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-200 text-sm font-medium transform hover:-translate-y-0.5"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-secondary-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </section>
  )
}
