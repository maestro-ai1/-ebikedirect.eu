import React from 'react';
import { Product } from '@/lib/types';

export function StoreJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BicycleStore',
    'name': 'ebikedirect.eu',
    'image': 'https://ebikedirect.eu/logo.svg',
    '@id': 'https://ebikedirect.eu/#store',
    'url': 'https://ebikedirect.eu',
    'priceRange': '€€€€',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Kollwitzstraße 47',
      'addressLocality': 'Berlin',
      'postalCode': '10405',
      'addressRegion': 'Berlin',
      'addressCountry': 'DE'
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '18:30'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': 'Saturday',
        'opens': '10:00',
        'closes': '16:00'
      }
    ],
    'paymentAccepted': 'Cash, Credit Card, Klarna, PayPal, Bitcoin, USDT',
    'currenciesAccepted': 'EUR, BTC, USDT',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'bestRating': '5.0',
      'reviewCount': '5284'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product, description, urlPrefix = '', name }: { product: Product; description?: string; urlPrefix?: string; name?: string }) {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': name || product.name,
    'image': [product.image, ...(product.gallery || [])],
    'description': description || product.description,
    'sku': product.id,
    'brand': {
      '@type': 'Brand',
      'name': product.brand
    },
    'offers': {
      '@type': 'Offer',
      'url': `${baseUrl}${urlPrefix}/shop/${product.slug}`,
      'priceCurrency': 'EUR',
      'price': product.price,
      'priceValidUntil': '2027-12-31',
      'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'itemCondition': 'https://schema.org/NewCondition',
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': product.price >= 1000 ? '0' : '49',
          'currency': 'EUR'
        },
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'handlingTime': {
            '@type': 'QuantitativeValue',
            'minValue': 1,
            'maxValue': 2,
            'unitCode': 'DAY'
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': 2,
            'maxValue': 4,
            'unitCode': 'DAY'
          }
        }
      }
    },
    ...(product.reviewsCount > 0
      ? {
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': product.rating.toString(),
            'reviewCount': product.reviewsCount.toString()
          }
        }
      : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbsJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostingJsonLd({ post }: { post: { title: string; excerpt: string; date: string; author: { name: string }; image: string; slug: string } }) {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.image,
    'author': {
      '@type': 'Person',
      'name': post.author.name
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'ebikedirect.eu',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.svg`
      }
    },
    'datePublished': post.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
