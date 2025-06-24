import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout'
import apiClient from '../../utils/api'
import { 
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function ManageBusinesses() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated and is a business user
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      const userData = localStorage.getItem('user')
      
      if (!isAuthenticated || !userData) {
        router.push('/auth/login?redirect=/business/manage')
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'provider' && parsedUser.role !== 'admin') {
        router.push('/profile')
        return
      }

      setUser(parsedUser)
      await loadBusinesses()
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load business data')
    } finally {
      setLoading(false)
    }
  }

  const loadBusinesses = async () => {
    try {
      const response = await apiClient.get('/businesses/my')
      if (response.success) {
        setBusinesses(response.data.businesses)
      } else {
        setError(response.message || 'Failed to load businesses')
      }
    } catch (error) {
      console.error('Error loading businesses:', error)
      setError('Failed to load businesses')
    }
  }

  const handleDeleteBusiness = async (businessId) => {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return
    }

    try {
      const response = await apiClient.delete(`/businesses/${businessId}`)
      if (response.success) {
        setBusinesses(businesses.filter(b => b.id !== businessId))
      } else {
        setError(response.message || 'Failed to delete business')
      }
    } catch (error) {
      console.error('Error deleting business:', error)
      setError('Failed to delete business')
    }
  }

  const getStatusIcon = (status, isVerified) => {
    if (status === 'approved' && isVerified) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    } else if (status === 'approved') {
      return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
    } else if (status === 'pending') {
      return <ClockIcon className="h-5 w-5 text-yellow-500" />
    } else {
      return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = (status, isVerified) => {
    if (status === 'approved' && isVerified) {
      return 'Verified'
    } else if (status === 'approved') {
      return 'Active'
    } else if (status === 'pending') {
      return 'Pending Review'
    } else {
      return 'Rejected'
    }
  }

  if (loading) {
    return (
      <Layout title="Loading... - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your businesses...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title="Manage Businesses - ServiceRW"
      description="Manage your business listings on ServiceRW"
      keywords="business management, ServiceRW"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Businesses</h1>
                <p className="text-gray-600 mt-1">Create and manage your business listings</p>
              </div>
              <Link
                href="/business/create"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Business
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first business listing.</p>
              <Link
                href="/business/create"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Business
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <div key={business.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Business Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-16 w-16 text-white" />
                  </div>

                  {/* Business Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {business.businessName}
                      </h3>
                      <div className="flex items-center ml-2">
                        {getStatusIcon(business.status, business.isVerified)}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Status:</span>
                        <span className="ml-2">{getStatusText(business.status, business.isVerified)}</span>
                      </div>
                      {business.category && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Category:</span>
                          <span className="ml-2">{business.category.name}</span>
                        </div>
                      )}
                      {business.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Location:</span>
                          <span className="ml-2">{business.location.name}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Views:</span>
                        <span className="ml-2">{business.viewCount || 0}</span>
                      </div>
                    </div>

                    {business.descriptionEn && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {business.descriptionEn}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {business.status === 'approved' && (
                        <Link
                          href={`/${business.category?.slug || 'business'}/${business.slug}`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      )}
                      <Link
                        href={`/business/edit/${business.id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBusiness(business.id)}
                        className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
