import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout'
import { getBusinessUrl } from '../../utils/slugify'
import { 
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  PaintBrushIcon,
  TruckIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function CategoryPage() {
  const router = useRouter()
  const { slug } = router.query
  const [category, setCategory] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Category data with slugs
  const categories = {
    'real-estate': {
      id: 1,
      slug: 'real-estate',
      name: 'Real Estate',
      name_rw: 'Imitungo',
      description: 'Property sales, rentals, and management services across Rwanda',
      icon: HomeIcon,
      color: 'from-blue-500 to-blue-600',
      subcategories: [
        'Property Sales', 'Property Rentals', 'Property Management', 
        'Property Valuation', 'Real Estate Agents', 'Property Investment'
      ]
    },
    'construction': {
      id: 2,
      slug: 'construction',
      name: 'Construction',
      name_rw: 'Ubwubatsi',
      description: 'Building, renovation, and construction services',
      icon: BuildingOfficeIcon,
      color: 'from-orange-500 to-orange-600',
      subcategories: [
        'Residential Construction', 'Commercial Building', 'Renovation', 
        'Infrastructure', 'Road Construction', 'Bridge Construction'
      ]
    },
    'maintenance-repair': {
      id: 3,
      slug: 'maintenance-repair',
      name: 'Maintenance & Repair',
      name_rw: 'Kubungabunga',
      description: 'Property maintenance and repair services',
      icon: WrenchScrewdriverIcon,
      color: 'from-green-500 to-green-600',
      subcategories: [
        'Plumbing Services', 'Electrical Work', 'HVAC Systems', 
        'General Repairs', 'Appliance Repair', 'Roofing'
      ]
    },
    'legal-financial': {
      id: 4,
      slug: 'legal-financial',
      name: 'Legal & Financial',
      name_rw: 'Amategeko n\'Imari',
      description: 'Legal advice and financial services for real estate',
      icon: ScaleIcon,
      color: 'from-purple-500 to-purple-600',
      subcategories: [
        'Property Law', 'Legal Consultation', 'Property Financing', 
        'Insurance Services', 'Tax Advisory', 'Contract Review'
      ]
    },
    'design-architecture': {
      id: 5,
      slug: 'design-architecture',
      name: 'Design & Architecture',
      name_rw: 'Igishushanyo',
      description: 'Architectural and interior design services',
      icon: PaintBrushIcon,
      color: 'from-pink-500 to-pink-600',
      subcategories: [
        'Architecture', 'Interior Design', 'Landscape Design', 
        '3D Modeling', 'Urban Planning', 'Structural Engineering'
      ]
    },
    'moving-logistics': {
      id: 6,
      slug: 'moving-logistics',
      name: 'Moving & Logistics',
      name_rw: 'Kwimura',
      description: 'Moving and transportation services',
      icon: TruckIcon,
      color: 'from-indigo-500 to-indigo-600',
      subcategories: [
        'Residential Moving', 'Commercial Moving', 'Storage Services', 
        'Logistics', 'Packing Services', 'International Moving'
      ]
    },
    'technology-proptech': {
      id: 7,
      slug: 'technology-proptech',
      name: 'Technology & PropTech',
      name_rw: 'Ikoranabuhanga',
      description: 'PropTech and smart home solutions',
      icon: ComputerDesktopIcon,
      color: 'from-cyan-500 to-cyan-600',
      subcategories: [
        'Smart Home Systems', 'Property Software', 'Security Systems', 
        'IoT Solutions', 'Property Apps', 'Virtual Tours'
      ]
    },
    'education-training': {
      id: 8,
      slug: 'education-training',
      name: 'Education & Training',
      name_rw: 'Kwigisha',
      description: 'Real estate education and professional training',
      icon: AcademicCapIcon,
      color: 'from-yellow-500 to-yellow-600',
      subcategories: [
        'Real Estate Courses', 'Professional Training', 'Certification Programs', 
        'Workshops', 'Seminars', 'Online Learning'
      ]
    },
    'cleaning-services': {
      id: 9,
      slug: 'cleaning-services',
      name: 'Cleaning Services',
      name_rw: 'Gusukura',
      description: 'Professional cleaning and maintenance services',
      icon: SparklesIcon,
      color: 'from-teal-500 to-teal-600',
      subcategories: [
        'House Cleaning', 'Office Cleaning', 'Deep Cleaning', 
        'Window Cleaning', 'Carpet Cleaning', 'Post-Construction Cleanup'
      ]
    },
    'security-services': {
      id: 10,
      slug: 'security-services',
      name: 'Security Services',
      name_rw: 'Umutekano',
      description: 'Property security and safety services',
      icon: ShieldCheckIcon,
      color: 'from-red-500 to-red-600',
      subcategories: [
        'Security Guards', 'CCTV Installation', 'Alarm Systems', 
        'Access Control', 'Fire Safety', 'Emergency Response'
      ]
    },
    'material-suppliers': {
      id: 11,
      slug: 'material-suppliers',
      name: 'Material Suppliers',
      name_rw: 'Abatanga Ibikoresho',
      description: 'Construction and building material suppliers',
      icon: CurrencyDollarIcon,
      color: 'from-emerald-500 to-emerald-600',
      subcategories: [
        'Building Materials', 'Hardware Supplies', 'Electrical Supplies', 
        'Plumbing Materials', 'Paint & Finishes', 'Tools & Equipment'
      ]
    },
    'government-services': {
      id: 12,
      slug: 'government-services',
      name: 'Government Services',
      name_rw: 'Serivisi za Leta',
      description: 'Government and regulatory services',
      icon: DocumentTextIcon,
      color: 'from-slate-500 to-slate-600',
      subcategories: [
        'Building Permits', 'Land Registration', 'Property Taxes', 
        'Zoning Information', 'Environmental Clearance', 'Utility Connections'
      ]
    }
  }

  // Sample businesses for each category (using slugs as keys)
  const categoryBusinesses = {
    'real-estate': [
      {
        id: 2,
        business_name: 'Rwanda Property Management',
        category: 'Real Estate',
        description: 'Professional property management services for residential and commercial properties.',
        location: 'Kigali City',
        phone: '+250 788 234 567',
        email: 'contact@rwandaproperty.rw',
        rating: 4.6,
        reviews_count: 18,
        verified: true
      },
      {
        id: 6,
        business_name: 'Kigali Real Estate Agency',
        category: 'Real Estate',
        description: 'Leading real estate agency specializing in property sales and rentals in Kigali.',
        location: 'Kigali City',
        phone: '+250 788 345 678',
        email: 'info@kigalirealestate.rw',
        rating: 4.7,
        reviews_count: 32,
        verified: true
      }
    ],
    'construction': [
      {
        id: 1,
        business_name: 'Kigali Construction Ltd',
        category: 'Construction',
        description: 'Leading construction company specializing in residential and commercial buildings across Rwanda.',
        location: 'Kigali City',
        phone: '+250 788 123 456',
        email: 'info@kigaliconstruction.rw',
        rating: 4.8,
        reviews_count: 24,
        verified: true
      },
      {
        id: 7,
        business_name: 'Rwanda Builders Co.',
        category: 'Construction',
        description: 'Experienced construction company focusing on sustainable building practices.',
        location: 'Gasabo District',
        phone: '+250 788 456 789',
        email: 'contact@rwandabuilders.rw',
        rating: 4.5,
        reviews_count: 16,
        verified: true
      }
    ],
    'maintenance-repair': [
      {
        id: 4,
        business_name: 'Gasabo Maintenance Services',
        category: 'Maintenance',
        description: 'Comprehensive maintenance and repair services for residential and commercial properties.',
        location: 'Gasabo District',
        phone: '+250 788 456 789',
        email: 'service@gasabomaintenance.rw',
        rating: 4.5,
        reviews_count: 12,
        verified: false
      }
    ],
    'legal-financial': [
      {
        id: 5,
        business_name: 'Rwanda Legal Advisors',
        category: 'Legal',
        description: 'Expert legal services for real estate transactions, property law, and regulatory compliance.',
        location: 'Kigali City',
        phone: '+250 788 567 890',
        email: 'legal@rwandalegal.rw',
        rating: 4.7,
        reviews_count: 22,
        verified: true
      }
    ],
    'design-architecture': [
      {
        id: 3,
        business_name: 'Elite Interior Design',
        category: 'Design',
        description: 'Modern interior design solutions for homes and offices with Rwandan cultural elements.',
        location: 'Kigali City',
        phone: '+250 788 345 678',
        email: 'hello@elitedesign.rw',
        rating: 4.9,
        reviews_count: 31,
        verified: true
      }
    ],
    'moving-logistics': [
      {
        id: 8,
        business_name: 'Rwanda Moving Services',
        category: 'Moving',
        description: 'Professional moving and logistics services for residential and commercial relocations.',
        location: 'Kigali City',
        phone: '+250 788 678 901',
        email: 'info@rwandamoving.rw',
        rating: 4.4,
        reviews_count: 15,
        verified: true
      }
    ],
    'technology-proptech': [
      {
        id: 9,
        business_name: 'Smart Home Rwanda',
        category: 'Technology',
        description: 'Cutting-edge smart home and PropTech solutions for modern properties.',
        location: 'Kigali City',
        phone: '+250 788 789 012',
        email: 'tech@smarthomerwanda.rw',
        rating: 4.6,
        reviews_count: 8,
        verified: true
      }
    ],
    'education-training': [
      {
        id: 10,
        business_name: 'Rwanda Real Estate Institute',
        category: 'Education',
        description: 'Professional real estate education and certification programs.',
        location: 'Kigali City',
        phone: '+250 788 890 123',
        email: 'info@rrei.rw',
        rating: 4.8,
        reviews_count: 42,
        verified: true
      }
    ],
    'cleaning-services': [
      {
        id: 11,
        business_name: 'Crystal Clean Rwanda',
        category: 'Cleaning',
        description: 'Professional cleaning services for homes, offices, and commercial properties.',
        location: 'Kigali City',
        phone: '+250 788 901 234',
        email: 'clean@crystalclean.rw',
        rating: 4.7,
        reviews_count: 28,
        verified: true
      }
    ],
    'security-services': [
      {
        id: 12,
        business_name: 'Rwanda Security Solutions',
        category: 'Security',
        description: 'Comprehensive security services and systems for property protection.',
        location: 'Kigali City',
        phone: '+250 788 012 345',
        email: 'security@rwandasecurity.rw',
        rating: 4.5,
        reviews_count: 19,
        verified: true
      }
    ],
    'material-suppliers': [
      {
        id: 13,
        business_name: 'Kigali Building Supplies',
        category: 'Materials',
        description: 'Complete range of construction and building materials for all your projects.',
        location: 'Kigali City',
        phone: '+250 788 123 456',
        email: 'supplies@kigalibuilding.rw',
        rating: 4.3,
        reviews_count: 35,
        verified: true
      }
    ],
    'government-services': [
      {
        id: 14,
        business_name: 'Rwanda Development Board',
        category: 'Government',
        description: 'Official government services for business registration and development permits.',
        location: 'Kigali City',
        phone: '+250 252 580 000',
        email: 'info@rdb.rw',
        rating: 4.1,
        reviews_count: 67,
        verified: true
      }
    ]
  }

  useEffect(() => {
    if (slug) {
      const categoryData = categories[slug]
      const businessData = categoryBusinesses[slug] || []
      
      setCategory(categoryData)
      setBusinesses(businessData)
      setLoading(false)
    }
  }, [slug])

  const filteredBusinesses = businesses.filter(business =>
    business.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Layout title="Loading... - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading category...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!category) {
    return (
      <Layout title="Category Not Found - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Categories
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const IconComponent = category.icon

  return (
    <Layout
      title={`${category.name} Services - ServiceRW`}
      description={`Find the best ${category.name.toLowerCase()} services in Rwanda. ${category.description}`}
      keywords={`${category.name}, Rwanda, ${category.subcategories.join(', ')}`}
    >
      {/* Header */}
      <section className={`bg-gradient-to-br ${category.color} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Categories
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mr-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {category.name}
                  </h1>
                  <p className="text-white/80 text-lg">
                    {category.name_rw}
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {category.subcategories.slice(0, 4).map((sub, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                  >
                    {sub}
                  </span>
                ))}
                {category.subcategories.length > 4 && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    +{category.subcategories.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${category.name.toLowerCase()} services...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredBusinesses.length} {category.name} {filteredBusinesses.length === 1 ? 'Service' : 'Services'} Found
              </h2>
              <p className="text-gray-600">
                Verified professionals in {category.name.toLowerCase()} across Rwanda
              </p>
            </div>
            <Link
              href="/businesses"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              View All Services
            </Link>
          </div>

          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mr-2 truncate">
                            {business.business_name}
                          </h3>
                          {business.verified && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-primary-600 font-semibold text-sm mb-2">
                          {business.category}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{business.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {business.description}
                    </p>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-4 w-4 ${
                              index < Math.floor(business.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {business.rating}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({business.reviews_count} reviews)
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-2 text-primary-500 flex-shrink-0" />
                        <span className="truncate">{business.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-primary-500 flex-shrink-0" />
                        <span className="truncate">{business.email}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          window.open(`mailto:${business.email}?subject=Inquiry about ${business.business_name}&body=Hello, I'm interested in your ${category.name.toLowerCase()} services.`, '_blank')
                        }}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Contact
                      </button>
                      <Link
                        href={getBusinessUrl(business.business_name)}
                        className="flex-1 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <IconComponent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No ${category.name.toLowerCase()} services match your search "${searchQuery}"`
                  : `No ${category.name.toLowerCase()} services available yet`
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Related Service Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(categories).filter(cat => cat.slug !== category.slug).slice(0, 4).map((relatedCategory) => {
              const RelatedIcon = relatedCategory.icon
              return (
                <Link
                  key={relatedCategory.slug}
                  href={`/categories/${relatedCategory.slug}`}
                  className="group p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${relatedCategory.color} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <RelatedIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                    {relatedCategory.name}
                  </h4>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}
