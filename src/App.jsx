import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { wishesData } from './wishesData';
import PetalsCanvas from './components/PetalsCanvas';

function isArabic(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [likes, setLikes] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const touchStartX = useRef(null);

  const filteredWishes = wishesData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredWishes.length);
  }, [filteredWishes.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredWishes.length) % filteredWishes.length);
  }, [filteredWishes.length]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying || viewMode !== 'carousel' || filteredWishes.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, viewMode, filteredWishes.length, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== 'carousel') return;
      if (e.key === 'ArrowLeft') nextSlide();
      if (e.key === 'ArrowRight') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, nextSlide, prevSlide]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C5A059', '#D9CBBA', '#8C6D58', '#E8D5A5']
      });
    } catch {
      // fallback
    }
  };

  const toggleLike = (id) => {
    const isNowLiked = !likes[id];
    setLikes((prev) => ({ ...prev, [id]: isNowLiked }));
    if (isNowLiked) {
      triggerConfetti();
    }
  };

  const copyWish = (wish) => {
    navigator.clipboard.writeText(`"${wish.message}" — ${wish.name}`);
    setToastMessage('تم نسخ التهنئة الرقيقة إلى الحافظة ✨');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentWish = filteredWishes[currentIndex] || wishesData[0];

  return (
    <div className="relative min-h-screen text-wedding-espresso selection:bg-wedding-sand selection:text-wedding-espresso flex flex-col items-center py-10 px-4 md:px-8">
      {/* Background Petals Canvas */}
      <PetalsCanvas />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        
        {/* Header with Luxury Wedding Typography */}
        <header className="text-center mb-8 w-full max-w-2xl">
          {/* Top Vintage Ornament */}
          <div className="flex items-center justify-center gap-3 mb-3 text-wedding-gold">
            <span className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-wedding-gold"></span>
            <span className="text-xl">💍</span>
            <span className="font-serif italic text-sm tracking-widest text-wedding-bronze uppercase">
              Wedding Celebration
            </span>
            <span className="text-xl">💍</span>
            <span className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-wedding-gold"></span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-kufi text-wedding-espresso mb-3 tracking-wide">
            يُمنـى <span className="text-wedding-gold font-light">&</span> عبدُ الله
          </h1>

          <p className="text-wedding-mocha text-base md:text-xl font-arabic font-medium mb-3">
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْر
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-wedding-beige/70 border border-wedding-gold/30 text-wedding-mocha text-xs md:text-sm font-medium shadow-sm">
            <span>تهاني ومباركات الأهل والأصدقاء</span>
            <span className="w-1.5 h-1.5 rounded-full bg-wedding-gold"></span>
            <span className="font-bold text-wedding-espresso">{wishesData.length} تهنئة غالية</span>
          </div>
        </header>

        {/* Toolbar: Search, View Mode & Play Controls */}
        <section className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 mb-8 px-4 py-2.5 rounded-2xl bg-wedding-ivory/80 border border-wedding-beige shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[210px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="ابحث باسم المهنئ أو نص التهنئة..."
              className="w-full pl-3 pr-9 py-2 text-sm rounded-xl bg-wedding-cream/90 border border-wedding-sand focus:outline-none focus:border-wedding-gold text-wedding-espresso placeholder-wedding-bronze/70 transition-all shadow-inner"
            />
            <span className="absolute right-3 top-2.5 text-wedding-bronze">
              🔍
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-wedding-bronze/30 text-wedding-espresso hover:bg-wedding-beige/80 transition-all flex items-center gap-1.5 shadow-sm"
            >
              {viewMode === 'carousel' ? '🗂️ عرض الشبكة' : '🎠 وضع الكاروسيل'}
            </button>

            {viewMode === 'carousel' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
                  isPlaying
                    ? 'bg-wedding-gold/20 border-wedding-gold text-wedding-espresso font-bold'
                    : 'border-wedding-bronze/30 text-wedding-bronze hover:bg-wedding-beige/50'
                }`}
              >
                {isPlaying ? '⏸️ تشغيل تلقائي' : '▶️ متابعة'}
              </button>
            )}
          </div>
        </section>

        {/* Wishes Display Content */}
        {filteredWishes.length === 0 ? (
          <div className="wedding-glass rounded-3xl p-12 text-center text-wedding-mocha max-w-md my-8">
            <p className="text-xl mb-4">لم نعثر على أي تهنئة مطابقة لبحثك</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2 rounded-xl bg-wedding-mocha text-wedding-cream text-sm hover:bg-wedding-espresso transition shadow-md"
            >
              عرض جميع التهاني
            </button>
          </div>
        ) : viewMode === 'carousel' ? (

          /* CAROUSEL VIEW */
          <div className="w-full flex flex-col items-center">
            
            {/* 3D Stack / Card Area */}
            <div
              className="relative w-full max-w-2xl min-h-[380px] flex items-center justify-center my-3"
              onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (!touchStartX.current) return;
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (diff > 50) nextSlide();
                if (diff < -50) prevSlide();
                touchStartX.current = null;
              }}
            >
              {/* Layered Deck Effect */}
              <div className="absolute w-[88%] h-full rounded-3xl bg-wedding-beige/60 scale-95 translate-y-3 -z-10 border border-wedding-gold/20 shadow-md"></div>
              <div className="absolute w-[94%] h-full rounded-3xl bg-wedding-sand/40 scale-[0.98] translate-y-1.5 -z-10 border border-wedding-gold/25 shadow-sm"></div>

              {/* Foreground Card */}
              <div className="w-full wedding-glass rounded-3xl p-7 md:p-12 relative flex flex-col justify-between transition-all duration-500 ease-out border border-wedding-gold/40 shadow-luxury">
                
                {/* Vintage Corner Ornaments */}
                <span className="absolute top-4 right-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>
                <span className="absolute top-4 left-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>
                <span className="absolute bottom-4 right-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>
                <span className="absolute bottom-4 left-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>

                {/* Card Top: Numbering & Date */}
                <div className="flex items-center justify-between text-xs text-wedding-bronze border-b border-wedding-beige/90 pb-4 mb-5">
                  <span className="font-serif tracking-widest bg-wedding-beige/70 text-wedding-mocha px-3 py-1 rounded-full font-bold">
                    {currentIndex + 1} / {filteredWishes.length}
                  </span>
                  <span className="font-arabic text-wedding-bronze">
                    {formatDate(currentWish.timestamp)}
                  </span>
                </div>

                {/* Wish Message */}
                <div className="my-auto py-4 text-center px-2">
                  <span className="text-3xl text-wedding-gold/60 font-serif select-none block leading-none mb-3">
                    ❝
                  </span>
                  <p
                    className={`text-xl md:text-2xl lg:text-3xl leading-relaxed text-wedding-espresso font-medium whitespace-pre-line ${
                      isArabic(currentWish.message) ? 'font-arabic' : 'font-serif tracking-wide'
                    }`}
                    dir={isArabic(currentWish.message) ? 'rtl' : 'ltr'}
                  >
                    {currentWish.message}
                  </p>
                  <span className="text-3xl text-wedding-gold/60 font-serif select-none block leading-none mt-3">
                    ❞
                  </span>
                </div>

                {/* Card Footer: Sender & Actions */}
                <div className="border-t border-wedding-beige/90 pt-5 mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Sender Name */}
                  <div className="text-center sm:text-right">
                    <h3 className="text-lg md:text-xl font-bold font-kufi text-wedding-espresso">
                      {currentWish.name}
                    </h3>
                    <p className="text-xs text-wedding-bronze font-serif tracking-wider">
                      من أطيب الأمنيات
                    </p>
                  </div>

                  {/* Reaction / Share Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLike(currentWish.id || currentIndex)}
                      className={`p-2.5 rounded-full border transition-all active:scale-90 ${
                        likes[currentWish.id || currentIndex]
                          ? 'bg-rose-50 border-rose-300 text-rose-600 scale-105 shadow-sm'
                          : 'bg-wedding-cream border-wedding-sand text-wedding-bronze hover:text-wedding-espresso'
                      }`}
                      title="أحببته"
                    >
                      {likes[currentWish.id || currentIndex] ? '❤️' : '🤍'}
                    </button>

                    <button
                      onClick={() => copyWish(currentWish)}
                      className="px-3.5 py-2 rounded-full text-xs font-semibold bg-wedding-cream border border-wedding-sand hover:border-wedding-gold text-wedding-mocha transition-all flex items-center gap-1.5 shadow-sm"
                      title="نسخ التهنئة"
                    >
                      <span>📋</span>
                      <span>نسخ</span>
                    </button>
                  </div>
                </div>

                {/* Autoplay animated indicator line */}
                {isPlaying && (
                  <div className="absolute bottom-0 left-8 right-8 h-[2.5px] bg-wedding-beige overflow-hidden rounded-full">
                    <div
                      key={currentIndex}
                      className="h-full bg-gradient-to-r from-wedding-gold to-wedding-bronze"
                      style={{
                        animation: 'progressFill 6s linear infinite'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-6 mt-6">
              {/* Prev Button (In RTL, clicking Prev goes backwards) */}
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full wedding-glass flex items-center justify-center text-wedding-espresso hover:bg-wedding-gold/20 hover:scale-105 transition-all active:scale-95 shadow-md border border-wedding-gold/40 text-2xl font-bold"
                aria-label="السابق"
                title="السابق"
              >
                ›
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5 max-w-[240px] overflow-hidden py-2 px-3 rounded-full bg-wedding-ivory/80 border border-wedding-sand shadow-inner">
                {filteredWishes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-wedding-gold'
                        : 'w-2 bg-wedding-sand hover:bg-wedding-bronze'
                    }`}
                    aria-label={`انتقل إلى ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full wedding-glass flex items-center justify-center text-wedding-espresso hover:bg-wedding-gold/20 hover:scale-105 transition-all active:scale-95 shadow-md border border-wedding-gold/40 text-2xl font-bold"
                aria-label="التالي"
                title="التالي"
              >
                ‹
              </button>
            </div>

            <p className="text-xs text-wedding-bronze font-arabic mt-3">
              استخدم أسهم لوحة المفاتيح ‹ › أو اسحب الشاشة للتنقل
            </p>

          </div>

        ) : (

          /* GRID VIEW */
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
            {filteredWishes.map((wish, idx) => (
              <div
                key={wish.id || idx}
                className="wedding-glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 border border-wedding-gold/30"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-wedding-bronze mb-3 pb-2 border-b border-wedding-beige/80">
                    <span className="font-serif font-bold text-wedding-gold">#{idx + 1}</span>
                    <span>{formatDate(wish.timestamp)}</span>
                  </div>

                  <p
                    className={`text-base text-wedding-espresso leading-relaxed mb-4 whitespace-pre-line ${
                      isArabic(wish.message) ? 'font-arabic' : 'font-serif'
                    }`}
                    dir={isArabic(wish.message) ? 'rtl' : 'ltr'}
                  >
                    {wish.message}
                  </p>
                </div>

                <div className="pt-3 border-t border-wedding-beige/80 flex items-center justify-between">
                  <span className="font-bold text-sm font-kufi text-wedding-mocha">
                    {wish.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleLike(wish.id || idx)}
                      className="text-sm p-1 rounded hover:scale-110 transition"
                      title="إعجاب"
                    >
                      {likes[wish.id || idx] ? '❤️' : '🤍'}
                    </button>
                    <button
                      onClick={() => copyWish(wish)}
                      className="text-xs text-wedding-bronze hover:text-wedding-gold transition p-1"
                      title="نسخ"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-wedding-bronze text-sm font-arabic pb-6">
          <p className="flex items-center justify-center gap-2 mb-1">
            <span>دامت دياركم عامرة بالأفراح والمسرّات</span>
            <span className="text-wedding-gold">✨</span>
          </p>
          <p className="text-xs text-wedding-sand font-serif">
            Warm Mocha, Beige & Champagne Gold Wedding Carousel
          </p>
        </footer>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-wedding-espresso text-wedding-cream px-6 py-2.5 rounded-full shadow-2xl text-sm font-arabic border border-wedding-gold/40 animate-bounce">
            {toastMessage}
          </div>
        )}
      </main>

      <style>{`
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
