import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function ServicesManager({ businessId, isOwner = false }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: '',
    priceRange: '',
    duration: '',
    isFeatured: false
  })

  useEffect(() => {
    if (businessId) {
      loadServices()
    }
  }, [businessId])

  const loadServices = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/business-services/${businessId}`)
      const data = await response.json()
      
      if (data.success) {
        setServices(data.data.services)
      } else {
        setError('Failed to load services')
      }
    } catch (error) {
      console.error('Error loading services:', error)
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingService
        ? `http://localhost:3001/api/v1/business-services/service/${editingService.id}`
        : `http://localhost:3001/api/v1/business-services/${businessId}`
      
      const method = editingService ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        await loadServices()
        resetForm()
        setError('')
      } else {
        setError(data.message || 'Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      setError('Failed to save service')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription || '',
      priceRange: service.priceRange || '',
      duration: service.duration || '',
      isFeatured: service.isFeatured
    })
    setShowAddForm(true)
  }

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/business-services/service/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        await loadServices()
        setError('')
      } else {
        setError(data.message || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      setError('Failed to delete service')
    }
  }

  const resetForm = () => {
    setFormData({
      serviceName: '',
      serviceDescription: '',
      priceRange: '',
      duration: '',
      isFeatured: false
    })
    setEditingService(null)
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Services Offered</h3>
        {isOwner && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Service
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && isOwner && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., House Construction, Interior Design"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe what this service includes..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., $500 - $2000, Contact for quote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 2-3 weeks, 1 day"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Featured service (highlight this service)
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No services listed yet.</p>
          {isOwner && (
            <p className="text-sm mt-1">Add your first service to showcase what you offer.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 ${
                service.isFeatured ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{service.serviceName}</h4>
                    {service.isFeatured && (
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  
                  {service.serviceDescription && (
                    <p className="text-gray-600 text-sm mt-1">{service.serviceDescription}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    {service.priceRange && (
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {service.priceRange}
                      </div>
                    )}
                    {service.duration && (
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    )}
                  </div>
                </div>

                {isOwner && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
