import { useState, useEffect } from 'react'
import {
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function AnalyticsDashboard({ businessId }) {
  const [analytics, setAnalytics] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('30') // days

  useEffect(() => {
    if (businessId) {
      loadAnalytics()
    }
  }, [businessId, timeRange])

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const [analyticsResponse, performanceResponse] = await Promise.all([
        fetch(`http://localhost:3001/api/v1/business-analytics/${businessId}/overview`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:3001/api/v1/business-analytics/${businessId}/performance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const analyticsData = await analyticsResponse.json()
      const performanceData = await performanceResponse.json()

      if (analyticsData.success) {
        setAnalytics(analyticsData.data)
      }

      if (performanceData.success) {
        setPerformance(performanceData.data)
      }

      if (!analyticsData.success && !performanceData.success) {
        setError('Failed to load analytics data')
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num?.toString() || '0'
  }

  const formatPercentage = (num) => {
    return `${num >= 0 ? '+' : ''}${num}%`
  }

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    } else if (growth < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    }
    return <ChartBarIcon className="h-4 w-4 text-gray-400" />
  }

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Business Analytics</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.monthlyStats?.totalPageViews || performance?.monthlyViews || 0)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {analytics?.growthStats && (
            <div className="flex items-center mt-2">
              {getGrowthIcon(analytics.growthStats.monthlyViewsGrowth)}
              <span className={`text-sm ml-1 ${getGrowthColor(analytics.growthStats.monthlyViewsGrowth)}`}>
                {formatPercentage(analytics.growthStats.monthlyViewsGrowth)} from last month
              </span>
            </div>
          )}
        </div>

        {/* Total Contacts */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics?.monthlyStats?.totalContactClicks || performance?.monthlyContacts || 0)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          {analytics?.growthStats && (
            <div className="flex items-center mt-2">
              {getGrowthIcon(analytics.growthStats.monthlyContactsGrowth)}
              <span className={`text-sm ml-1 ${getGrowthColor(analytics.growthStats.monthlyContactsGrowth)}`}>
                {formatPercentage(analytics.growthStats.monthlyContactsGrowth)} from last month
              </span>
            </div>
          )}
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.summary?.conversionRate || performance?.conversionRate || 0}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Views to contacts ratio
          </p>
        </div>

        {/* Average Daily Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Daily Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analytics?.monthlyStats?.avgDailyViews || performance?.avgDailyViews || 0)}
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Based on {timeRange} days
          </p>
        </div>
      </div>

      {/* Detailed Metrics */}
      {performance && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Breakdown */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Contact Actions</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone Clicks</span>
                  <span className="text-sm font-medium">{analytics?.monthlyStats?.totalPhoneClicks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email Clicks</span>
                  <span className="text-sm font-medium">{analytics?.monthlyStats?.totalEmailClicks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Website Clicks</span>
                  <span className="text-sm font-medium">{analytics?.monthlyStats?.totalWebsiteClicks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Directions</span>
                  <span className="text-sm font-medium">{analytics?.monthlyStats?.totalDirectionRequests || 0}</span>
                </div>
              </div>
            </div>

            {/* Search Performance */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Search Performance</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Search Appearances</span>
                  <span className="text-sm font-medium">{performance.searchAppearances}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Search Clicks</span>
                  <span className="text-sm font-medium">{performance.searchClicks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Click-through Rate</span>
                  <span className="text-sm font-medium">{performance.searchCTR}%</span>
                </div>
              </div>
            </div>

            {/* Business Health */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Business Health</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="text-sm font-medium">{performance.rating.toFixed(1)} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="text-sm font-medium">{performance.reviewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium">{performance.responseRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="text-sm font-medium">
                    {performance.avgResponseTime > 60 
                      ? `${Math.round(performance.avgResponseTime / 60)}h` 
                      : `${performance.avgResponseTime}m`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips for Improvement */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips to Improve Performance</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {performance?.conversionRate < 5 && (
            <li>• Add more detailed service descriptions and clear contact information</li>
          )}
          {performance?.responseRate < 80 && (
            <li>• Respond to customer inquiries faster to improve response rate</li>
          )}
          {performance?.rating < 4.5 && (
            <li>• Focus on customer satisfaction to improve your rating</li>
          )}
          {performance?.searchCTR < 10 && (
            <li>• Optimize your business description and add more keywords</li>
          )}
        </ul>
      </div>
    </div>
  )
}
