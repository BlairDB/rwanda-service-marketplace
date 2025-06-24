import Layout from '../components/Layout/Layout'
import { 
  BuildingOfficeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function About() {
  const stats = [
    { label: 'Service Providers', value: '500+', description: 'Verified professionals' },
    { label: 'Services Listed', value: '1,200+', description: 'Across all categories' },
    { label: 'Happy Customers', value: '2,500+', description: 'Satisfied clients' },
    { label: 'Districts Covered', value: '30', description: 'Across Rwanda' },
  ]

  const values = [
    {
      icon: CheckCircleIcon,
      title: 'Quality Assurance',
      description: 'All service providers are verified and vetted to ensure the highest standards of professionalism and quality.'
    },
    {
      icon: UserGroupIcon,
      title: 'Community First',
      description: 'We prioritize building strong relationships within Rwanda\'s real estate community, fostering collaboration and growth.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Digital Innovation',
      description: 'Leveraging technology to modernize Rwanda\'s real estate sector and make services more accessible to everyone.'
    },
    {
      icon: HeartIcon,
      title: 'Rwanda Pride',
      description: 'Proudly supporting Rwanda\'s development by connecting local talent with opportunities in the real estate sector.'
    }
  ]

  const team = [
    {
      name: 'Jean Baptiste Uwimana',
      role: 'Founder & CEO',
      description: 'Real estate veteran with 15+ years experience in Rwanda\'s property market.',
      image: '/images/team/ceo.jpg'
    },
    {
      name: 'Marie Claire Mukamana',
      role: 'Head of Operations',
      description: 'Expert in business operations and service provider relations across Rwanda.',
      image: '/images/team/operations.jpg'
    },
    {
      name: 'David Nkurunziza',
      role: 'Technology Director',
      description: 'Leading our digital transformation initiatives and platform development.',
      image: '/images/team/tech.jpg'
    }
  ]

  return (
    <Layout
      title="About ServiceRW - Rwanda's Real Estate Service Platform"
      description="Learn about ServiceRW's mission to digitize and connect Rwanda's real estate value chain players. Discover our story, values, and commitment to Rwanda's development."
      keywords="ServiceRW about, Rwanda real estate platform, real estate services Rwanda, property services"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About ServiceRW
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
              Digitizing and connecting Rwanda's Real Estate Value Chain Players
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                ServiceRW was born from a vision to transform Rwanda's real estate sector through digital innovation. 
                We recognized that while Rwanda has incredible talent and growing real estate opportunities, 
                connecting service providers with clients remained fragmented and inefficient.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform bridges this gap by creating a comprehensive ecosystem where property developers, 
                construction companies, real estate agents, maintenance services, and all other value chain players 
                can connect, collaborate, and grow together.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Rwanda's Digital Real Estate Hub</h3>
                  <p className="text-gray-600">Connecting every player in the value chain</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {stat.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at ServiceRW
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rwanda Focus Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🇷🇼 Proudly Rwandan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for Rwanda, by Rwandans, supporting Rwanda's Vision 2050
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Local Expertise</h3>
              <p className="text-blue-700">
                Deep understanding of Rwanda's real estate market, regulations, and cultural nuances.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-3">Economic Growth</h3>
              <p className="text-yellow-700">
                Supporting Rwanda's economic development by empowering local businesses and entrepreneurs.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-3">Digital Innovation</h3>
              <p className="text-green-700">
                Contributing to Rwanda's digital transformation and smart city initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to transforming Rwanda's real estate sector
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-12 w-12 text-primary-600" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Rwanda's Real Estate Revolution
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Be part of the digital transformation that's shaping Rwanda's real estate future. 
            Whether you're a service provider or looking for services, we're here to connect you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/businesses"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Services
            </a>
            <a
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 text-white font-semibold rounded-xl hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Our Platform
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
