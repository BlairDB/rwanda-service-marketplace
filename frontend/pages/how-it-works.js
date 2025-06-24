import Layout from '../components/Layout/Layout'
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Search & Discover',
      description: 'Browse our comprehensive directory of verified real estate service providers across Rwanda. Use our advanced search and filtering options to find exactly what you need.',
      icon: MagnifyingGlassIcon,
      features: [
        'Search by service type, location, or company name',
        'Filter by ratings, price range, and availability',
        'View detailed business profiles and portfolios',
        'Read authentic customer reviews and ratings'
      ]
    },
    {
      number: '02',
      title: 'Compare & Connect',
      description: 'Compare multiple service providers, read reviews, and connect directly with professionals that match your specific requirements and budget.',
      icon: UserGroupIcon,
      features: [
        'Side-by-side comparison of service providers',
        'Direct messaging and inquiry system',
        'Request quotes and proposals',
        'Schedule consultations and site visits'
      ]
    },
    {
      number: '03',
      title: 'Get Things Done',
      description: 'Work with trusted, verified professionals to complete your real estate projects efficiently, safely, and within budget.',
      icon: CheckCircleIcon,
      features: [
        'Secure payment processing and escrow',
        'Project milestone tracking',
        'Quality assurance and dispute resolution',
        'Leave reviews to help the community'
      ]
    }
  ]

  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Professionals',
      description: 'All service providers are thoroughly vetted and verified for quality and reliability.'
    },
    {
      icon: StarIcon,
      title: 'Quality Assurance',
      description: 'Our rating system ensures you connect with top-rated professionals in Rwanda.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Transparent Pricing',
      description: 'Compare prices and get quotes upfront with no hidden fees or surprises.'
    }
  ]

  const forCustomers = [
    'Create a free account in minutes',
    'Post your project requirements',
    'Receive quotes from qualified providers',
    'Choose the best fit for your needs',
    'Track project progress online',
    'Pay securely through our platform'
  ]

  const forProviders = [
    'Join Rwanda\'s largest service network',
    'Showcase your expertise and portfolio',
    'Connect with qualified customers',
    'Grow your business with digital tools',
    'Receive payments securely',
    'Build your reputation with reviews'
  ]

  return (
    <Layout
      title="How It Works - ServiceRW"
      description="Learn how ServiceRW connects customers with Rwanda's best real estate service providers. Simple, secure, and efficient process for all your property needs."
      keywords="how ServiceRW works, Rwanda real estate services, property services process"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How ServiceRW Works
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Connecting you with Rwanda's best real estate service providers in three simple steps. 
              Fast, secure, and reliable.
            </p>
          </div>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mr-4">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-secondary-500 text-white rounded-full font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h2>
                  
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <step.icon className="h-24 w-24 text-primary-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-primary-700 mb-2">
                        Step {step.number}
                      </h3>
                      <p className="text-primary-600">
                        {step.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ServiceRW?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best experience for both customers and service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Customers vs Providers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">
                For Customers
              </h3>
              <p className="text-blue-700 mb-6">
                Find and hire trusted real estate service providers across Rwanda
              </p>
              <ul className="space-y-3 mb-8">
                {forCustomers.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/businesses"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Find Services
              </a>
            </div>

            {/* For Providers */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-900 mb-6">
                For Service Providers
              </h3>
              <p className="text-green-700 mb-6">
                Grow your business by connecting with customers across Rwanda
              </p>
              <ul className="space-y-3 mb-8">
                {forProviders.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Join as Provider
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers and service providers who trust ServiceRW 
            for their real estate service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/businesses"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Find Services
            </a>
            <a
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-secondary-500 text-white font-semibold rounded-xl hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join as Provider
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
