import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://graphicianstudios.com'
const SITE_NAME = 'Graphician Studios'

const ROUTE_META = {
  '/': {
    title: 'Graphician Studios - Digital Creations & Ads Creation',
    description:
      'Graphician Studios Plans, Designs, And Ships Paid Social, Search, Video, And Ad Creative Creatives Built To Turn Attention Into Momentum!',
  },
  '/service': {
    title: 'Solutions - Graphician Studios',
    description:
      'Explore Graphician Studios Services Across Paid Social, Performance Marketing, Brand Creative, Motion Content, Partnerships, Analytics, And Growth Strategy!',
  },
  '/portfolio': {
    title: 'Our Creations - Graphician Studios',
    description:
      'See Selected Graphician Studios Creative Work, Creative Systems, Performance Results, And Digital Creations  Case Studies!',
  },
  '/about': {
    title: 'Story - Graphician Studios',
    description:
      'Meet Graphician Studios, A Hands-On Digital Creations And Ads Creation Studio Built By Strategists, Designers, Editors, And Media Buyers!',
  },
  '/contact': {
    title: 'Let’s Create - Graphician Studios',
    description:
      'Contact Graphician Studios To Plan Your Next Digital Creations  Creative, Paid Media Sprint, Creative Launch, Or Growth Strategy!',
  },
}

function upsertMeta(selector, create, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SEO() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = ROUTE_META[pathname] ? pathname : '/'
    const meta = ROUTE_META[path]
    const url = `${SITE_URL}${path === '/' ? '/' : path}`

    document.title = meta.title
    upsertLink('canonical', url)
    upsertLink('icon', '/assets/GRAPHICIAN favicon.jpg.jpeg')

    upsertMeta('meta[name="description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'description')
      return el
    }, meta.description)

    upsertMeta('meta[name="robots"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'robots')
      return el
    }, 'index, follow')

    upsertMeta('meta[property="og:title"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:title')
      return el
    }, meta.title)

    upsertMeta('meta[property="og:description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:description')
      return el
    }, meta.description)

    upsertMeta('meta[property="og:url"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:url')
      return el
    }, url)

    upsertMeta('meta[property="og:type"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:type')
      return el
    }, 'website')

    upsertMeta('meta[property="og:site_name"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:site_name')
      return el
    }, SITE_NAME)

    upsertMeta('meta[name="twitter:card"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'twitter:card')
      return el
    }, 'summary_large_image')

    upsertMeta('meta[name="twitter:title"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'twitter:title')
      return el
    }, meta.title)

    upsertMeta('meta[name="twitter:description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'twitter:description')
      return el
    }, meta.description)

    // Inject JSON-LD Structured Data
    let schemaScript = document.head.querySelector('script[type="application/ld+json"]')
    if (!schemaScript) {
      schemaScript = document.createElement('script')
      schemaScript.setAttribute('type', 'application/ld+json')
      document.head.appendChild(schemaScript)
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/assets/graphician-studios-logo.png`,
      image: `${SITE_URL}/assets/GRAPHICIAN favicon.jpg.jpeg`,
      description: meta.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Trichy Main Road, Gugai',
        addressLocality: 'Salem',
        addressRegion: 'Tamil Nadu',
        postalCode: '636006',
        addressCountry: 'IN',
      },
      telephone: '+919600996880',
      sameAs: [
        'https://www.instagram.com/graphician_studios/',
        'https://in.linkedin.com/company/graphician-studios',
        'https://www.youtube.com/@GraphicianStudio',
      ],
    }

    schemaScript.textContent = JSON.stringify(schemaData)
  }, [pathname])

  return null
}
