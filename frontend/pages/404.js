import Layout from '../components/Layout/Layout'
import Link from 'next/link'
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export default function Custom404() {
  const popularLinks = [
    { name: 'Browse Services', href: '/businesses', icon: BuildingOfficeIcon },
    { name: 'Service Categories', href: '/categories', icon: MagnifyingGlassIcon },
    { name: 'About Us', href: '/about', icon: HomeIcon },
  ]

  return (
    <Layout
      title="Page Not Found - ServiceRW"
      description="The page you're looking for doesn't exist. Explore Rwanda's premier real estate service platform."
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              {/* Large 404 */}
              <div className="text-8xl md:text-9xl font-bold text-primary-200 select-none">
                404
              </div>
              
              {/* Rwanda Flag Emoji */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-4xl">🇷🇼</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-base text-gray-500">
              <span className="font-medium">Ntabwo urupapuro rwabonetse</span> - Let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Back to Homepage
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/categories"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                Browse Categories
              </Link>
              <Link
                href="/businesses"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-white text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
              >
                Find Services
              </Link>
            </div>
          </div>

          {/* Popular Links */}
          <div className="border-t border-primary-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Pages
            </h2>
            <div className="space-y-3">
              {popularLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-center px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary-200 group"
                >
                  <link.icon className="h-5 w-5 text-primary-500 mr-3 group-hover:text-primary-600" />
                  <span className="text-gray-700 group-hover:text-primary-600 font-medium">
                    {link.name}
                  </span>
                  <svg 
                    className="h-4 w-4 text-gray-400 ml-auto group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Still can't find what you're looking for?{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
