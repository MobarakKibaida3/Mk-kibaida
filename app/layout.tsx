import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mobarakkibaida.online'),
  title: 'MobarakKibaida - Creative Design Services & Store Hub',
  description: 'خدمات تصميم احترافية للمتاجر والهويات البصرية والفيديوهات بالذكاء الاصطناعي مع تحويل فوري لطلبات واتساب.',
  keywords: [
    'تصميم متاجر شوبيفاي',
    'تصميم بالذكاء الاصطناعي',
    'تصميم لوجو',
    'مبارك كبيدة',
    'MobarakKibaida',
    'Mobarak Kibaida',
    'تصميم سوشيال ميديا',
    'ثيم شوبيفاي',
  ],
  authors: [{ name: 'MobarakKibaida', url: 'https://wa.me/201033615727' }],
  openGraph: {
    title: 'MobarakKibaida - Creative Design Services & Store Hub',
    description: 'خدمات تصميم احترافية للمتاجر والهويات البصرية والفيديوهات بالذكاء الاصطناعي مع تحويل فوري لطلبات واتساب.',
    type: 'website',
    locale: 'ar_EG',
    images: [
      {
        url: '/images/hero_luxury_showcase_1791020864553.jpg',
        width: 1200,
        height: 630,
        alt: 'MobarakKibaida Luxury Design Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MobarakKibaida - Creative Design Services & Store Hub',
    description: 'خدمات تصميم احترافية للمتاجر والهويات البصرية والفيديوهات بالذكاء الاصطناعي مع تحويل فوري لطلبات واتساب.',
    images: ['/images/hero_luxury_showcase_1791020864553.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org ProfessionalService structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'MobarakKibaida Design Studio',
    image: 'https://ais-dev-u7daft44bhnyikrnddfusp-123824498005.europe-west2.run.app/images/hero_luxury_showcase_1791020864553.jpg',
    telephone: '+201033615727',
    email: 'Mobarakkibaida3@gmail.com',
    url: 'https://wa.me/201033615727',
    priceRange: '100 - 6000 EGP',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
    currenciesAccepted: 'EGP, SAR, USD',
    paymentAccepted: 'Direct WhatsApp Agreement, Bank Transfer, InstaPay',
    description: 'Professional bespoke design services for e-commerce, AI product mockups, and corporate branding.',
  };

  return (
    <html lang="ar" dir="rtl" className="scroll-smooth bg-[#0A0A0A] text-white w-full max-w-full overflow-x-hidden">
      <body className="antialiased selection:bg-[#C9A227] selection:text-black min-h-screen bg-[#0A0A0A] w-full max-w-full overflow-x-hidden" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
