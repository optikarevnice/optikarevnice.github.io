// schema.org structured data (JSON-LD) built from the same CMS data as the page,
// so search engines and AI assistants always see the current hours and prices.
import { contact, fullAddress, isClosed, locations, pricing, site } from './data';

const SITE_URL = 'https://www.optikarevnice.cz';
export const ORG_ID = `${SITE_URL}/#organization`;

const DAYS: Record<string, string> = {
  pondělí: 'Monday',
  úterý: 'Tuesday',
  středa: 'Wednesday',
  čtvrtek: 'Thursday',
  pátek: 'Friday',
  sobota: 'Saturday',
  neděle: 'Sunday',
};

export function dayOfWeek(day: string) {
  return DAYS[day.trim().toLowerCase()];
}

/** "8:30–16:30" or "8:00–12:00, 13:00–17:00" → [["08:30","16:30"], …] */
export function parseRanges(hours: string): [string, string][] {
  if (isClosed(hours)) return [];
  const pad = (t: string) => t.replace('.', ':').padStart(5, '0');
  return [...hours.matchAll(/(\d{1,2}[:.]\d{2})\s*[–—-]\s*(\d{1,2}[:.]\d{2})/g)].map((m) => [
    pad(m[1]),
    pad(m[2]),
  ]);
}

function openingHours(days: { day: string; hours: string }[]) {
  return days.flatMap(({ day, hours }) => {
    const dayOfWeekName = dayOfWeek(day);
    if (!dayOfWeekName) return [];
    return parseRanges(hours).map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayOfWeekName}`,
      opens,
      closes,
    }));
  });
}

function priceValue(price: string) {
  const digits = price.replace(/[^\d,]/g, '').replace(',', '.');
  return digits ? Number(digits) : undefined;
}

export function organizationGraph(image: string) {
  const businesses = locations.flatMap((location) =>
    location.units.map((unit) => ({
      '@type': unit.kind === 'ordinace' ? 'MedicalClinic' : 'Optician',
      '@id': `${SITE_URL}/#${location.id}-${unit.kind}`,
      name: unit.title,
      url: `${SITE_URL}/#pobocky`,
      image,
      telephone: unit.phone ?? location.phone,
      email: contact.email,
      currenciesAccepted: 'CZK',
      paymentAccepted: 'Cash, Credit Card, Benefit vouchers',
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.street,
        postalCode: location.postal_code,
        addressLocality: location.city,
        addressCountry: 'CZ',
      },
      hasMap: location.map_url,
      openingHoursSpecification: openingHours(unit.days),
      parentOrganization: { '@id': ORG_ID },
      ...(unit.note || location.note ? { description: [unit.note, location.note].filter(Boolean).join(' ') } : {}),
    })),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: site.name,
        description: site.description,
        inLanguage: 'cs-CZ',
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: site.name,
        legalName: contact.company.name,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.svg`,
        image,
        email: contact.email,
        description: site.description,
        address: contact.company.address,
        identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: contact.company.ico },
        sameAs: [contact.social.instagram, contact.social.facebook].filter(Boolean),
        subOrganization: businesses.map((b) => ({ '@id': b['@id'] })),
        contactPoint: locations.map((l) => ({
          '@type': 'ContactPoint',
          contactType: 'customer service',
          areaServed: l.city,
          telephone: l.phone,
          availableLanguage: 'cs',
        })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Ceník vyšetření',
          itemListElement: pricing.map((item) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: item.service },
            price: priceValue(item.price),
            priceCurrency: 'CZK',
          })),
        },
      },
      ...businesses,
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).href,
    })),
  };
}

export { fullAddress, SITE_URL };
