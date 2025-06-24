import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import { getBusinessUrl } from '../utils/slugify'
import { 
  HeartIcon,
  BuildingOfficeIcon,
  StarIcon,
  MapPinIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function Favorites() {
  // Sample favorites data (in real app, this would come from user's saved items)
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      business_name: 'Kigali Construction Ltd',
      category: 'Construction',
      description: 'Leading construction company specializing in residential and commercial buildings across Rwanda.',
      location: 'Kigali City',
      rating: 4.8,
      reviews_count: 24,
      verified: true,
      saved_date: '2024-01-15'
    },
    {
      id: 2,
      business_name: 'Rwanda Property Management',
      category: 'Real Estate',
      description: 'Professional property management services for residential and commercial properties.',
      location: 'Kigali City',
      rating: 4.6,
      reviews_count: 18,
      verified: true,
      saved_date: '2024-01-10'
    },
    {
      id: 3,
      business_name: 'Elite Interior Design',
      category: 'Design',
      description: 'Modern interior design solutions for homes and offices with Rwandan cultural elements.',
      location: 'Kigali City',
      rating: 4.9,
      reviews_count: 31,
      verified: true,
      saved_date: '2024-01-08'
    }
  ])

  const removeFavorite = (businessId) => {
    setFavorites(favorites.filter(fav => fav.id !== businessId))
  }

  return (
    <Layout
      title="My Favorites - ServiceRW"
      description="Your saved real estate service providers in Rwanda. Keep track of businesses you're interested in."
      keywords="favorites, saved businesses, Rwanda real estate services"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <HeartSolidIcon className="h-8 w-8 text-secondary-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My Favorites
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Your saved real estate service providers. Keep track of businesses you're interested in working with.
            </p>
          </div>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {favorites.length > 0 ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {favorites.length} Saved {favorites.length === 1 ? 'Business' : 'Businesses'}
                  </h2>
                  <p className="text-gray-600">
                    Manage your saved real estate service providers
                  </p>
                </div>
                <Link
                  href="/businesses"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Find More Services
                </Link>
              </div>

              {/* Favorites Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((business) => (
                  <div key={business.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
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
                        <button
                          onClick={() => removeFavorite(business.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from favorites"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
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

                      {/* Saved Date */}
                      <div className="text-xs text-gray-500 mb-4">
                        Saved on {new Date(business.saved_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Link
                          href={getBusinessUrl(business.business_name)}
                          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium text-center"
                        >
                          View Profile
                        </Link>
                        <button 
                          onClick={() => {
                            window.open(`mailto:info@${business.business_name.toLowerCase().replace(/\s+/g, '')}.rw?subject=Inquiry about ${business.business_name}&body=Hello, I'm interested in your services.`, '_blank')
                          }}
                          className="flex-1 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <HeartIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Favorites Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring Rwanda's real estate services and save your favorite businesses for easy access later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/businesses"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse Services
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  View Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      {favorites.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Tips for Managing Your Favorites
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compare Services</h4>
                    <p className="text-gray-600 text-sm">Use your favorites to compare different service providers and make informed decisions.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quick Contact</h4>
                    <p className="text-gray-600 text-sm">Easily reach out to your saved businesses when you're ready to start a project.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Stay Updated</h4>
                    <p className="text-gray-600 text-sm">Get notifications about updates from your favorite service providers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
