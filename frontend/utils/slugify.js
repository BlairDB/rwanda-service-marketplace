/**
 * Convert a business name to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The slugified text
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

/**
 * Business name to slug and category mappings for consistency
 * In a real app, this would be stored in the database
 */
export const businessData = {
  'Kigali Construction Ltd': { slug: 'kigali-construction-ltd', category: 'construction' },
  'Rwanda Property Management': { slug: 'rwanda-property-management', category: 'real-estate' },
  'Elite Interior Design': { slug: 'elite-interior-design', category: 'design' },
  'Gasabo Maintenance Services': { slug: 'gasabo-maintenance-services', category: 'maintenance' },
  'Rwanda Legal Advisors': { slug: 'rwanda-legal-advisors', category: 'legal' },
  'Kigali Real Estate Agency': { slug: 'kigali-real-estate-agency', category: 'real-estate' },
  'Rwanda Builders Co.': { slug: 'rwanda-builders-co', category: 'construction' },
  'Rwanda Moving Services': { slug: 'rwanda-moving-services', category: 'moving' },
  'Smart Home Rwanda': { slug: 'smart-home-rwanda', category: 'technology' },
  'Rwanda Real Estate Institute': { slug: 'rwanda-real-estate-institute', category: 'education' },
  'Crystal Clean Rwanda': { slug: 'crystal-clean-rwanda', category: 'cleaning' },
  'Rwanda Security Solutions': { slug: 'rwanda-security-solutions', category: 'security' },
  'Kigali Building Supplies': { slug: 'kigali-building-supplies', category: 'materials' },
  'Rwanda Development Board': { slug: 'rwanda-development-board', category: 'government' }
}

/**
 * Legacy business slugs for backward compatibility
 */
export const businessSlugs = Object.fromEntries(
  Object.entries(businessData).map(([name, data]) => [name, data.slug])
)

/**
 * Get slug for a business name
 * @param {string} businessName - The business name
 * @returns {string} - The corresponding slug
 */
export function getBusinessSlug(businessName) {
  return businessSlugs[businessName] || slugify(businessName)
}

/**
 * Get business name from slug
 * @param {string} slug - The slug
 * @returns {string|null} - The corresponding business name or null if not found
 */
export function getBusinessNameFromSlug(slug) {
  const entry = Object.entries(businessSlugs).find(([name, businessSlug]) => businessSlug === slug)
  return entry ? entry[0] : null
}

/**
 * Get business URL with category
 * @param {string} businessName - The business name
 * @returns {string} - The business URL with category
 */
export function getBusinessUrl(businessName) {
  const business = businessData[businessName]
  if (business) {
    return `/${business.category}/${business.slug}`
  }
  // Fallback to slugified name with 'business' category
  return `/business/${slugify(businessName)}`
}

/**
 * Get business category from name
 * @param {string} businessName - The business name
 * @returns {string} - The business category slug
 */
export function getBusinessCategory(businessName) {
  const business = businessData[businessName]
  return business ? business.category : 'business'
}
