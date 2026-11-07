'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ServicesOverviewHero from '@/components/ServicesOverviewHero';
import ServicesSixGrid from '@/components/ServicesSixGrid';
import AboutAgencySection from '@/components/AboutAgencySection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import PortfolioSection from '@/components/PortfolioSection';
import PriceCalculator from '@/components/PriceCalculator';
import ProcessSection from '@/components/ProcessSection';
import FAQSection from '@/components/FAQSection';
import ContactWhatsAppSection from '@/components/ContactWhatsAppSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import MobileBottomBar from '@/components/MobileBottomBar';
import ExitIntentModal from '@/components/ExitIntentModal';
import { Language, ServiceItem, CurrencyCode } from '@/lib/types';
import initialServicesData from '@/data/services.json';

export default function ServicesOverviewPage() {
  const [lang, setLang] = useState<Language>('ar');
  const [currency, setCurrency] = useState<CurrencyCode>('EGP');
  const [services, setServices] = useState<ServiceItem[]>(initialServicesData as ServiceItem[]);

  // Enforce starting at the top on initial load or refresh safely
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    } catch {
      // Ignore iframe environment restrictions
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
    const calcSection = document.getElementById('calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-white flex flex-col pb-16 sm:pb-0 font-sans w-full max-w-full overflow-x-hidden`}>
      
      {/* Sticky Luxury Navbar configured for the Services Landing Page */}
      <Navbar
        lang={lang}
        onToggleLang={handleToggleLang}
        currency={currency}
        onCurrencyChange={setCurrency}
        currentPage="landing"
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 1. New Services Overview Hero with requested copy and CTAs */}
        <ServicesOverviewHero lang={lang} />

        {/* 2. Specialized 6 Core Services Section with benefits and CTAs */}
        <ServicesSixGrid 
          lang={lang} 
          currency={currency}
          onSelectServiceForCalculator={handleSelectService}
        />

        {/* 3. About the Business & Founding Vision */}
        <AboutAgencySection lang={lang} />

        {/* 4. Why Choose Our Services (6 Core Pillars) */}
        <WhyChooseUsSection lang={lang} />

        {/* 5. Selected Portfolio Projects (Real, existing case studies) */}
        <PortfolioSection
          lang={lang}
          onSelectService={handleSelectService}
        />

        {/* 6. Smart Service Cost Calculator with Dual Pricing Modes (Estimate & Custom Quote) */}
        <PriceCalculator
          lang={lang}
          services={services}
          currency={currency}
        />

        {/* 7. How the Project Process Works (4 Seamless Steps) */}
        <ProcessSection lang={lang} />

        {/* 8. Frequently Asked Questions */}
        <FAQSection lang={lang} />

        {/* 9. Contact & Instant WhatsApp Consultation */}
        <ContactWhatsAppSection lang={lang} />
      </main>

      {/* Footer Navigation */}
      <Footer lang={lang} />

      {/* Floating WhatsApp on Desktop */}
      <FloatingWhatsApp lang={lang} />

      {/* Fixed Sticky Action Bar on Mobile */}
      <MobileBottomBar lang={lang} />

      {/* Exit Intent Consultation Modal */}
      <ExitIntentModal lang={lang} />

    </div>
  );
}
