import { useState } from 'react'
import Layout from '../components/Layout/Layout'
import CustomDropdown, { SearchableDropdown, MultiSelectDropdown } from '../components/UI/CustomDropdown'
import { 
  MapPinIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  StarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

export default function DropdownDemo() {
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedServices, setSelectedServices] = useState([])
  const [searchableValue, setSearchableValue] = useState('')

  const locationOptions = [
    { value: 'all', label: '🇷🇼 All Rwanda' },
    { value: 'kigali', label: '🏙️ Kigali City' },
    { value: 'gasabo', label: '📍 Gasabo District' },
    { value: 'kicukiro', label: '📍 Kicukiro District' },
    { value: 'nyarugenge', label: '📍 Nyarugenge District' },
    { value: 'northern', label: '🏔️ Northern Province' },
    { value: 'southern', label: '🌄 Southern Province' },
    { value: 'eastern', label: '🌅 Eastern Province' },
    { value: 'western', label: '🌲 Western Province' }
  ]

  const categoryOptions = [
    { value: 'all', label: '🏢 All Categories' },
    { value: 'real-estate', label: '🏠 Real Estate' },
    { value: 'construction', label: '🏗️ Construction' },
    { value: 'maintenance', label: '🔧 Maintenance' },
    { value: 'design', label: '🎨 Design & Architecture' },
    { value: 'legal', label: '⚖️ Legal Services' },
    { value: 'financial', label: '💰 Financial Services' },
    { value: 'cleaning', label: '✨ Cleaning Services' },
    { value: 'security', label: '🛡️ Security Services' },
    { value: 'moving', label: '📦 Moving & Logistics' }
  ]

  const ratingOptions = [
    { value: 'all', label: '⭐ All Ratings' },
    { value: '5', label: '⭐⭐⭐⭐⭐ 5 Stars' },
    { value: '4', label: '⭐⭐⭐⭐ 4+ Stars' },
    { value: '3', label: '⭐⭐⭐ 3+ Stars' },
    { value: '2', label: '⭐⭐ 2+ Stars' }
  ]

  const serviceOptions = [
    { value: 'property-sales', label: 'Property Sales' },
    { value: 'property-rentals', label: 'Property Rentals' },
    { value: 'property-management', label: 'Property Management' },
    { value: 'construction', label: 'Construction Services' },
    { value: 'interior-design', label: 'Interior Design' },
    { value: 'legal-advice', label: 'Legal Consultation' },
    { value: 'property-valuation', label: 'Property Valuation' },
    { value: 'maintenance', label: 'Maintenance & Repairs' }
  ]

  return (
    <Layout
      title="Enhanced Dropdowns - ServiceRW"
      description="Showcase of enhanced dropdown components with Rwanda branding"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Enhanced Dropdowns
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Beautiful, accessible, and user-friendly dropdown components with Rwanda branding
            </p>
          </div>
        </div>
      </section>

      {/* Dropdown Examples */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dropdown Components
            </h2>
            <p className="text-xl text-gray-600">
              Enhanced UI components for better user experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Dropdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Standard Dropdown</h3>
              <p className="text-gray-600 mb-6">Clean, modern dropdown with icons and hover effects</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Location
                  </label>
                  <CustomDropdown
                    options={locationOptions}
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder="Choose a location in Rwanda"
                    icon={MapPinIcon}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Category
                  </label>
                  <CustomDropdown
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Choose a service category"
                    icon={BuildingOfficeIcon}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <CustomDropdown
                    options={ratingOptions}
                    value={selectedRating}
                    onChange={setSelectedRating}
                    placeholder="Select minimum rating"
                    icon={StarIcon}
                  />
                </div>
              </div>

              {/* Selected Values Display */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Selected Values:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Location:</strong> {selectedLocation || 'None'}</p>
                  <p><strong>Category:</strong> {selectedCategory || 'None'}</p>
                  <p><strong>Rating:</strong> {selectedRating || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Searchable Dropdown */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Searchable Dropdown</h3>
              <p className="text-gray-600 mb-6">Dropdown with built-in search functionality</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Categories
                  </label>
                  <SearchableDropdown
                    options={categoryOptions}
                    value={searchableValue}
                    onChange={setSearchableValue}
                    placeholder="Search and select category"
                    icon={FunnelIcon}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Multi-Select Services
                  </label>
                  <MultiSelectDropdown
                    options={serviceOptions}
                    values={selectedServices}
                    onChange={setSelectedServices}
                    placeholder="Select multiple services"
                    icon={UserGroupIcon}
                  />
                </div>
              </div>

              {/* Selected Values Display */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Selected Values:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Searchable:</strong> {searchableValue || 'None'}</p>
                  <p><strong>Multi-select:</strong> {selectedServices.length > 0 ? selectedServices.join(', ') : 'None'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Enhanced Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🎨',
                  title: 'Beautiful Design',
                  description: 'Modern, clean interface with Rwanda branding'
                },
                {
                  icon: '📱',
                  title: 'Mobile Responsive',
                  description: 'Optimized for all screen sizes and touch devices'
                },
                {
                  icon: '⚡',
                  title: 'Fast & Smooth',
                  description: 'Smooth animations and instant feedback'
                },
                {
                  icon: '♿',
                  title: 'Accessible',
                  description: 'Keyboard navigation and screen reader support'
                },
                {
                  icon: '🔍',
                  title: 'Searchable',
                  description: 'Built-in search for large option lists'
                },
                {
                  icon: '✅',
                  title: 'Multi-Select',
                  description: 'Select multiple options with visual feedback'
                },
                {
                  icon: '🎯',
                  title: 'Customizable',
                  description: 'Easy to customize colors, icons, and behavior'
                },
                {
                  icon: '🔧',
                  title: 'Developer Friendly',
                  description: 'Simple API and reusable components'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="mt-16 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Usage Example</h3>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`import CustomDropdown from '../components/UI/CustomDropdown'
import { MapPinIcon } from '@heroicons/react/24/outline'

const options = [
  { value: 'kigali', label: '🏙️ Kigali City' },
  { value: 'gasabo', label: '📍 Gasabo District' }
]

<CustomDropdown
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Choose location"
  icon={MapPinIcon}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
