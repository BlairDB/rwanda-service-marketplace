import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout/Layout'
import ServicesManager from '../../components/Business/ServicesManager'
import ContactForm from '../../components/Business/ContactForm'
import { 
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function BusinessProfile() {
  const router = useRouter()
  const { category, business } = router.query
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Category slug to display name mapping
  const categoryNames = {
    'construction': 'Construction',
    'real-estate': 'Real Estate',
    'maintenance': 'Maintenance',
    'legal': 'Legal',
    'design': 'Design',
    'moving': 'Moving',
    'technology': 'Technology',
    'education': 'Education',
    'cleaning': 'Cleaning',
    'security': 'Security',
    'materials': 'Materials',
    'government': 'Government'
  }

  // Sample business data organized by category and business slug
  const businessesByCategory = {
    'construction': {
      'kigali-construction-ltd': {
        id: 1,
        slug: 'kigali-construction-ltd',
        business_name: 'Kigali Construction Ltd',
        category: 'Construction',
        description: 'Leading construction company specializing in residential and commercial buildings across Rwanda. We have over 15 years of experience in delivering high-quality construction projects.',
        long_description: 'Kigali Construction Ltd is Rwanda\'s premier construction company, established in 2008. We specialize in residential and commercial construction, renovation, and infrastructure development. Our team of experienced engineers and skilled workers has successfully completed over 200 projects across Rwanda, including luxury homes, office buildings, schools, and hospitals.',
        location: 'Kigali City',
        address: 'KG 123 Street, Gasabo District, Kigali',
        phone: '+250 788 123 456',
        email: 'info@kigaliconstruction.rw',
        website: 'www.kigaliconstruction.rw',
        rating: 4.8,
        reviews_count: 24,
        verified: true,
        founded: '2008',
        employees: '50-100',
        services: [
          'Residential Construction',
          'Commercial Buildings',
          'Renovation & Remodeling',
          'Infrastructure Development',
          'Project Management',
          'Architectural Design'
        ],
        portfolio: [
          { name: 'Kigali Heights Apartments', type: 'Residential', year: '2023' },
          { name: 'Rwanda Business Center', type: 'Commercial', year: '2022' },
          { name: 'Green Valley School', type: 'Educational', year: '2021' }
        ]
      },
      'rwanda-builders-co': {
        id: 7,
        slug: 'rwanda-builders-co',
        business_name: 'Rwanda Builders Co.',
        category: 'Construction',
        description: 'Experienced construction company focusing on sustainable building practices.',
        long_description: 'Rwanda Builders Co. is committed to sustainable construction practices and green building solutions. We combine traditional building techniques with modern technology to create environmentally friendly structures.',
        location: 'Gasabo District',
        address: 'KG 147 Road, Gasabo District, Kigali',
        phone: '+250 788 456 789',
        email: 'contact@rwandabuilders.rw',
        website: 'www.rwandabuilders.rw',
        rating: 4.5,
        reviews_count: 16,
        verified: true,
        founded: '2016',
        employees: '25-50',
        services: [
          'Sustainable Construction',
          'Green Building',
          'Renovation',
          'Project Management',
          'Environmental Consulting',
          'Building Certification'
        ],
        portfolio: [
          { name: 'Eco-Friendly Office Complex', type: 'Commercial', year: '2023' },
          { name: 'Solar-Powered Residential', type: 'Residential', year: '2022' }
        ]
      }
    },
    'real-estate': {
      'rwanda-property-management': {
        id: 2,
        slug: 'rwanda-property-management',
        business_name: 'Rwanda Property Management',
        category: 'Real Estate',
        description: 'Professional property management services for residential and commercial properties.',
        long_description: 'Rwanda Property Management offers comprehensive property management solutions for property owners across Rwanda. Our services include tenant screening, rent collection, maintenance coordination, and property marketing.',
        location: 'Kigali City',
        address: 'KG 456 Avenue, Nyarugenge District, Kigali',
        phone: '+250 788 234 567',
        email: 'contact@rwandaproperty.rw',
        website: 'www.rwandaproperty.rw',
        rating: 4.6,
        reviews_count: 18,
        verified: true,
        founded: '2015',
        employees: '10-25',
        services: [
          'Property Management',
          'Tenant Screening',
          'Rent Collection',
          'Maintenance Coordination',
          'Property Marketing',
          'Investment Consulting'
        ],
        portfolio: [
          { name: 'Kimisagara Apartments', type: 'Residential', year: '2023' },
          { name: 'City Plaza Offices', type: 'Commercial', year: '2022' }
        ]
      },
      'kigali-real-estate-agency': {
        id: 6,
        slug: 'kigali-real-estate-agency',
        business_name: 'Kigali Real Estate Agency',
        category: 'Real Estate',
        description: 'Leading real estate agency specializing in property sales and rentals in Kigali.',
        long_description: 'Kigali Real Estate Agency is one of the most trusted real estate agencies in Rwanda, with extensive experience in property sales, rentals, and investment advisory. We help clients find their perfect property match.',
        location: 'Kigali City',
        address: 'KG 987 Street, Gasabo District, Kigali',
        phone: '+250 788 345 678',
        email: 'info@kigalirealestate.rw',
        website: 'www.kigalirealestate.rw',
        rating: 4.7,
        reviews_count: 32,
        verified: true,
        founded: '2010',
        employees: '20-40',
        services: [
          'Property Sales',
          'Property Rentals',
          'Investment Advisory',
          'Property Valuation',
          'Market Analysis',
          'Client Consultation'
        ],
        portfolio: [
          { name: 'Luxury Apartments Sale', type: 'Sales', year: '2023' },
          { name: 'Commercial Space Rental', type: 'Rental', year: '2023' }
        ]
      }
    },
    'design': {
      'elite-interior-design': {
        id: 3,
        slug: 'elite-interior-design',
        business_name: 'Elite Interior Design',
        category: 'Design',
        description: 'Modern interior design solutions for homes and offices with Rwandan cultural elements.',
        long_description: 'Elite Interior Design brings together modern design principles with traditional Rwandan aesthetics to create unique and beautiful spaces. Our team of experienced designers works closely with clients to understand their vision and bring it to life.',
        location: 'Kigali City',
        address: 'KG 789 Road, Kicukiro District, Kigali',
        phone: '+250 788 345 678',
        email: 'hello@elitedesign.rw',
        website: 'www.elitedesign.rw',
        rating: 4.9,
        reviews_count: 31,
        verified: true,
        founded: '2018',
        employees: '15-30',
        services: [
          'Interior Design',
          'Space Planning',
          'Furniture Selection',
          'Color Consultation',
          'Lighting Design',
          'Project Management'
        ],
        portfolio: [
          { name: 'Modern Villa Nyarutarama', type: 'Residential', year: '2023' },
          { name: 'Tech Hub Office Space', type: 'Commercial', year: '2023' },
          { name: 'Boutique Hotel Lobby', type: 'Hospitality', year: '2022' }
        ]
      }
    },
    'maintenance': {
      'gasabo-maintenance-services': {
        id: 4,
        slug: 'gasabo-maintenance-services',
        business_name: 'Gasabo Maintenance Services',
        category: 'Maintenance',
        description: 'Comprehensive maintenance and repair services for residential and commercial properties.',
        long_description: 'Gasabo Maintenance Services provides reliable and professional maintenance solutions for properties across Gasabo District and greater Kigali. Our skilled technicians handle everything from routine maintenance to emergency repairs.',
        location: 'Gasabo District',
        address: 'KG 321 Street, Gasabo District, Kigali',
        phone: '+250 788 456 789',
        email: 'service@gasabomaintenance.rw',
        website: 'www.gasabomaintenance.rw',
        rating: 4.5,
        reviews_count: 12,
        verified: false,
        founded: '2020',
        employees: '5-15',
        services: [
          'Plumbing Services',
          'Electrical Repairs',
          'HVAC Maintenance',
          'General Repairs',
          'Emergency Services',
          'Preventive Maintenance'
        ],
        portfolio: [
          { name: 'Residential Complex Maintenance', type: 'Residential', year: '2023' },
          { name: 'Office Building HVAC', type: 'Commercial', year: '2022' }
        ]
      }
    },
    'legal': {
      'rwanda-legal-advisors': {
        id: 5,
        slug: 'rwanda-legal-advisors',
        business_name: 'Rwanda Legal Advisors',
        category: 'Legal',
        description: 'Expert legal services for real estate transactions, property law, and regulatory compliance.',
        long_description: 'Rwanda Legal Advisors specializes in real estate law and provides comprehensive legal services for property transactions, development projects, and regulatory compliance. Our experienced lawyers ensure all legal aspects are properly handled.',
        location: 'Kigali City',
        address: 'KG 654 Avenue, Nyarugenge District, Kigali',
        phone: '+250 788 567 890',
        email: 'legal@rwandalegal.rw',
        website: 'www.rwandalegal.rw',
        rating: 4.7,
        reviews_count: 22,
        verified: true,
        founded: '2012',
        employees: '8-20',
        services: [
          'Property Law',
          'Legal Consultation',
          'Contract Review',
          'Due Diligence',
          'Regulatory Compliance',
          'Dispute Resolution'
        ],
        portfolio: [
          { name: 'Commercial Property Acquisition', type: 'Legal', year: '2023' },
          { name: 'Residential Development Legal', type: 'Legal', year: '2022' }
        ]
      }
    },
    'moving': {
      'rwanda-moving-services': {
        id: 8,
        slug: 'rwanda-moving-services',
        business_name: 'Rwanda Moving Services',
        category: 'Moving',
        description: 'Professional moving and logistics services for residential and commercial relocations.',
        long_description: 'Rwanda Moving Services provides comprehensive moving solutions for individuals and businesses. Our experienced team ensures safe and efficient relocation services across Rwanda and internationally.',
        location: 'Kigali City',
        address: 'KG 258 Avenue, Kicukiro District, Kigali',
        phone: '+250 788 678 901',
        email: 'info@rwandamoving.rw',
        website: 'www.rwandamoving.rw',
        rating: 4.4,
        reviews_count: 15,
        verified: true,
        founded: '2019',
        employees: '10-25',
        services: [
          'Residential Moving',
          'Commercial Moving',
          'Packing Services',
          'Storage Solutions',
          'International Moving',
          'Logistics Consulting'
        ],
        portfolio: [
          { name: 'Corporate Office Relocation', type: 'Commercial', year: '2023' },
          { name: 'International Family Move', type: 'International', year: '2022' }
        ]
      }
    }
  }

  useEffect(() => {
    if (category && business) {
      // Simulate API call
      setTimeout(() => {
        const categoryData = businessesByCategory[category]
        const businessInfo = categoryData ? categoryData[business] : null
        setBusinessData(businessInfo)
        setLoading(false)
      }, 500)
    }
  }, [category, business])

  if (loading) {
    return (
      <Layout title="Loading... - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading business profile...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!businessData) {
    return (
      <Layout title="Business Not Found - ServiceRW">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
            <p className="text-gray-600 mb-6">The business profile you're looking for doesn't exist.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/businesses"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Businesses
              </Link>
              {category && categoryNames[category] && (
                <Link
                  href={`/categories/${category}`}
                  className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  View {categoryNames[category]} Services
                </Link>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={`${businessData.business_name} - ${businessData.category} Services - ServiceRW`}
      description={businessData.description}
      keywords={`${businessData.business_name}, ${businessData.category}, Rwanda, ${businessData.location}`}
    >
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/businesses"
              className="inline-flex items-center text-primary-100 hover:text-white transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Businesses
            </Link>
            {category && categoryNames[category] && (
              <>
                <span className="text-primary-100 mx-2">•</span>
                <Link
                  href={`/categories/${category}`}
                  className="inline-flex items-center text-primary-100 hover:text-white transition-colors"
                >
                  {categoryNames[category]} Services
                </Link>
              </>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold mr-4">
                  {businessData.business_name}
                </h1>
                {businessData.verified && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-primary-100 mb-4">
                <span className="inline-flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  {businessData.category}
                </span>
                <span className="inline-flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {businessData.location}
                </span>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.floor(businessData.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{businessData.rating}</span>
                  <span className="ml-1">({businessData.reviews_count} reviews)</span>
                </div>
              </div>
              
              <p className="text-xl text-primary-100 leading-relaxed">
                {businessData.description}
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:ml-8 flex gap-3">
              <button className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                <HeartIcon className="h-5 w-5 mr-2" />
                Save
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-secondary-500 text-white font-semibold rounded-lg hover:bg-secondary-600 transition-colors">
                <ShareIcon className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {businessData.business_name}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {businessData.long_description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Founded:</span>
                    <span className="text-gray-600 ml-2">{businessData.founded}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Team Size:</span>
                    <span className="text-gray-600 ml-2">{businessData.employees} employees</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <ServicesManager
                  businessId={businessData.id}
                  isOwner={false}
                />
              </div>

              {/* Portfolio */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Projects</h2>
                <div className="space-y-4">
                  {businessData.portfolio.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-gray-600 text-sm">{project.type}</p>
                        </div>
                        <span className="text-sm text-gray-500">{project.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm
                businessId={businessData.id}
                businessName={businessData.business_name}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                    <a href={`tel:${businessData.phone}`} className="text-gray-700 hover:text-primary-600">
                      {businessData.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                    <a href={`mailto:${businessData.email}`} className="text-gray-700 hover:text-primary-600">
                      {businessData.email}
                    </a>
                  </div>
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{businessData.address}</span>
                  </div>
                  {businessData.website && (
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                      <a 
                        href={`https://${businessData.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary-600"
                      >
                        {businessData.website}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={() => {
                      window.open(`mailto:${businessData.email}?subject=Inquiry about ${businessData.business_name}&body=Hello, I'm interested in your services.`, '_blank')
                    }}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Send Message
                  </button>
                  <button 
                    onClick={() => {
                      window.open(`tel:${businessData.phone}`, '_blank')
                    }}
                    className="w-full border border-primary-600 text-primary-600 py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
                  >
                    Call Now
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-semibold text-gray-900">{businessData.rating}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-semibold text-gray-900">{businessData.reviews_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-semibold text-gray-900">{businessData.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-semibold text-gray-900">{businessData.employees}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
