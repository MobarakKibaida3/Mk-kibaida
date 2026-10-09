'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import FeaturedOffer from '@/components/FeaturedOffer';
import PriceCalculator from '@/components/PriceCalculator';
import PortfolioSection from '@/components/PortfolioSection';
import ProcessSection from '@/components/ProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import OrderFormSection from '@/components/OrderFormSection';
import OrderTracker from '@/components/OrderTracker';
import PaymentMethodsSection from '@/components/PaymentMethodsSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import MobileBottomBar from '@/components/MobileBottomBar';
import ExitIntentModal from '@/components/ExitIntentModal';
import { Language, ServiceItem, CurrencyCode } from '@/lib/types';
import initialServicesData from '@/data/services.json';

export default function HomePage() {
  const [lang, setLang] = useState<Language>('ar');
  const [currency, setCurrency] = useState<CurrencyCode>('EGP');
  const [services, setServices] = useState<ServiceItem[]>(initialServicesData as ServiceItem[]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('full-store-bundle');

  // Enforce starting at the very top (Hero section) on load or refresh
  useEffect(() => {
    // 1. Disable browser scroll restoration
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Ignore and strip any URL hash on initial page load
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // 3. Scroll to absolute top immediately and safeguard against subsequent layout calculations
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);

      const raf = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, []);

  // Sync document direction and lang attribute with selected language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Fetch updated services if modified
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        }
      } catch (e) {
        console.error('Error loading services:', e);
      }
    };
    fetchServices();
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const featuredService = services.find((s) => s.id === 'full-store-bundle');

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-white flex flex-col pb-16 sm:pb-0 ${lang === 'ar' ? 'font-sans' : 'font-sans'}`}>
      
      {/* Sticky Luxury Navbar with Currency & Language Switchers */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero lang={lang} />

        {/* 2. Core & Extended Services Section with Search & Currency */}
        <ServicesSection
          lang={lang}
          services={services}
          selectedServiceId={selectedServiceId}
          onSelectService={handleSelectService}
          currency={currency}
        />

        {/* 3. Limited-Time Featured Offer (Dynamic Currency) */}
        <FeaturedOffer
          lang={lang}
          onSelectService={handleSelectService}
          featuredService={featuredService}
          currency={currency}
        />

        {/* 4. Portfolio & Proven Case Studies */}
        <PortfolioSection
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* 5. Interactive Price Bundle Calculator with Currency */}
        <PriceCalculator
          lang={lang}
          services={services}
          currency={currency}
        />

        {/* 6. How We Work (4 Simple Steps) */}
        <ProcessSection lang={lang} />

        {/* 7. Client Reviews & WhatsApp Endorsements */}
        <TestimonialsSection lang={lang} />

        {/* 8. Direct Order Form Section with Dynamic Service Questions */}
        <OrderFormSection
          lang={lang}
          services={services}
          selectedServiceId={selectedServiceId}
          onSelectService={handleSelectService}
          currency={currency}
        />

        {/* 9. Real-Time Order Tracker */}
        <OrderTracker lang={lang} />

        {/* 10. FAQ Accordion */}
        <FAQSection lang={lang} />

        {/* 11. Accepted Payment Methods Section (Configurable via settings.json) */}
        <PaymentMethodsSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Floating WhatsApp on Desktop only */}
      <FloatingWhatsApp lang={lang} />

      {/* Fixed Sticky Bottom Action Bar on Mobile only */}
      <MobileBottomBar lang={lang} />

      {/* Exit Intent Consultation Modal */}
      <ExitIntentModal lang={lang} />

    </div>
  );
}
