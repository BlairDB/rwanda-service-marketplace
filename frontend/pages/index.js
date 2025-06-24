import Link from 'next/link'
import Layout from '../components/Layout/Layout'
import Hero from '../components/UI/Hero'
import ServiceCategories from '../components/Business/ServiceCategories'

export default function Home() {
  return (
    <Layout
      title="ServiceRW - Rwanda's Premier Real Estate Service Platform"
      description="Digitizing and connecting Rwanda's Real Estate Value Chain Players. Find trusted real estate services from property management to construction in Kigali and across Rwanda."
      keywords="Rwanda real estate, property services, construction Rwanda, property management Kigali, real estate agents Rwanda, ServiceRW"
    >

      <Hero />
      <ServiceCategories />

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How ServiceRW Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting you with Rwanda's best real estate service providers in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Discover',
                description: 'Browse our comprehensive directory of verified real estate service providers across Rwanda.',
                icon: '🔍'
              },
              {
                step: '02',
                title: 'Compare & Connect',
                description: 'Compare profiles, read reviews, and connect directly with service providers that match your needs.',
                icon: '🤝'
              },
              {
                step: '03',
                title: 'Get Things Done',
                description: 'Work with trusted professionals to complete your real estate projects efficiently and reliably.',
                icon: '✅'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Rwanda's Real Estate Network?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Whether you're looking for services or want to offer your expertise,
            ServiceRW is your gateway to Rwanda's thriving real estate ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/businesses"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Find Services
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-secondary-500 text-white font-semibold rounded-xl hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Join as Provider
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
