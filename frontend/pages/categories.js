import Layout from '../components/Layout/Layout'
import Link from 'next/link'
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
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function Categories() {
  const categories = [
    {
      id: 1,
      slug: 'real-estate',
      name: 'Real Estate',
      name_rw: 'Imitungo',
      description: 'Property sales, rentals, and management services across Rwanda',
      icon: HomeIcon,
      color: 'from-blue-500 to-blue-600',
      count: '150+ services',
      subcategories: [
        'Property Sales', 'Property Rentals', 'Property Management',
        'Property Valuation', 'Real Estate Agents', 'Property Investment'
      ]
    },
    {
      id: 2,
      slug: 'construction',
      name: 'Construction',
      name_rw: 'Ubwubatsi',
      description: 'Building, renovation, and construction services',
      icon: BuildingOfficeIcon,
      color: 'from-orange-500 to-orange-600',
      count: '200+ services',
      subcategories: [
        'Residential Construction', 'Commercial Building', 'Renovation',
        'Infrastructure', 'Road Construction', 'Bridge Construction'
      ]
    },
    {
      id: 3,
      slug: 'maintenance-repair',
      name: 'Maintenance & Repair',
      name_rw: 'Kubungabunga',
      description: 'Property maintenance and repair services',
      icon: WrenchScrewdriverIcon,
      color: 'from-green-500 to-green-600',
      count: '180+ services',
      subcategories: [
        'Plumbing Services', 'Electrical Work', 'HVAC Systems',
        'General Repairs', 'Appliance Repair', 'Roofing'
      ]
    },
    {
      id: 4,
      slug: 'legal-financial',
      name: 'Legal & Financial',
      name_rw: 'Amategeko n\'Imari',
      description: 'Legal advice and financial services for real estate',
      icon: ScaleIcon,
      color: 'from-purple-500 to-purple-600',
      count: '80+ services',
      subcategories: [
        'Property Law', 'Legal Consultation', 'Property Financing',
        'Insurance Services', 'Tax Advisory', 'Contract Review'
      ]
    },
    {
      id: 5,
      slug: 'design-architecture',
      name: 'Design & Architecture',
      name_rw: 'Igishushanyo',
      description: 'Architectural and interior design services',
      icon: PaintBrushIcon,
      color: 'from-pink-500 to-pink-600',
      count: '120+ services',
      subcategories: [
        'Architecture', 'Interior Design', 'Landscape Design',
        '3D Modeling', 'Urban Planning', 'Structural Engineering'
      ]
    },
    {
      id: 6,
      slug: 'moving-logistics',
      name: 'Moving & Logistics',
      name_rw: 'Kwimura',
      description: 'Moving and transportation services',
      icon: TruckIcon,
      color: 'from-indigo-500 to-indigo-600',
      count: '60+ services',
      subcategories: [
        'Residential Moving', 'Commercial Moving', 'Storage Services',
        'Logistics', 'Packing Services', 'International Moving'
      ]
    },
    {
      id: 7,
      slug: 'technology-proptech',
      name: 'Technology & PropTech',
      name_rw: 'Ikoranabuhanga',
      description: 'PropTech and smart home solutions',
      icon: ComputerDesktopIcon,
      color: 'from-cyan-500 to-cyan-600',
      count: '90+ services',
      subcategories: [
        'Smart Home Systems', 'Property Software', 'Security Systems',
        'IoT Solutions', 'Property Apps', 'Virtual Tours'
      ]
    },
    {
      id: 8,
      slug: 'education-training',
      name: 'Education & Training',
      name_rw: 'Kwigisha',
      description: 'Real estate education and professional training',
      icon: AcademicCapIcon,
      color: 'from-yellow-500 to-yellow-600',
      count: '40+ services',
      subcategories: [
        'Real Estate Courses', 'Professional Training', 'Certification Programs',
        'Workshops', 'Seminars', 'Online Learning'
      ]
    },
    {
      id: 9,
      slug: 'cleaning-services',
      name: 'Cleaning Services',
      name_rw: 'Gusukura',
      description: 'Professional cleaning and maintenance services',
      icon: SparklesIcon,
      color: 'from-teal-500 to-teal-600',
      count: '70+ services',
      subcategories: [
        'House Cleaning', 'Office Cleaning', 'Deep Cleaning',
        'Window Cleaning', 'Carpet Cleaning', 'Post-Construction Cleanup'
      ]
    },
    {
      id: 10,
      slug: 'security-services',
      name: 'Security Services',
      name_rw: 'Umutekano',
      description: 'Property security and safety services',
      icon: ShieldCheckIcon,
      color: 'from-red-500 to-red-600',
      count: '50+ services',
      subcategories: [
        'Security Guards', 'CCTV Installation', 'Alarm Systems',
        'Access Control', 'Fire Safety', 'Emergency Response'
      ]
    },
    {
      id: 11,
      slug: 'material-suppliers',
      name: 'Material Suppliers',
      name_rw: 'Abatanga Ibikoresho',
      description: 'Construction and building material suppliers',
      icon: CurrencyDollarIcon,
      color: 'from-emerald-500 to-emerald-600',
      count: '100+ services',
      subcategories: [
        'Building Materials', 'Hardware Supplies', 'Electrical Supplies',
        'Plumbing Materials', 'Paint & Finishes', 'Tools & Equipment'
      ]
    },
    {
      id: 12,
      slug: 'government-services',
      name: 'Government Services',
      name_rw: 'Serivisi za Leta',
      description: 'Government and regulatory services',
      icon: DocumentTextIcon,
      color: 'from-slate-500 to-slate-600',
      count: '25+ services',
      subcategories: [
        'Building Permits', 'Land Registration', 'Property Taxes',
        'Zoning Information', 'Environmental Clearance', 'Utility Connections'
      ]
    }
  ]

  return (
    <Layout
      title="Service Categories - ServiceRW"
      description="Explore comprehensive real estate service categories in Rwanda. From construction to property management, find the right professionals for your needs."
      keywords="Rwanda real estate categories, construction services, property management, real estate professionals"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Service Categories
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover Rwanda's comprehensive real estate service ecosystem. 
              From pre-transaction to post-transaction, we cover the entire value chain.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                
                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Category Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mb-2">
                      {category.name_rw}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                      {category.count}
                    </span>
                  </div>

                  {/* Subcategories */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-end mt-4">
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our platform is constantly growing. If you don't see your service category, 
            let us know and we'll help connect you with the right professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 text-white font-semibold rounded-xl hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
