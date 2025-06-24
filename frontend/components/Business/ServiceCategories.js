import Link from 'next/link'
import { 
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  PaintBrushIcon,
  TruckIcon,
  ComputerDesktopIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

export default function ServiceCategories() {
  const categories = [
    {
      id: 1,
      slug: 'real-estate',
      name: 'Real Estate',
      name_rw: 'Imitungo',
      description: 'Property sales, rentals, and management services',
      icon: HomeIcon,
      color: 'from-blue-500 to-blue-600',
      count: '150+ services',
      subcategories: ['Property Sales', 'Rentals', 'Property Management', 'Valuation']
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
      subcategories: ['Residential Construction', 'Commercial Building', 'Renovation', 'Infrastructure']
    },
    {
      id: 3,
      slug: 'maintenance-repair',
      name: 'Maintenance',
      name_rw: 'Kubungabunga',
      description: 'Property maintenance and repair services',
      icon: WrenchScrewdriverIcon,
      color: 'from-green-500 to-green-600',
      count: '180+ services',
      subcategories: ['Plumbing', 'Electrical', 'HVAC', 'General Repairs']
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
      subcategories: ['Legal Advice', 'Property Law', 'Financing', 'Insurance']
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
      subcategories: ['Architecture', 'Interior Design', 'Landscape Design', '3D Modeling']
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
      subcategories: ['Residential Moving', 'Commercial Moving', 'Storage', 'Logistics']
    },
    {
      id: 7,
      slug: 'technology-proptech',
      name: 'Technology',
      name_rw: 'Ikoranabuhanga',
      description: 'PropTech and smart home solutions',
      icon: ComputerDesktopIcon,
      color: 'from-cyan-500 to-cyan-600',
      count: '90+ services',
      subcategories: ['Smart Home', 'Property Software', 'Security Systems', 'IoT Solutions']
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
      subcategories: ['Real Estate Courses', 'Professional Training', 'Certification', 'Workshops']
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Service Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive real estate services covering the entire value chain. 
            From property development to ongoing maintenance, find the right professionals for your needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden h-full flex flex-col"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative p-6 flex flex-col h-full">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-7 w-7 text-white" />
                </div>

                {/* Category Info */}
                <div className="mb-4 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-2">
                    {category.name_rw}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {category.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                    {category.count}
                  </span>
                </div>

                {/* Subcategories Preview */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {category.subcategories.slice(0, 2).map((sub, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 2 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{category.subcategories.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-end">
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
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View All Categories
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
