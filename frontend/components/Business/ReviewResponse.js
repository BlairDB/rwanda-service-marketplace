import { useState, useEffect } from 'react'
import { 
  StarIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

export default function ReviewResponse({ businessId, isOwner = false }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [respondingTo, setRespondingTo] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (businessId) {
      loadReviews()
    }
  }, [businessId])

  const loadReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/reviews/business/${businessId}`)
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.data.reviews)
      } else {
        setError('Failed to load reviews')
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleStartResponse = (review) => {
    setRespondingTo(review.id)
    setResponseText(review.business_response || '')
  }

  const handleCancelResponse = () => {
    setRespondingTo(null)
    setResponseText('')
  }

  const handleSubmitResponse = async (reviewId) => {
    if (!responseText.trim()) {
      setError('Response cannot be empty')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ response: responseText })
      })

      const data = await response.json()
      
      if (data.success) {
        await loadReviews()
        setRespondingTo(null)
        setResponseText('')
      } else {
        setError(data.message || 'Failed to submit response')
      }
    } catch (error) {
      console.error('Error submitting response:', error)
      setError('Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolidIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
        </div>
        <span className="text-sm text-gray-500">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No reviews yet.</p>
          <p className="text-sm mt-1">Customer reviews will appear here once submitted.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {review.reviewer_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.reviewer_name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isOwner && !review.business_response && (
                  <button
                    onClick={() => handleStartResponse(review)}
                    className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Respond
                  </button>
                )}
              </div>

              {/* Review Content */}
              <div className="mb-4">
                {review.title && (
                  <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                )}
                <p className="text-gray-700">{review.comment}</p>
                {review.service_used && (
                  <p className="text-sm text-gray-500 mt-2">
                    Service used: {review.service_used}
                  </p>
                )}
              </div>

              {/* Business Response */}
              {review.business_response && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-medium text-sm">B</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-blue-900">Business Response</span>
                        <span className="text-sm text-blue-600">
                          {formatDate(review.business_responded_at)}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.business_response}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Response Form */}
              {isOwner && respondingTo === review.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">
                    {review.business_response ? 'Edit Response' : 'Respond to Review'}
                  </h5>
                  
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Write a professional response to this review..."
                  />
                  
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-gray-500">
                      💡 Tip: Thank the customer, address their concerns, and show your commitment to quality service.
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSubmitResponse(review.id)}
                        disabled={submitting || !responseText.trim()}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {submitting ? 'Submitting...' : 'Submit Response'}
                      </button>
                      
                      <button
                        onClick={handleCancelResponse}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Response Status */}
              {isOwner && review.business_response && respondingTo !== review.id && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckIcon className="h-4 w-4" />
                    <span>Responded on {formatDate(review.business_responded_at)}</span>
                  </div>
                  
                  <button
                    onClick={() => handleStartResponse(review)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Edit response
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Response Guidelines */}
      {isOwner && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📝 Response Best Practices</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Respond promptly to show you value customer feedback</li>
            <li>• Thank customers for positive reviews and address concerns in negative ones</li>
            <li>• Keep responses professional and constructive</li>
            <li>• Use responses as an opportunity to showcase your customer service</li>
            <li>• Invite customers to contact you directly for further discussion</li>
          </ul>
        </div>
      )}
    </div>
  )
}
