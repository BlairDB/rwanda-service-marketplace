import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ 
  children, 
  title = 'ServiceRW - Rwanda Real Estate Services',
  description = 'Digitizing and connecting Rwanda\'s Real Estate Value Chain Players. Find trusted real estate services from property management to construction.',
  keywords = 'Rwanda real estate, property services, construction, property management, real estate agents, Kigali',
  ogImage = '/images/og-image.jpg'
}) {
  const fullTitle = title.includes('ServiceRW') ? title : `${title} | ServiceRW`

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="ServiceRW" />
        <meta property="og:locale" content="en_RW" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Theme */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://servicerw.rw${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ServiceRW",
              "description": "Rwanda's premier real estate service platform",
              "url": "https://servicerw.rw",
              "logo": "https://servicerw.rw/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+250-XXX-XXX-XXX",
                "contactType": "customer service",
                "areaServed": "RW",
                "availableLanguage": ["English", "Kinyarwanda"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "RW",
                "addressLocality": "Kigali",
                "addressRegion": "Kigali City"
              },
              "sameAs": [
                "https://twitter.com/servicerw",
                "https://facebook.com/servicerw",
                "https://linkedin.com/company/servicerw"
              ]
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  )
}
