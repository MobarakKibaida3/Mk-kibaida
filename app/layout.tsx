import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mobarak Kibaida - Creative Design Services & Store Hub',
  description: 'خدمات تصميم احترافية للمتاجر والهويات البصرية والفيديوهات بالذكاء الاصطناعي مع تحويل فوري لطلبات واتساب.',
  keywords: [
    'تصميم متاجر شوبيفاي',
    'تصميم بالذكاء الاصطناعي',
    'تصميم لوجو',
    'مبارك كبيدة',
    'Mobarak Kibaida',
    'تصميم سوشيال ميديا',
    'ثيم شوبيفاي',
  ],
  authors: [{ name: 'Mobarak Kibaida', url: 'https://wa.me/201033615727' }],
  openGraph: {
    title: 'Mobarak Kibaida - Creative Design Services & Store Hub',
    description: 'خدمات تصميم احترافية للمتاجر والهويات البصرية والفيديوهات بالذكاء الاصطناعي مع تحويل فوري لطلبات واتساب.',
    type: 'website',
    locale: 'ar_EG',
    images: [
      {
        url: '/images/hero_luxury_showcase_1791020864553.jpg',
        width: 1200,
        height: 630,
        alt: 'Mobarak Kibaida Luxury Design Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobarak Kibaida - Creative Design Services & Store Hub',
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
    name: 'Mobarak Kibaida Design Studio',
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
    <html lang="ar" dir="rtl" className="scroll-smooth bg-[#0A0A0A] text-white">
      <body className="antialiased selection:bg-[#C9A227] selection:text-black min-h-screen bg-[#0A0A0A]" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                if (window.location.hash) {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                window.scrollTo(0, 0);
              } catch(e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
