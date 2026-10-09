import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold font-mono text-[#C9A227] mb-4">404</h1>
      <h2 className="text-xl font-bold mb-2">الصفحة غير موجودة</h2>
      <p className="text-sm text-neutral-400 mb-6">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-black font-bold text-sm"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
