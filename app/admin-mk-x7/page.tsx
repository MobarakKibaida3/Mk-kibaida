'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MkLogo from '@/components/MkLogo';
import { 
  Order, 
  OrderStatus, 
  ServiceItem, 
  ServicePricingRule, 
  PricingMode, 
  CurrencyCode 
} from '@/lib/types';
import { calculateAuthoritativeEstimate } from '@/lib/calculatorEngine';
import { 
  Lock, 
  Download, 
  RefreshCw, 
  MessageCircle, 
  Search, 
  CheckCircle2, 
  Save, 
  LogOut, 
  ShieldAlert, 
  AlertTriangle,
  Clock,
  ExternalLink,
  Calculator,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  Sliders,
  Check,
  ChevronDown,
  X,
  Edit3
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPortalPage() {
  const [password, setPassword] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mk_admin_token');
    }
    return null;
  });
  const [authError, setAuthError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Admin Workspace states
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricingRules, setPricingRules] = useState<ServicePricingRule[]>([]);
  const [draftRules, setDraftRules] = useState<ServicePricingRule[]>([]);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'calculator'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [savingServices, setSavingServices] = useState(false);
  const [savingRules, setSavingRules] = useState(false);

  // Quotation Management Modal / Active Order
  const [selectedOrderForQuote, setSelectedOrderForQuote] = useState<Order | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState<string>('');
  const [quoteDeliveryInput, setQuoteDeliveryInput] = useState<string>('');
  const [quoteNotesInput, setQuoteNotesInput] = useState<string>('');
  const [updatingQuote, setUpdatingQuote] = useState(false);

  // Active Rule Editor in Calculator Tab
  const [selectedRuleId, setSelectedRuleId] = useState<string>('shopify-store-dev');

  // Preview Sandbox state
  const [previewUnits, setPreviewUnits] = useState<number>(5);
  const [previewFeatures, setPreviewFeatures] = useState<string[]>([]);
  const [previewComplexity, setPreviewComplexity] = useState<string>('standard');
  const [previewAdditional, setPreviewAdditional] = useState<string[]>([]);

  const refreshAdminData = async (token: string) => {
    setLoading(true);
    try {
      const [ordersRes, servicesRes, rulesRes] = await Promise.all([
        fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/services'),
        fetch('/api/admin/calculator-pricing', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (ordersRes.status === 401 || rulesRes.status === 401) {
        sessionStorage.removeItem('mk_admin_token');
        setSessionToken(null);
        setAuthError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
        return;
      }

      const ordersData = await ordersRes.json();
      const servicesData = await servicesRes.json();
      const rulesData = await rulesRes.json();

      if (ordersData.orders) setOrders(ordersData.orders);
      if (servicesData.services) setServices(servicesData.services);
      if (rulesData.rules) {
        setPricingRules(rulesData.rules);
        setDraftRules(JSON.parse(JSON.stringify(rulesData.rules)));
        if (rulesData.rules.length > 0 && !rulesData.rules.some((r: ServicePricingRule) => r.serviceId === selectedRuleId)) {
          setSelectedRuleId(rulesData.rules[0].serviceId);
        }
      }
    } catch {
      setAuthError('تعذر جلب البيانات، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!sessionToken) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersRes, servicesRes, rulesRes] = await Promise.all([
          fetch('/api/orders', { headers: { Authorization: `Bearer ${sessionToken}` } }),
          fetch('/api/services'),
          fetch('/api/admin/calculator-pricing', { headers: { Authorization: `Bearer ${sessionToken}` } }),
        ]);

        if (!isMounted) return;

        if (ordersRes.status === 401 || rulesRes.status === 401) {
          sessionStorage.removeItem('mk_admin_token');
          setSessionToken(null);
          setAuthError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
          return;
        }

        const ordersData = await ordersRes.json();
        const servicesData = await servicesRes.json();
        const rulesData = await rulesRes.json();

        if (ordersData.orders) setOrders(ordersData.orders);
        if (servicesData.services) setServices(servicesData.services);
        if (rulesData.rules) {
          setPricingRules(rulesData.rules);
          setDraftRules(JSON.parse(JSON.stringify(rulesData.rules)));
        }
      } catch {
        if (isMounted) setAuthError('تعذر جلب البيانات، يرجى المحاولة لاحقاً');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [sessionToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isLocked) {
          setIsLocked(true);
          setRemainingMinutes(data.remainingMinutes);
        } else if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        setAuthError(data.error || 'فشل تسجيل الدخول');
        return;
      }

      sessionStorage.setItem('mk_admin_token', data.token);
      setSessionToken(data.token);
      setPassword('');
      setFeedbackMsg('تم تسجيل الدخول بنجاح');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch {
      setAuthError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mk_admin_token');
    setSessionToken(null);
    setOrders([]);
    setServices([]);
  };

  // Status Change in Orders Table
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!sessionToken) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setFeedbackMsg(`تم تحديث حالة الطلب إلى "${newStatus}"`);
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Quotation Modal
  const openQuotationEditor = (order: Order) => {
    setSelectedOrderForQuote(order);
    setQuotePriceInput(order.quotedPrice ? String(order.quotedPrice) : order.finalPrice ? String(order.finalPrice) : '');
    setQuoteDeliveryInput(order.estimatedDelivery || '');
    setQuoteNotesInput(order.adminNotes || '');
  };

  // Save Quotation Details
  const handleSaveQuotation = async () => {
    if (!sessionToken || !selectedOrderForQuote) return;
    setUpdatingQuote(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          orderId: selectedOrderForQuote.id,
          status: 'quoted' as OrderStatus,
          quotedPrice: quotePriceInput ? Number(quotePriceInput) : undefined,
          estimatedDelivery: quoteDeliveryInput,
          adminNotes: quoteNotesInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrderForQuote.id ? data.order : o))
        );
        setSelectedOrderForQuote(data.order);
        setFeedbackMsg('تم حفظ وتحديث تفاصيل عرض السعر بنجاح!');
        setTimeout(() => setFeedbackMsg(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingQuote(false);
    }
  };

  // Save Services Table
  const handleSavePrices = async () => {
    if (!sessionToken) return;
    setSavingServices(true);
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ services }),
      });

      if (res.ok) {
        setFeedbackMsg('تم حفظ وتحديث أسعار الخدمات بنجاح في الموقع!');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingServices(false);
    }
  };

  // Save Calculator Pricing Rules
  const handleSavePricingRules = async () => {
    if (!sessionToken) return;
    setSavingRules(true);
    try {
      const res = await fetch('/api/admin/calculator-pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ rules: draftRules }),
      });

      if (res.ok) {
        setPricingRules(JSON.parse(JSON.stringify(draftRules)));
        setFeedbackMsg('تم حفظ ونشر قواعد تسعير الحاسبة الذكية بنجاح!');
        setTimeout(() => setFeedbackMsg(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRules(false);
    }
  };

  // Cancel / Reset Calculator Draft
  const handleCancelPricingRulesDraft = () => {
    setDraftRules(JSON.parse(JSON.stringify(pricingRules)));
    setFeedbackMsg('تم إلغاء التعديلات غير المحفوظة واستعادة القواعد المنشورة.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Active Draft Rule helper
  const activeDraftRule = draftRules.find((r) => r.serviceId === selectedRuleId) || draftRules[0];

  const updateActiveDraftRule = (updates: Partial<ServicePricingRule>) => {
    setDraftRules((prev) =>
      prev.map((r) => (r.serviceId === selectedRuleId ? { ...r, ...updates } : r))
    );
  };

  // Feature modifier in active draft
  const handleAddFeature = () => {
    if (!activeDraftRule) return;
    const newFeature = {
      id: `feat-${Date.now()}`,
      nameAr: 'ميزة جديدة',
      nameEn: 'New Feature',
      price: 500,
    };
    updateActiveDraftRule({
      features: [...(activeDraftRule.features || []), newFeature],
    });
  };

  const handleUpdateFeature = (index: number, key: string, val: string | number) => {
    if (!activeDraftRule) return;
    const updated = [...(activeDraftRule.features || [])];
    updated[index] = { ...updated[index], [key]: val };
    updateActiveDraftRule({ features: updated });
  };

  const handleDeleteFeature = (index: number) => {
    if (!activeDraftRule) return;
    const updated = [...(activeDraftRule.features || [])];
    updated.splice(index, 1);
    updateActiveDraftRule({ features: updated });
  };

  // Calculate live preview for admin sandbox
  const livePreviewBreakdown = activeDraftRule
    ? calculateAuthoritativeEstimate(activeDraftRule, {
        serviceId: activeDraftRule.serviceId,
        unitsCount: previewUnits,
        featureIds: previewFeatures,
        complexityId: previewComplexity,
        additionalIds: previewAdditional,
        currency: activeDraftRule.currency || 'EGP',
      })
    : null;

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    const matchesQuery =
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    let matchesType = true;
    if (typeFilter === 'quotations') {
      matchesType = o.requestType === 'quotation_request' || o.orderCode.startsWith('MK-Q');
    } else if (typeFilter === 'estimates') {
      matchesType = o.source === 'smart_calculator' && o.requestType !== 'quotation_request';
    } else if (typeFilter === 'direct') {
      matchesType = o.source === 'direct_form';
    }

    return matchesQuery && matchesStatus && matchesType;
  });

  const exportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Code', 'Name', 'Phone', 'Email', 'Service', 'Final Price', 'Quoted Price', 'Type', 'Status', 'Date'];
    const rows = orders.map((o) => [
      `"${o.orderCode}"`,
      `"${o.fullName}"`,
      `"${o.countryCode}${o.phone}"`,
      `"${o.email || ''}"`,
      `"${o.serviceNameAr}"`,
      o.finalPrice,
      o.quotedPrice || '',
      `"${o.requestType || o.source}"`,
      `"${o.status}"`,
      `"${o.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mk_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans" dir="rtl">
      
      {/* Top Admin Header */}
      <header className="bg-[#121212] border-b border-[#C9A227]/30 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MkLogo size="sm" showSubtitle={false} />
            <div className="hidden sm:block border-r border-neutral-700 pr-3 mr-3">
              <span className="text-xs font-bold text-[#C9A227] tracking-wider uppercase block">
                بوابة الإدارة والتسعير الذكي
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                /admin-mk-x7
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg border border-neutral-800"
            >
              <span>معاينة الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
            </Link>

            {sessionToken && (
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/50 bg-red-950/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">
        {!sessionToken ? (
          /* Secure Login View */
          <div className="max-w-md mx-auto py-16">
            <div className="rounded-3xl bg-[#141414] border-2 border-[#C9A227]/40 p-8 shadow-2xl text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-[#C9A227]/40 mx-auto flex items-center justify-center text-[#C9A227] mb-5 shadow-lg">
                <Lock className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-white font-serif mb-2">
                تسجيل دخول المشرف
              </h2>
              
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                هذه البوابة مخصصة لإدارة الطلبات وعروض الأسعار وقواعد التسعير التلقائي لمبارك كبيدة.
              </p>

              {isLocked ? (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-start flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">تم حظر تسجيل الدخول مؤقتاً!</span>
                    <span>تم تجاوز الحد الأقصى للمحاولات (5 محاولات خاطئة). يرجى الانتظار {remainingMinutes || 10} دقائق.</span>
                  </div>
                </div>
              ) : authError ? (
                <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-start flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              ) : null}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    disabled={isLocked || loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور السرية"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-center text-sm font-mono tracking-widest focus:border-[#C9A227] focus:outline-none transition-colors disabled:opacity-50"
                  />
                  {remainingAttempts !== null && remainingAttempts > 0 && !isLocked && (
                    <span className="text-[11px] text-amber-400 mt-1.5 block">
                      تنبيه: متبقي لديك {remainingAttempts} من 5 محاولات
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLocked || loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all cursor-pointer disabled:opacity-40"
                >
                  {loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}
                </button>
              </form>

              <div className="mt-8 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>حماية مشددة: 5 محاولات كحد أقصى ثم إغلاق مؤقت</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-6">
            
            {/* Feedback Message Toast */}
            {feedbackMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Navigation Tabs and Top Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>الطلبات وعروض الأسعار ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'calculator'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>إعدادات الحاسبة والتسعير الذكي ({draftRules.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'services'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>أسعار الخدمات العامة ({services.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'orders' && (
                  <>
                    <button
                      onClick={() => refreshAdminData(sessionToken)}
                      className="p-2.5 rounded-xl bg-[#141414] border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      title="تحديث البيانات"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#C9A227]/40 text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#C9A227]" />
                      <span>تصدير CSV</span>
                    </button>
                  </>
                )}

                {activeTab === 'calculator' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelPricingRulesDraft}
                      className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 transition-all cursor-pointer"
                    >
                      إلغاء المسودة
                    </button>

                    <button
                      onClick={handleSavePricingRules}
                      disabled={savingRules}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-black text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingRules ? 'جاري الحفظ...' : 'حفظ ونشر قواعد التسعير'}</span>
                    </button>
                  </div>
                )}

                {activeTab === 'services' && (
                  <button
                    onClick={handleSavePrices}
                    disabled={savingServices}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-black text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingServices ? 'جاري الحفظ...' : 'حفظ أسعار الخدمات'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: ORDERS & QUOTATION REQUESTS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Search and Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث برقم الطلب (MK-1001 / MK-Q1001)، أو اسم العميل..."
                      className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                    >
                      <option value="all">كافة أنواع الطلبات ({orders.length})</option>
                      <option value="quotations">عروض أسعار مخصصة (Quotes)</option>
                      <option value="estimates">طلبات الحاسبة التقديرية</option>
                      <option value="direct">طلبات النموذج المباشر</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                    >
                      <option value="all">كافة الحالات</option>
                      <option value="new">طلبات جديدة (New)</option>
                      <option value="quoted">تم تسعير العرض (Quoted)</option>
                      <option value="contacted">تم التواصل (Contacted)</option>
                      <option value="in_progress">قيد التنفيذ (In Progress)</option>
                      <option value="delivered">تم التسليم (Delivered)</option>
                      <option value="cancelled">ملغي (Cancelled)</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#141414] shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-[#0E0E0E] text-neutral-400 font-serif text-[11px]">
                          <th className="p-4 text-start">رقم وتاريخ الطلب</th>
                          <th className="p-4 text-start">العميل والتواصل</th>
                          <th className="p-4 text-start">الخدمة والتفاصيل</th>
                          <th className="p-4 text-start">السعر والنوع</th>
                          <th className="p-4 text-start">حالة الطلب</th>
                          <th className="p-4 text-start">إجراءات الإدارة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-10 text-center text-neutral-500 font-serif text-sm">
                              لا توجد طلبات أو عروض أسعار مطابقة للبحث.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => {
                            const isQuote = ord.requestType === 'quotation_request' || ord.orderCode.startsWith('MK-Q');
                            return (
                              <tr key={ord.id} className="hover:bg-[#181818] transition-colors">
                                <td className="p-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-sm text-[#E5C158]">
                                      #{ord.orderCode}
                                    </span>
                                    {isQuote && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                                        عرض مخصص
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-neutral-500 font-mono block mt-1">
                                    {new Date(ord.createdAt).toLocaleDateString('ar-EG', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </td>

                                <td className="p-4">
                                  <span className="font-bold text-white block text-sm mb-0.5">
                                    {ord.fullName}
                                  </span>
                                  <span className="text-neutral-400 font-mono text-xs block dir-ltr text-right">
                                    {ord.countryCode} {ord.phone}
                                  </span>
                                  {ord.email && (
                                    <span className="text-[11px] text-neutral-500 block truncate max-w-[170px]">
                                      {ord.email}
                                    </span>
                                  )}
                                </td>

                                <td className="p-4 max-w-xs">
                                  <span className="font-bold text-neutral-200 block truncate">
                                    {ord.serviceNameAr}
                                  </span>
                                  <span className="text-[11px] text-neutral-400 block line-clamp-2 mt-0.5 whitespace-pre-line">
                                    {ord.details}
                                  </span>
                                  {ord.budgetRange && (
                                    <span className="text-[10px] text-amber-400 block mt-1">
                                      ميزانية العميل: {ord.budgetRange}
                                    </span>
                                  )}
                                </td>

                                <td className="p-4 whitespace-nowrap">
                                  {isQuote ? (
                                    ord.quotedPrice ? (
                                      <div>
                                        <span className="text-[10px] text-neutral-400 block">عرض السعر المعتمد:</span>
                                        <span className="font-mono tabular-nums font-bold text-sm text-emerald-400">
                                          {ord.quotedPrice.toLocaleString()} ج.م
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-amber-400 text-xs font-bold block">
                                        بانتظار التسعير
                                      </span>
                                    )
                                  ) : (
                                    <div>
                                      <span className="text-[10px] text-neutral-400 block">التقدير المحسوب:</span>
                                      <span className="font-mono tabular-nums font-bold text-sm text-[#E5C158]">
                                        {ord.finalPrice.toLocaleString()} ج.م
                                      </span>
                                    </div>
                                  )}
                                </td>

                                <td className="p-4 whitespace-nowrap">
                                  <select
                                    value={ord.status}
                                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                                      ord.status === 'delivered'
                                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                        : ord.status === 'quoted'
                                        ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                                        : ord.status === 'in_progress'
                                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                        : ord.status === 'contacted'
                                        ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                                        : ord.status === 'cancelled'
                                        ? 'bg-red-950/80 text-red-300 border-red-500/40'
                                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                                    }`}
                                  >
                                    <option value="new">جديد (New)</option>
                                    <option value="quoted">تم التسعير (Quoted)</option>
                                    <option value="contacted">تم التواصل (Contacted)</option>
                                    <option value="in_progress">قيد التنفيذ (In Progress)</option>
                                    <option value="delivered">تم التسليم (Delivered)</option>
                                    <option value="cancelled">ملغي (Cancelled)</option>
                                  </select>
                                </td>

                                <td className="p-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    {isQuote && (
                                      <button
                                        type="button"
                                        onClick={() => openQuotationEditor(ord)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C9A227]/20 hover:bg-[#C9A227] text-[#E5C158] hover:text-black font-bold text-xs transition-colors cursor-pointer"
                                        title="تحديد سعر وموعد العرض وإضافة ملاحظات"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>إعداد العرض</span>
                                      </button>
                                    )}

                                    <a
                                      href={`https://wa.me/${ord.countryCode.replace('+', '')}${ord.phone.replace(/^0+/, '')}?text=${encodeURIComponent(
                                        isQuote && ord.quotedPrice
                                          ? `مرحباً ${ord.fullName}! معك مبارك كبيدة بخصوص طلب عرض السعر #${ord.orderCode} لخدمة (${ord.serviceNameAr}). تم إعداد عرض السعر بقيمة: ${ord.quotedPrice.toLocaleString()} ج.م، ومدة تسليم متوقعة: ${ord.estimatedDelivery || 'حسب الاتفاق'}.`
                                          : `مرحباً ${ord.fullName}! معك مبارك كبيدة بخصوص طلبك #${ord.orderCode} لخدمة (${ord.serviceNameAr}).`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black font-bold text-xs transition-colors"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      <span>واتساب</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SMART CALCULATOR PRICING RULES EDITOR & PREVIEW SANDBOX */}
            {activeTab === 'calculator' && activeDraftRule && (
              <div className="space-y-6">
                
                {/* Intro & Rules Status */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-serif">
                      إدارة القواعد الحسابية وأنماط التسعير للحاسبة الذكية
                    </h3>
                    <p className="text-xs text-neutral-400">
                      يمكنك تحديد نمط التسعير لكل خدمة (تقدير تلقائي، عرض مخصص، أو هجين) وضبط أسعار الوحدات، الميزات، والتعقيد دون تعديل الكود.
                    </p>
                  </div>
                </div>

                {/* Service Selector Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
                  {draftRules.map((rule) => {
                    const isSelected = selectedRuleId === rule.serviceId;
                    return (
                      <button
                        key={rule.serviceId}
                        type="button"
                        onClick={() => setSelectedRuleId(rule.serviceId)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-[#C9A227] text-black border-[#C9A227] shadow-md font-black'
                            : 'bg-[#141414] text-neutral-300 hover:text-white border-neutral-800'
                        }`}
                      >
                        <span>{rule.nameAr}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          rule.mode === 'quotation' ? 'bg-black/30 text-amber-200' : 'bg-black/20 text-black'
                        }`}>
                          {rule.mode === 'quotation' ? 'عرض مخصص' : rule.mode === 'hybrid' ? 'هجين' : 'تقدير'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Editor & Live Preview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left: Configuration Form (7 cols) */}
                  <div className="lg:col-span-7 space-y-6 rounded-3xl bg-[#141414] border border-neutral-800 p-6 sm:p-8">
                    
                    {/* Mode & Enable Switches */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-neutral-800">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          نمط التسعير (Pricing Mode):
                        </label>
                        <select
                          value={activeDraftRule.mode}
                          onChange={(e) => updateActiveDraftRule({ mode: e.target.value as PricingMode })}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-700 text-white text-xs font-bold focus:border-[#C9A227] focus:outline-none"
                        >
                          <option value="estimate">تقدير تلقائي محسوب (Automatic Estimate)</option>
                          <option value="quotation">طلب عرض سعر مخصص يدوي (Custom Quotation)</option>
                          <option value="hybrid">هجين: تقدير أولي + طلب عرض سعر (Hybrid)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          حالة تفعيل التسعير التقديري:
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={activeDraftRule.enabled}
                              onChange={(e) => updateActiveDraftRule({ enabled: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A227]" />
                          </label>
                          <span className="text-xs text-neutral-300 font-bold">
                            {activeDraftRule.enabled ? 'مفعل في الحاسبة' : 'معطل'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Base Pricing and Currency */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-neutral-800">
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          السعر الأساسي (Base Price):
                        </label>
                        <input
                          type="number"
                          value={activeDraftRule.basePrice}
                          onChange={(e) => updateActiveDraftRule({ basePrice: Number(e.target.value) })}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-700 text-[#E5C158] font-mono text-sm font-bold focus:border-[#C9A227] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          العملة الأساسية:
                        </label>
                        <select
                          value={activeDraftRule.currency}
                          onChange={(e) => updateActiveDraftRule({ currency: e.target.value as CurrencyCode })}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-700 text-white text-xs font-bold focus:border-[#C9A227] focus:outline-none"
                        >
                          <option value="EGP">جنيه مصري (EGP)</option>
                          <option value="SAR">ريال سعودي (SAR)</option>
                          <option value="USD">دولار أمريكي (USD)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2">
                          نسبة الخصم الترويجي (%):
                        </label>
                        <input
                          type="number"
                          value={activeDraftRule.discountPercentage}
                          onChange={(e) => updateActiveDraftRule({ discountPercentage: Number(e.target.value) })}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-700 text-emerald-400 font-mono text-sm font-bold focus:border-[#C9A227] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Units Configuration */}
                    <div className="space-y-4 pb-6 border-b border-neutral-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-200">
                          نظام الوحدات الإضافية (مثل الصفحات أو عناصر التصميم):
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeDraftRule.hasUnits}
                            onChange={(e) => updateActiveDraftRule({ hasUnits: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A227]" />
                        </label>
                      </div>

                      {activeDraftRule.hasUnits && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#0A0A0A] p-4 rounded-2xl border border-neutral-800">
                          <div>
                            <label className="block text-[11px] text-neutral-400 mb-1">
                              مسمى الوحدة (عربي):
                            </label>
                            <input
                              type="text"
                              value={activeDraftRule.unitLabelAr || ''}
                              onChange={(e) => updateActiveDraftRule({ unitLabelAr: e.target.value })}
                              placeholder="مثال: صفحة ويب"
                              className="w-full px-2.5 py-2 rounded-lg bg-[#141414] border border-neutral-700 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-neutral-400 mb-1">
                              عدد الوحدات المشمولة أساساً:
                            </label>
                            <input
                              type="number"
                              value={activeDraftRule.baseUnitsIncluded}
                              onChange={(e) => updateActiveDraftRule({ baseUnitsIncluded: Number(e.target.value) })}
                              className="w-full px-2.5 py-2 rounded-lg bg-[#141414] border border-neutral-700 text-xs font-mono text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-neutral-400 mb-1">
                              سعر الوحدة الإضافية:
                            </label>
                            <input
                              type="number"
                              value={activeDraftRule.pricePerAdditionalUnit}
                              onChange={(e) => updateActiveDraftRule({ pricePerAdditionalUnit: Number(e.target.value) })}
                              className="w-full px-2.5 py-2 rounded-lg bg-[#141414] border border-neutral-700 text-xs font-mono text-[#E5C158]"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Features Editor */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-200">
                          الميزات والوظائف الإضافية الخاصة بهذه الخدمة ({activeDraftRule.features?.length || 0}):
                        </label>
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C9A227]/20 text-[#E5C158] text-xs font-bold hover:bg-[#C9A227] hover:text-black transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة ميزة</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {activeDraftRule.features?.map((feat, idx) => (
                          <div
                            key={feat.id || idx}
                            className="flex items-center gap-2 bg-[#0A0A0A] p-2.5 rounded-xl border border-neutral-800"
                          >
                            <input
                              type="text"
                              value={feat.nameAr}
                              onChange={(e) => handleUpdateFeature(idx, 'nameAr', e.target.value)}
                              placeholder="اسم الميزة بالعربية"
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#141414] border border-neutral-700 text-xs text-white"
                            />
                            <div className="w-28 flex items-center gap-1">
                              <input
                                type="number"
                                value={feat.price}
                                onChange={(e) => handleUpdateFeature(idx, 'price', Number(e.target.value))}
                                className="w-full px-2 py-1.5 rounded-lg bg-[#141414] border border-neutral-700 text-xs font-mono text-[#E5C158] text-center"
                              />
                              <span className="text-[10px] text-neutral-400 font-mono">ج.م</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(idx)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition-colors"
                              title="حذف الميزة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right: Live Preview Sandbox & Price Breakdown Verification (5 cols) */}
                  <div className="lg:col-span-5 sticky top-24 space-y-4">
                    <div className="rounded-3xl bg-[#141414] border-2 border-[#C9A227]/50 p-6 shadow-2xl space-y-4">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-[#C9A227]" />
                          <span className="text-xs font-bold text-[#E5C158] font-serif uppercase tracking-wider">
                            معاينة حية فورية للمسودة (Preview Sandbox)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          Live Test
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-400">
                        تحقق من الحساب الرياضي الديناميكي قبل الحفظ النهائي للموقع العام.
                      </p>

                      {/* Interactive sandbox controls */}
                      <div className="space-y-3 bg-[#0A0A0A] p-4 rounded-2xl border border-neutral-800 text-xs">
                        {activeDraftRule.hasUnits && (
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-400">عدد الوحدات للاختبار:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPreviewUnits((prev) => Math.max(1, prev - 1))}
                                className="w-6 h-6 rounded bg-[#1A1A1A] text-white flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-white w-8 text-center">{previewUnits}</span>
                              <button
                                onClick={() => setPreviewUnits((prev) => prev + 1)}
                                className="w-6 h-6 rounded bg-[#1A1A1A] text-white flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">مستوى التعقيد:</span>
                          <select
                            value={previewComplexity}
                            onChange={(e) => setPreviewComplexity(e.target.value)}
                            className="px-2 py-1 rounded bg-[#141414] border border-neutral-700 text-xs text-white"
                          >
                            <option value="standard">قياسي (1.0x)</option>
                            <option value="advanced">متقدم (1.25x)</option>
                            <option value="enterprise">مؤسسي (1.5x)</option>
                          </select>
                        </div>
                      </div>

                      {/* Calculated breakdown result */}
                      {livePreviewBreakdown && livePreviewBreakdown.effectiveMode !== 'quotation' ? (
                        <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs">
                          <div className="flex justify-between text-neutral-400">
                            <span>السعر الأساسي:</span>
                            <span className="font-mono text-white">{livePreviewBreakdown.breakdown.basePrice.toLocaleString()} ج.م</span>
                          </div>

                          {livePreviewBreakdown.breakdown.extraUnitsCount && livePreviewBreakdown.breakdown.extraUnitsCount > 0 ? (
                            <div className="flex justify-between text-neutral-400">
                              <span>تكلفة الوحدات الإضافية ({livePreviewBreakdown.breakdown.extraUnitsCount}):</span>
                              <span className="font-mono text-white">+{livePreviewBreakdown.breakdown.unitsCost.toLocaleString()} ج.م</span>
                            </div>
                          ) : null}

                          <div className="flex justify-between text-neutral-400">
                            <span>معامل التعقيد:</span>
                            <span className="font-mono text-[#E5C158]">{livePreviewBreakdown.breakdown.complexityMultiplier}x</span>
                          </div>

                          {livePreviewBreakdown.breakdown.discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-400 font-semibold">
                              <span>خصم ترويجي ({livePreviewBreakdown.breakdown.discountPercentage}%):</span>
                              <span className="font-mono">-{livePreviewBreakdown.breakdown.discountAmount.toLocaleString()} ج.م</span>
                            </div>
                          )}

                          <div className="flex justify-between items-baseline pt-3 border-t border-neutral-800">
                            <span className="text-sm font-bold text-white">إجمالي التقدير النهائي:</span>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4B8] via-[#E5C158] to-[#C9A227] font-mono tabular-nums">
                              {livePreviewBreakdown.breakdown.estimatedTotal.toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
                          تنبيه: هذه الخدمة في نمط «طلب عرض مخصص»، فلن يُعرض سعر تلقائي وسيتم توجيه العميل لتحديد الميزانية والموعد.
                        </div>
                      )}

                      {/* Save action button */}
                      <button
                        type="button"
                        onClick={handleSavePricingRules}
                        disabled={savingRules}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {savingRules ? 'جاري الحفظ...' : 'حفظ ونشر التعديلات للموقع'}
                      </button>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: SERVICES RATE EDITOR (ORIGINAL CATALOG) */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 flex items-center justify-between">
                  <p className="text-xs text-neutral-300">
                    عدّل أسعار الخدمات المعروضة بالموقع بالجنيه المصري (EGP). اضغط زر «حفظ أسعار الخدمات» بالقمة لتفعيلها فوراً.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-4 rounded-2xl bg-[#141414] border border-neutral-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <span className="text-xs font-mono text-[#C9A227] block mb-1">
                          #{String(svc.number).padStart(2, '0')} · {svc.category === 'core' ? 'خدمة أساسية' : 'حل إضافي'}
                        </span>
                        <h4 className="text-sm font-bold text-white font-serif mb-1">
                          {svc.nameAr}
                        </h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-1">
                          {svc.descriptionAr}
                        </p>
                      </div>

                      <div className="w-36 shrink-0 flex items-center gap-2">
                        <input
                          type="number"
                          value={svc.price}
                          onChange={(e) => {
                            const newP = Number(e.target.value);
                            setServices((prev) =>
                              prev.map((s) => (s.id === svc.id ? { ...s, price: newP } : s))
                            );
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-neutral-700 text-[#E5C158] font-mono text-sm font-bold text-center focus:border-[#C9A227] focus:outline-none"
                        />
                        <span className="text-xs text-neutral-400 whitespace-nowrap">ج.م</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Quotation Details & Pricing Modal for Admin */}
      {selectedOrderForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[#141414] border-2 border-[#C9A227] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#C9A227]" />
                <h3 className="text-lg font-bold text-white font-serif">
                  إعداد عرض السعر للطلب #{selectedOrderForQuote.orderCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForQuote(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Scope Summary */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-800 space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">اسم العميل:</span>
                <span className="font-bold text-white">{selectedOrderForQuote.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">الهاتف:</span>
                <span className="font-mono text-white">{selectedOrderForQuote.countryCode} {selectedOrderForQuote.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">الخدمة المطلوبة:</span>
                <span className="font-bold text-[#E5C158]">{selectedOrderForQuote.serviceNameAr}</span>
              </div>
              {selectedOrderForQuote.budgetRange && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">الميزانية المقترحة من العميل:</span>
                  <span className="text-amber-300 font-bold">{selectedOrderForQuote.budgetRange}</span>
                </div>
              )}
              {selectedOrderForQuote.preferredDeadline && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">الموعد المرغوب:</span>
                  <span className="text-neutral-300">{selectedOrderForQuote.preferredDeadline}</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-800">
                <span className="text-neutral-500 block mb-1">تفاصيل ومتطلبات العميل:</span>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-line bg-[#141414] p-2.5 rounded-xl border border-neutral-800">
                  {selectedOrderForQuote.details}
                </p>
              </div>
            </div>

            {/* Quotation inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  السعر المقترح النهائي (Quoted Price - EGP):
                </label>
                <input
                  type="number"
                  value={quotePriceInput}
                  onChange={(e) => setQuotePriceInput(e.target.value)}
                  placeholder="مثال: 7500"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-[#E5C158] font-mono text-base font-bold focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  مدة التنفيذ المتوقعة (Estimated Delivery Time):
                </label>
                <input
                  type="text"
                  value={quoteDeliveryInput}
                  onChange={(e) => setQuoteDeliveryInput(e.target.value)}
                  placeholder="مثال: 5 - 7 أيام عمل"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2">
                  ملاحظات الإدارة الداخلية (Internal Admin Notes):
                </label>
                <textarea
                  rows={2}
                  value={quoteNotesInput}
                  onChange={(e) => setQuoteNotesInput(e.target.value)}
                  placeholder="ملاحظات سرية للإدارة حول شروط التسليم أو الاتفاق..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveQuotation}
                  disabled={updatingQuote}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-black font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {updatingQuote ? 'جاري الحفظ...' : 'حفظ واعتماد عرض السعر (Mark as Quoted)'}
                </button>

                <a
                  href={`https://wa.me/${selectedOrderForQuote.countryCode.replace('+', '')}${selectedOrderForQuote.phone.replace(/^0+/, '')}?text=${encodeURIComponent(
                    `مرحباً ${selectedOrderForQuote.fullName}! معك مبارك كبيدة بخصوص طلبك #${selectedOrderForQuote.orderCode}.\nتمت مراجعة متطلبات مشروعك (${selectedOrderForQuote.serviceNameAr}) وتحديد عرض السعر:\nالسعر: ${quotePriceInput || 'حسب الاتفاق'} ج.م\nمدة التنفيذ: ${quoteDeliveryInput || '5 أيام عمل'}.\nأنا جاهز لمناقشة البدء فوراً.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>إرسال عبر واتساب</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
