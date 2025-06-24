import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout/Layout'
import apiClient from '../../../utils/api'
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function EditBusiness() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [business, setBusiness] = useState(null)
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    businessName: '',
    categoryId: '',
    locationId: '',
    descriptionEn: '',
    addressEn: '',
    phonePrimary: '',
    email: '',
    websiteUrl: ''
  })

  useEffect(() => {
    if (id) {
      checkAuthAndLoadData()
    }
  }, [id])

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
      await Promise.all([loadBusiness(), loadFormData()])
    } catch (error) {
      console.error('Error loading data:', error)
      setErrors({ general: 'Failed to load business data' })
    } finally {
      setLoading(false)
    }
  }

  const loadBusiness = async () => {
    try {
      const response = await apiClient.get(`/businesses/${id}`)
      if (response.success) {
        const businessData = response.data.business
        setBusiness(businessData)
        
        // Populate form with existing data
        setFormData({
          businessName: businessData.businessName || '',
          categoryId: businessData.categoryId || '',
          locationId: businessData.locationId || '',
          descriptionEn: businessData.descriptionEn || '',
          addressEn: businessData.addressEn || '',
          phonePrimary: businessData.phonePrimary || '',
          email: businessData.email || '',
          websiteUrl: businessData.websiteUrl || ''
        })
      } else {
        setErrors({ general: 'Business not found' })
      }
    } catch (error) {
      console.error('Error loading business:', error)
      setErrors({ general: 'Failed to load business data' })
    }
  }

  const loadFormData = async () => {
    try {
      // Load categories and locations from the database
      // For now, we'll use mock data since we need to implement these endpoints
      setCategories([
        { id: '1', name: 'Construction Contractors', slug: 'construction-contractors' },
        { id: '2', name: 'Real Estate Agents', slug: 'real-estate-agents' },
        { id: '3', name: 'Interior Design', slug: 'interior-design' },
        { id: '4', name: 'Maintenance Services', slug: 'maintenance-services' },
        { id: '5', name: 'Legal Services', slug: 'legal-services' }
      ])

      setLocations([
        { id: '1', name: 'Kigali City' },
        { id: '2', name: 'Gasabo' },
        { id: '3', name: 'Kicukiro' },
        { id: '4', name: 'Nyarugenge' },
        { id: '5', name: 'Butare (Huye)' }
      ])
    } catch (error) {
      console.error('Error loading form data:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    } else if (formData.businessName.length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!formData.locationId) {
      newErrors.locationId = 'Location is required'
    }

    if (!formData.descriptionEn.trim()) {
      newErrors.descriptionEn = 'Description is required'
    } else if (formData.descriptionEn.length < 10) {
      newErrors.descriptionEn = 'Description must be at least 10 characters'
    }

    if (!formData.addressEn.trim()) {
      newErrors.addressEn = 'Address is required'
    } else if (formData.addressEn.length < 5) {
      newErrors.addressEn = 'Address must be at least 5 characters'
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.websiteUrl && !/^https?:\/\/.+/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid website URL (include http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await apiClient.put(`/businesses/${id}`, formData)
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/business/manage')
        }, 2000)
      } else {
        setErrors({ general: response.message || 'Failed to update business' })
      }
    } catch (error) {
      console.error('Error updating business:', error)
      setErrors({ general: error.message || 'Failed to update business' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Loading... - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading business data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (success) {
    return (
      <Layout title="Business Updated - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Updated Successfully!</h2>
            <p className="text-gray-600 mb-4">Your changes have been saved.</p>
            <p className="text-sm text-gray-500">Redirecting to manage businesses...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!business) {
    return (
      <Layout title="Business Not Found - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
            <p className="text-gray-600 mb-4">The business you're looking for doesn't exist or you don't have permission to edit it.</p>
            <Link
              href="/business/manage"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Manage
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`Edit ${business.businessName} - ServiceRW`}
      description="Edit your business listing on ServiceRW"
      keywords="edit business, ServiceRW"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Link
                href="/business/manage"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back to Manage
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Business</h1>
                <p className="text-gray-600 mt-1">{business.businessName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">{errors.general}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.businessName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your business name"
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                )}
              </div>

              {/* Category and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.categoryId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="locationId" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    id="locationId"
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.locationId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {errors.locationId && (
                    <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  rows={4}
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.descriptionEn ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your business, services, and what makes you unique..."
                />
                {errors.descriptionEn && (
                  <p className="mt-1 text-sm text-red-600">{errors.descriptionEn}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="addressEn" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  id="addressEn"
                  name="addressEn"
                  value={formData.addressEn}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.addressEn ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your business address"
                />
                {errors.addressEn && (
                  <p className="mt-1 text-sm text-red-600">{errors.addressEn}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phonePrimary" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phonePrimary"
                    name="phonePrimary"
                    value={formData.phonePrimary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+250 788 123 456"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="business@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.websiteUrl ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://www.yourbusiness.com"
                />
                {errors.websiteUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Business...
                    </div>
                  ) : (
                    'Update Business'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
