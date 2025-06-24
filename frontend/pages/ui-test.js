import Layout from '../components/Layout/Layout'
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  TabletIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function UITest() {
  const responsiveFeatures = [
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile First',
      description: 'Optimized for smartphones with touch-friendly interfaces',
      breakpoint: '< 640px'
    },
    {
      icon: TabletIcon,
      title: 'Tablet Ready',
      description: 'Perfect layout for tablets and medium screens',
      breakpoint: '640px - 1024px'
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Desktop Enhanced',
      description: 'Full-featured experience on large screens',
      breakpoint: '> 1024px'
    }
  ]

  const alignmentTests = [
    'Header navigation alignment',
    'Logo and brand positioning',
    'Search form responsiveness',
    'Card grid layouts',
    'Button and form alignment',
    'Footer content organization',
    'Mobile menu functionality',
    'Text truncation and overflow'
  ]

  return (
    <Layout
      title="UI Test - ServiceRW"
      description="UI alignment and responsiveness test page for ServiceRW platform"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              UI Alignment Test
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Testing responsive design and perfect alignment across all devices
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Responsive Design
            </h2>
            <p className="text-xl text-gray-600">
              Optimized for all screen sizes and devices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {responsiveFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {feature.description}
                </p>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                  {feature.breakpoint}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alignment Checklist */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Alignment Checklist
            </h2>
            <p className="text-xl text-gray-600">
              All UI elements properly aligned and responsive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {alignmentTests.map((test, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{test}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Test */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grid Layout Test
            </h2>
            <p className="text-xl text-gray-600">
              Testing card layouts and grid responsiveness
            </p>
          </div>

          {/* 1 Column on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-primary-500 rounded-lg mx-auto mb-4"></div>
                <h3 className="font-bold text-gray-900 mb-2">Card {index + 1}</h3>
                <p className="text-gray-600 text-sm">
                  This card tests responsive grid layout and alignment across different screen sizes.
                </p>
              </div>
            ))}
          </div>

          {/* Equal height cards test */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Equal Height Cards Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Short Content</h4>
              <p className="text-gray-600 flex-grow">This card has less content.</p>
              <button className="mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg">
                Action
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Medium Content</h4>
              <p className="text-gray-600 flex-grow">
                This card has a moderate amount of content to test how the layout handles 
                different content lengths while maintaining equal heights.
              </p>
              <button className="mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg">
                Action
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Long Content</h4>
              <p className="text-gray-600 flex-grow">
                This card has significantly more content to demonstrate how the flexbox layout 
                ensures all cards maintain the same height regardless of content length. 
                The flex-grow property on the content area pushes the button to the bottom, 
                creating a consistent and professional appearance across all cards in the grid.
              </p>
              <button className="mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg">
                Action
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Test */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Typography Scale
            </h2>
            <p className="text-xl text-gray-600">
              Responsive typography that scales beautifully
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2">
                Heading 1 - Hero Title
              </h1>
              <p className="text-gray-600">4xl on mobile, 6xl on desktop</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Heading 2 - Section Title
              </h2>
              <p className="text-gray-600">3xl on mobile, 4xl on desktop</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Heading 3 - Subsection
              </h3>
              <p className="text-gray-600">2xl on mobile, 3xl on desktop</p>
            </div>
            <div>
              <p className="text-lg md:text-xl text-gray-700 mb-2">
                Body Large - Important content
              </p>
              <p className="text-gray-600">lg on mobile, xl on desktop</p>
            </div>
            <div>
              <p className="text-base text-gray-700 mb-2">
                Body Regular - Standard content
              </p>
              <p className="text-gray-600">base size across all devices</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Body Small - Secondary information
              </p>
              <p className="text-gray-500">sm size for captions and metadata</p>
            </div>
          </div>
        </div>
      </section>

      {/* Button Test */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Button Alignment Test
            </h2>
            <p className="text-xl text-gray-600">
              Testing button layouts and responsive behavior
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Single button */}
            <div className="text-center">
              <button className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-colors font-semibold">
                Single Button
              </button>
            </div>

            {/* Button group - stack on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Primary Action
              </button>
              <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Secondary Action
              </button>
            </div>

            {/* Full width on mobile */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Full Width Mobile
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Equal Width Desktop
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
