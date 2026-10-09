'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MkLogo from '@/components/MkLogo';
import { Order, OrderStatus, ServiceItem } from '@/lib/types';
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
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<'orders' | 'services'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [savingServices, setSavingServices] = useState(false);

  const refreshAdminData = async (token: string) => {
    setLoading(true);
    try {
      const [ordersRes, servicesRes] = await Promise.all([
        fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/services'),
      ]);

      if (ordersRes.status === 401) {
        sessionStorage.removeItem('mk_admin_token');
        setSessionToken(null);
        setAuthError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
        return;
      }

      const ordersData = await ordersRes.json();
      const servicesData = await servicesRes.json();

      if (ordersData.orders) setOrders(ordersData.orders);
      if (servicesData.services) setServices(servicesData.services);
    } catch {
      setAuthError('تعذر جلب البيانات، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!sessionToken) return;

    const loadInitialData = async () => {
      try {
        const [ordersRes, servicesRes] = await Promise.all([
          fetch('/api/orders', {
            headers: { Authorization: `Bearer ${sessionToken}` },
          }),
          fetch('/api/services'),
        ]);

        if (!isMounted) return;

        if (ordersRes.status === 401) {
          sessionStorage.removeItem('mk_admin_token');
          setSessionToken(null);
          setAuthError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً');
          return;
        }

        const ordersData = await ordersRes.json();
        const servicesData = await servicesRes.json();

        if (isMounted) {
          if (ordersData.orders) setOrders(ordersData.orders);
          if (servicesData.services) setServices(servicesData.services);
        }
      } catch {
        if (isMounted) setAuthError('تعذر جلب البيانات، يرجى المحاولة لاحقاً');
      }
    };

    loadInitialData();

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
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setIsLocked(true);
          setRemainingMinutes(data.remainingMinutes || 10);
        } else if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts);
        }
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      // Success
      setSessionToken(data.token);
      sessionStorage.setItem('mk_admin_token', data.token);
      setIsLocked(false);
      setPassword('');
      refreshAdminData(data.token);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mk_admin_token');
    setSessionToken(null);
    setOrders([]);
    setPassword('');
  };

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
        setFeedbackMsg('تم تحديث حالة الطلب بنجاح');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error changing status:', err);
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Code', 'Date', 'Client Name', 'Phone', 'Service', 'Price (EGP)', 'Status', 'Details'];
    const rows = orders.map((o) => [
      o.orderCode,
      new Date(o.createdAt).toLocaleString(),
      `"${o.fullName.replace(/"/g, '""')}"`,
      `"${o.countryCode}${o.phone}"`,
      `"${o.serviceNameAr.replace(/"/g, '""')}"`,
      o.finalPrice,
      o.status,
      `"${o.details.replace(/"/g, '""')}"`,
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

  const handlePriceChange = (id: string, newPrice: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, price: newPrice } : s))
    );
  };

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
        body: JSON.stringify({
          services,
        }),
      });

      if (res.ok) {
        setFeedbackMsg('تم حفظ وتحديث الأسعار بنجاح في الموقع!');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingServices(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesQuery =
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans" dir="rtl">
      
      {/* Top Admin Header */}
      <header className="bg-[#121212] border-b border-[#C9A227]/30 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MkLogo size="sm" showSubtitle={false} />
            <div className="hidden sm:block border-r border-neutral-700 pr-3 mr-3">
              <span className="text-xs font-bold text-[#C9A227] tracking-wider uppercase block">
                بوابة الإدارة الآمنة
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
                هذه البوابة مخصصة لإدارة طلبات وتحديث أسعار خدمات مبارك كبيدة. يرجى إدخال كلمة المرور السرية للمتابعة.
              </p>

              {/* Rate limit warning banner */}
              {isLocked ? (
                <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-start flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">تم حظر تسجيل الدخول مؤقتاً!</span>
                    <span>تم تجاوز الحد الأقصى للمحاولات (5 محاولات خاطئة). يرجى الانتظار {remainingMinutes || 10} دقائق لحماية الحساب.</span>
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
                      تنبيه: متبقي لديك {remainingAttempts} من 5 محاولات قبل الحظر المؤقت
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLocked || loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FFECA8] via-[#E5C158] to-[#C9A227] hover:from-white hover:to-[#E5C158] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(201,162,39,0.3)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}
                </button>
              </form>

              <div className="mt-8 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>حماية مشددة: 5 محاولات كحد أقصى ثم إغلاق لمدة 10 دقائق</span>
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
              <div className="flex gap-2.5">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
                  }`}
                >
                  الطلبات الواردة ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-[#C9A227] text-black shadow-md'
                      : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
                  }`}
                >
                  تعديل أسعار الخدمات ({services.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'orders' ? (
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
                ) : (
                  <button
                    onClick={handleSavePrices}
                    disabled={savingServices}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-black text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingServices ? 'جاري الحفظ...' : 'حفظ الأسعار وتحديث الموقع'}</span>
                  </button>
                )}
              </div>
            </div>

            {activeTab === 'orders' ? (
              /* Orders Management Table */
              <div className="space-y-4">
                
                {/* Search and Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث برقم الطلب (MK-1001)، أو اسم العميل، أو رقم الهاتف..."
                      className="w-full pr-10 pl-4 py-3 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-[#141414] border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#C9A227] focus:outline-none"
                    >
                      <option value="all">كافة الحالات ({orders.length})</option>
                      <option value="new">طلبات جديدة فقط</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="in_progress">قيد التنفيذ</option>
                      <option value="delivered">تم التسليم والاعتماد</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>

                {/* Table Container */}
                <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-[#141414] shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-[#0E0E0E] text-neutral-400 font-serif text-[11px]">
                          <th className="p-4 text-start">رقم وتاريخ الطلب</th>
                          <th className="p-4 text-start">بيانات العميل</th>
                          <th className="p-4 text-start">الخدمة المطلوبة</th>
                          <th className="p-4 text-start">السعر النهائي</th>
                          <th className="p-4 text-start">حالة الطلب</th>
                          <th className="p-4 text-start">إجراء مباشر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-10 text-center text-neutral-500 italic">
                              لا توجد طلبات تطابق معايير البحث.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-neutral-900/60 transition-colors">
                              <td className="p-4">
                                <span className="font-mono font-bold text-[#E5C158] text-sm block">
                                  #{ord.orderCode}
                                </span>
                                <span className="text-[10px] text-neutral-500 block mt-0.5">
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
                                <span className="font-bold text-white block text-sm">
                                  {ord.fullName}
                                </span>
                                <span className="text-neutral-400 font-mono text-xs dir-ltr block text-left mt-0.5">
                                  {ord.countryCode} {ord.phone}
                                </span>
                                {ord.email && (
                                  <span className="text-neutral-500 text-[10px] block truncate max-w-[180px]">
                                    {ord.email}
                                  </span>
                                )}
                              </td>

                              <td className="p-4 max-w-[240px]">
                                <span className="text-white font-medium block truncate">
                                  {ord.serviceNameAr}
                                </span>
                                <span className="text-[11px] text-neutral-400 block line-clamp-2 mt-0.5">
                                  {ord.details}
                                </span>
                              </td>

                              <td className="p-4 font-mono tabular-nums font-bold text-sm text-[#E5C158] whitespace-nowrap">
                                {ord.finalPrice.toLocaleString()} ج.م
                              </td>

                              <td className="p-4">
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                                    ord.status === 'delivered'
                                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
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
                                  <option value="contacted">تم التواصل (Contacted)</option>
                                  <option value="in_progress">قيد التنفيذ (In Progress)</option>
                                  <option value="delivered">تم التسليم (Delivered)</option>
                                  <option value="cancelled">ملغي (Cancelled)</option>
                                </select>
                              </td>

                              <td className="p-4">
                                <a
                                  href={`https://wa.me/${ord.countryCode.replace('+', '')}${ord.phone.replace(/^0+/, '')}?text=${encodeURIComponent(`مرحباً ${ord.fullName}! معك مبارك كبيدة بخصوص طلبك #${ord.orderCode}.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black font-bold text-xs transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>محادثة واتساب</span>
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              /* Services Rate Editor */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 flex items-center justify-between">
                  <p className="text-xs text-neutral-300">
                    عدّل أسعار الخدمات المعروضة بالموقع بالجنيه المصري (EGP). اضغط زر «حفظ الأسعار وتحديث الموقع» بالقمة لتفعيلها فوراً.
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
                          onChange={(e) => handlePriceChange(svc.id, Number(e.target.value))}
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

    </div>
  );
}
