import Link from 'next/link'
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">ServiceRW</span>
                <div className="text-xs text-gray-400 -mt-1">Real Estate Services</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Digitizing and connecting Rwanda's Real Estate Value Chain Players. 
              From property developers to maintenance services, we bring together 
              the entire ecosystem.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="text-lg">🇷🇼</span>
              <span>Proudly serving Rwanda</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Service Categories
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Blog & News
                </Link>
              </li>
            </ul>
          </div>

          {/* For Service Providers */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">For Providers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/register" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Join as Provider
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/provider-resources" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <div>Kigali, Rwanda</div>
                  <div className="text-sm text-gray-400">KG 123 St, Gasabo District</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">+250 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">info@servicerw.rw</span>
              </div>
              <div className="flex items-center space-x-3">
                <GlobeAltIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">www.servicerw.rw</span>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-white">Language / Ururimi</h4>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm">
                  English
                </button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-colors">
                  Kinyarwanda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 ServiceRW. All rights reserved. | Digitizing Rwanda's Real Estate Value Chain
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
