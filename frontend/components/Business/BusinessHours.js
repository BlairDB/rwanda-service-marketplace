import { useState, useEffect } from 'react'
import { 
  ClockIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function BusinessHours({ businessId, isOwner = false }) {
  const [hours, setHours] = useState([])
  const [currentStatus, setCurrentStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editHours, setEditHours] = useState([])

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    if (businessId) {
      loadHours()
      loadCurrentStatus()
    }
  }, [businessId])

  const loadHours = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/business-hours/${businessId}`)
      const data = await response.json()
      
      if (data.success) {
        setHours(data.data.hours)
        setEditHours(data.data.hours.map(h => ({ ...h })))
      } else {
        setError('Failed to load business hours')
      }
    } catch (error) {
      console.error('Error loading hours:', error)
      setError('Failed to load business hours')
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/business-hours/${businessId}/current-status`)
      const data = await response.json()
      
      if (data.success) {
        setCurrentStatus(data.data)
      }
    } catch (error) {
      console.error('Error loading current status:', error)
    }
  }

  const handleEditToggle = () => {
    if (editing) {
      setEditHours(hours.map(h => ({ ...h })))
    }
    setEditing(!editing)
    setError('')
  }

  const handleHourChange = (dayIndex, field, value) => {
    const newHours = [...editHours]
    newHours[dayIndex] = {
      ...newHours[dayIndex],
      [field]: value
    }
    
    // If closing the business for a day, clear times
    if (field === 'is_open' && !value) {
      newHours[dayIndex].open_time = ''
      newHours[dayIndex].close_time = ''
      newHours[dayIndex].break_start_time = ''
      newHours[dayIndex].break_end_time = ''
    }
    
    setEditHours(newHours)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/v1/business-hours/${businessId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hours: editHours })
      })

      const data = await response.json()
      
      if (data.success) {
        setHours(data.data.hours)
        setEditing(false)
        await loadCurrentStatus()
      } else {
        setError(data.message || 'Failed to save business hours')
      }
    } catch (error) {
      console.error('Error saving hours:', error)
      setError('Failed to save business hours')
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusColor = () => {
    if (!currentStatus) return 'text-gray-500'
    return currentStatus.isOpen ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
          <ClockIcon className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit Hours
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Current Status */}
      {currentStatus && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <p className={`text-lg font-semibold ${getStatusColor()}`}>
                {currentStatus.status}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${currentStatus.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        </div>
      )}

      {/* Hours List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {(editing ? editHours : hours).map((dayHours, index) => (
          <div key={index} className={`p-4 ${index < 6 ? 'border-b border-gray-200' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20">
                  <span className="font-medium text-gray-900">{days[index]}</span>
                </div>
                
                {editing ? (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dayHours.is_open}
                        onChange={(e) => handleHourChange(index, 'is_open', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Open</span>
                    </label>
                    
                    {dayHours.is_open && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={dayHours.open_time || ''}
                            onChange={(e) => handleHourChange(index, 'open_time', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={dayHours.close_time || ''}
                            onChange={(e) => handleHourChange(index, 'close_time', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-500">Break:</span>
                          <input
                            type="time"
                            value={dayHours.break_start_time || ''}
                            onChange={(e) => handleHourChange(index, 'break_start_time', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Start"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={dayHours.break_end_time || ''}
                            onChange={(e) => handleHourChange(index, 'break_end_time', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="End"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex-1">
                    {dayHours.is_open ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-900">
                          {formatTime(dayHours.open_time)} - {formatTime(dayHours.close_time)}
                        </span>
                        {dayHours.break_start_time && dayHours.break_end_time && (
                          <span className="text-sm text-gray-500">
                            (Break: {formatTime(dayHours.break_start_time)} - {formatTime(dayHours.break_end_time)})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Closed</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      {editing && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for Setting Hours</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use 24-hour format for precise timing</li>
            <li>• Break times are optional but help customers know when you're unavailable</li>
            <li>• Uncheck "Open" for days when your business is closed</li>
            <li>• Consider different hours for weekends vs weekdays</li>
          </ul>
        </div>
      )}
    </div>
  )
}
