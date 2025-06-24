import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout'
import AnalyticsDashboard from '../../components/Business/AnalyticsDashboard'
import ServicesManager from '../../components/Business/ServicesManager'
import ImageUpload from '../../components/Business/ImageUpload'
import BusinessHours from '../../components/Business/BusinessHours'
import ReviewResponse from '../../components/Business/ReviewResponse'
import {
  BuildingOfficeIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowUpIcon,
  CalendarIcon,
  PhotoIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

export default function BusinessDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if user is authenticated and is a business user
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const userData = localStorage.getItem('user')
    
    if (!isAuthenticated || !userData) {
      router.push('/auth/login?redirect=/business/dashboard')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'business') {
        router.push('/profile') // Redirect non-business users to regular profile
        return
      }
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('rememberMe')
    router.push('/')
  }

  // Sample analytics data
  const analyticsData = {
    profileViews: 156,
    contactRequests: 23,
    averageRating: 4.7,
    totalReviews: 18,
    monthlyGrowth: 12.5
  }

  const recentActivity = [
    {
      id: 1,
      type: 'view',
      title: 'Profile viewed by John Doe',
      date: '2024-01-15T10:30:00Z',
      icon: EyeIcon,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'contact',
      title: 'Contact request from Sarah Smith',
      date: '2024-01-14T15:45:00Z',
      icon: PhoneIcon,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-star review received',
      date: '2024-01-13T09:20:00Z',
      icon: StarIcon,
      color: 'text-yellow-500'
    },
    {
      id: 4,
      type: 'email',
      title: 'Email inquiry about construction project',
      date: '2024-01-12T14:15:00Z',
      icon: EnvelopeIcon,
      color: 'text-purple-500'
    }
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: 'Update business description',
      priority: 'high',
      dueDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Respond to customer reviews',
      priority: 'medium',
      dueDate: '2024-01-18'
    },
    {
      id: 3,
      title: 'Upload project photos',
      priority: 'low',
      dueDate: '2024-01-25'
    }
  ]

  if (loading) {
    return (
      <Layout title="Loading Dashboard... - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout
      title={`${user.businessName} - Business Dashboard - ServiceRW`}
      description="Manage your business profile, view analytics, and track customer interactions."
      keywords="business dashboard, analytics, ServiceRW business"
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.businessName}</h1>
                  <p className="text-primary-100">{user.businessCategory}</p>
                  <div className="flex items-center mt-1">
                    {user.verified ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Verified Business
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                        <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                        Pending Verification
                      </span>
                    )}
                    <span className="ml-3 text-primary-100 text-sm">
                      {user.businessLocation}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/${user.businessCategory}/${user.businessSlug}`}
                  className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Public Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'analytics', name: 'Analytics', icon: ArrowUpIcon },
                { id: 'services', name: 'Services', icon: WrenchScrewdriverIcon },
                { id: 'images', name: 'Images', icon: PhotoIcon },
                { id: 'hours', name: 'Hours', icon: ClockIcon },
                { id: 'reviews', name: 'Reviews', icon: ChatBubbleLeftRightIcon },
                { id: 'customers', name: 'Customers', icon: UserGroupIcon },
                { id: 'profile', name: 'Profile', icon: PencilIcon },
                { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <EyeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Profile Views</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.profileViews}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <PhoneIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Contact Requests</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.contactRequests}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <StarIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.averageRating}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <ArrowUpIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Monthly Growth</p>
                      <p className="text-2xl font-bold text-gray-900">+{analyticsData.monthlyGrowth}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <div className="p-2 bg-gray-100 rounded-full mr-4">
                          <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tasks</h2>
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                          <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard businessId={user?.businessId || 'demo-business-id'} />
          )}

          {activeTab === 'services' && (
            <ServicesManager businessId={user?.businessId || 'demo-business-id'} isOwner={true} />
          )}

          {activeTab === 'images' && (
            <div className="space-y-8">
              <ImageUpload businessId={user?.businessId || 'demo-business-id'} imageType="logo" isOwner={true} />
              <ImageUpload businessId={user?.businessId || 'demo-business-id'} imageType="cover" isOwner={true} />
              <ImageUpload businessId={user?.businessId || 'demo-business-id'} imageType="gallery" isOwner={true} />
            </div>
          )}

          {activeTab === 'hours' && (
            <BusinessHours businessId={user?.businessId || 'demo-business-id'} isOwner={true} />
          )}

          {activeTab === 'reviews' && (
            <ReviewResponse businessId={user?.businessId || 'demo-business-id'} isOwner={true} />
          )}

          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Interactions</h2>
              <div className="text-center py-12">
                <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Business Management</h3>
                <p className="text-gray-600 mb-6">Manage your business listings and customer interactions.</p>
                <div className="space-y-3 max-w-sm mx-auto">
                  <Link
                    href="/business/manage"
                    className="block w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Manage Businesses
                  </Link>
                  <Link
                    href="/business/create"
                    className="block w-full px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Add New Business
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Business Profile</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    defaultValue={user.businessName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                  <textarea
                    rows={4}
                    defaultValue={user.businessDescription}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      defaultValue={user.businessCategory}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="construction">Construction</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="maintenance-repair">Maintenance & Repair</option>
                      <option value="legal-financial">Legal & Financial</option>
                      <option value="design-architecture">Design & Architecture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      defaultValue={user.businessLocation}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Kigali City">Kigali City</option>
                      <option value="Gasabo District">Gasabo District</option>
                      <option value="Kicukiro District">Kicukiro District</option>
                      <option value="Nyarugenge District">Nyarugenge District</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <input
                    type="text"
                    defaultValue={user.businessAddress}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    defaultValue={user.businessWebsite}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="pt-4">
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Business Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">Email notifications for new inquiries</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">SMS notifications for urgent requests</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-gray-700">Weekly analytics reports</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Business Visibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">Show business in search results</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">Allow customer reviews</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-gray-700">Display contact information publicly</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
