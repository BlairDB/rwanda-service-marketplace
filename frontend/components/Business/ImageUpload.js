import { useState, useEffect, useRef } from 'react'
import { 
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

export default function ImageUpload({ businessId, imageType = 'gallery', isOwner = false }) {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [altText, setAltText] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (businessId) {
      loadImages()
    }
  }, [businessId, imageType])

  const loadImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/business-images/${businessId}?imageType=${imageType}`)
      const data = await response.json()
      
      if (data.success) {
        setImages(data.data.images)
      } else {
        setError('Failed to load images')
      }
    } catch (error) {
      console.error('Error loading images:', error)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files) => {
    if (!isOwner) return
    
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
        return false
      }
      
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 5MB.')
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      validFiles.forEach(file => {
        formData.append('images', file)
      })
      formData.append('imageType', imageType)
      formData.append('altText', altText)

      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/business-images/${businessId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        await loadImages()
        setAltText('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setError(data.message || 'Failed to upload images')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      setError('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/business-images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        await loadImages()
      } else {
        setError(data.message || 'Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      setError('Failed to delete image')
    }
  }

  const handleUpdateImage = async (imageId, updates) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/business-images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      
      if (data.success) {
        await loadImages()
        setEditingImage(null)
        setAltText('')
      } else {
        setError(data.message || 'Failed to update image')
      }
    } catch (error) {
      console.error('Error updating image:', error)
      setError('Failed to update image')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {imageType === 'logo' ? 'Business Logo' : 
           imageType === 'cover' ? 'Cover Image' : 'Image Gallery'}
        </h3>
        {isOwner && (
          <span className="text-sm text-gray-500">
            {images.length} image{images.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Upload Area */}
      {isOwner && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                PNG, JPG, WebP up to 5MB each
              </span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </label>
          </div>
          
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-center">
                <ArrowUpTrayIcon className="h-5 w-5 text-primary-600 animate-bounce mr-2" />
                <span className="text-sm text-primary-600">Uploading images...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alt Text Input for Upload */}
      {isOwner && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text (optional)
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe the image for accessibility..."
          />
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No images uploaded yet.</p>
          {isOwner && (
            <p className="text-sm mt-1">Upload your first image to get started.</p>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${
          imageType === 'logo' ? 'grid-cols-1 max-w-xs' :
          imageType === 'cover' ? 'grid-cols-1' :
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={`http://localhost:3001${image.image_url}`}
                  alt={image.alt_text || 'Business image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              {/* Image Actions */}
              {isOwner && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingImage(image)
                        setAltText(image.alt_text || '')
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Alt Text Display */}
              {image.alt_text && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.alt_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Image</h4>
            
            <div className="mb-4">
              <img
                src={`http://localhost:3001${editingImage.image_url}`}
                alt={editingImage.alt_text || 'Business image'}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the image..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleUpdateImage(editingImage.id, { altText })}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setEditingImage(null)
                  setAltText('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
