import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { wishesData } from './wishesData';
import PetalsCanvas from './components/PetalsCanvas';

const STORAGE_KEY = 'wedding_wishes_likes_json';

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

/* SVG Icons - UI/UX Pro Max Clean Aesthetics */
function RingsIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="8" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
      <path d="M12 7l1.5-2h-3L12 7z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function HeartIcon({ filled = false, className = "w-5 h-5" }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CarouselIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <line x1="2" y1="7" x2="2" y2="17" />
      <line x1="22" y1="7" x2="22" y2="17" />
    </svg>
  );
}

function GridIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function PlayIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function PauseIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function CopyIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function SparkleIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z" />
    </svg>
  );
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const touchStartX = useRef(null);

  // Initialize likes state from localStorage JSON
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved likes JSON from localStorage:', err);
    }
    return {};
  });

  // Sync likes to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
    } catch (err) {
      console.warn('Failed to save likes JSON to localStorage:', err);
    }
  }, [likes]);

  // Filter wishes based on search text and favorites filter
  const filteredWishes = wishesData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = showOnlyFavorites ? Boolean(likes[item.id]) : true;
    return matchesSearch && matchesFavorite;
  });

  const likedCount = Object.values(likes).filter(Boolean).length;

  const nextSlide = useCallback(() => {
    if (filteredWishes.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredWishes.length);
  }, [filteredWishes.length]);

  const prevSlide = useCallback(() => {
    if (filteredWishes.length === 0) return;
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
        particleCount: 55,
        spread: 65,
        origin: { y: 0.72 },
        colors: ['#C59E50', '#D4C4B3', '#9A7B66', '#EADBB6', '#B85D6A']
      });
    } catch {
      // fallback
    }
  };

  const toggleLike = (id) => {
    const isNowLiked = !likes[id];
    setLikes((prev) => {
      const updated = { ...prev, [id]: isNowLiked };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not write JSON to localStorage:', err);
      }
      return updated;
    });

    if (isNowLiked) {
      triggerConfetti();
      setToastMessage('تم حفظ التهنئة في المفضلة وتثبيتها بنجاح ✨');
    } else {
      setToastMessage('تمت إزالة التهنئة من المفضلة');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyWish = (wish) => {
    navigator.clipboard.writeText(`"${wish.message}" — ${wish.name}`);
    setCopiedId(wish.id);
    setToastMessage('تم نسخ التهنئة الرقيقة إلى الحافظة ✨');
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 2800);
  };

  const currentWish = filteredWishes[currentIndex] || wishesData[0];

  return (
    <div className="relative min-h-screen text-wedding-espresso selection:bg-wedding-sand selection:text-wedding-espresso flex flex-col items-center py-10 px-4 md:px-8">
      {/* Ambient Canvas with warm champagne & beige petals */}
      <PetalsCanvas />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center">

        {/* Header with Warm Luxury Wedding Aesthetics */}
        <header className="text-center mb-8 w-full max-w-2xl">
          {/* Top Vintage Gold Filigree Accent */}
          <div className="flex items-center justify-center gap-3 mb-3.5 text-wedding-gold">
            <span className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-wedding-beige/50 border border-wedding-gold/30">
              <RingsIcon className="w-4 h-4 text-wedding-gold" />
              <span className="font-serif italic text-xs tracking-widest text-wedding-mocha font-semibold uppercase">
                Wedding Celebration
              </span>
            </div>
            <span className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-kufi text-wedding-espresso mb-3 tracking-wide">
            عبدُ الله <span className="text-wedding-gold font-light">و</span> يُمنـى
          </h1>

          <p className="text-wedding-mocha text-base md:text-xl font-arabic font-medium mb-4 max-w-xl mx-auto leading-relaxed">
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْر
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs md:text-sm">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-ivory border border-wedding-sand text-wedding-mocha font-medium shadow-sm">
              <SparkleIcon className="w-3.5 h-3.5 text-wedding-gold" />
              <span>تهاني ومباركات الأهل والأصدقاء</span>
              <span className="w-1.5 h-1.5 rounded-full bg-wedding-gold"></span>
              <span className="font-bold text-wedding-espresso">{wishesData.length} تهنئة غالية</span>
            </div>

            {likedCount > 0 && (
              <button
                onClick={() => {
                  setShowOnlyFavorites(!showOnlyFavorites);
                  setCurrentIndex(0);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                  showOnlyFavorites
                    ? 'bg-wedding-roseLight border-wedding-rose text-wedding-rose shadow-sm'
                    : 'bg-wedding-ivory border-wedding-sand text-wedding-warmTaupe hover:border-wedding-rose/50 hover:text-wedding-rose'
                }`}
                title="تصفية التهاني المفضلة"
                aria-label="شريط المفضلة"
              >
                <HeartIcon filled={true} className="w-3.5 h-3.5 text-wedding-rose" />
                <span>{likedCount} في المفضلة</span>
              </button>
            )}
          </div>
        </header>

        {/* Toolbar: Search, Filters & View Mode Controls */}
        <section className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 mb-8 px-4 py-3 rounded-2xl bg-wedding-ivory/90 border border-wedding-sand/70 shadow-sm backdrop-blur-md">
          {/* Search Input with SVG Icon */}
          <div className="relative flex-1 min-w-[210px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="ابحث باسم المهنئ أو نص التهنئة..."
              className="w-full pl-3 pr-9 py-2 text-sm rounded-xl bg-wedding-cream border border-wedding-sand focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold text-wedding-espresso placeholder-wedding-bronze/70 transition-all shadow-inner"
            />
            <span className="absolute right-3 top-2.5 text-wedding-bronze pointer-events-none">
              <SearchIcon className="w-4 h-4" />
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Favorites Toggle Pill */}
            <button
              onClick={() => {
                setShowOnlyFavorites(!showOnlyFavorites);
                setCurrentIndex(0);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                showOnlyFavorites
                  ? 'bg-wedding-roseLight border-wedding-rose text-wedding-rose font-bold'
                  : 'bg-wedding-cream border-wedding-sand text-wedding-mocha hover:bg-wedding-beige/60 hover:text-wedding-espresso'
              }`}
              title={showOnlyFavorites ? 'عرض جميع التهاني' : 'عرض المفضلة فقط'}
              aria-label="زر تصفية المفضلة"
            >
              <HeartIcon filled={showOnlyFavorites} className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'text-wedding-rose' : 'text-wedding-bronze'}`} />
              <span>المفضلة</span>
              {likedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-wedding-rose/10 text-wedding-rose font-bold">
                  {likedCount}
                </span>
              )}
            </button>

            {/* View Mode Toggle Button */}
            <button
              onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-wedding-sand bg-wedding-cream text-wedding-espresso hover:bg-wedding-beige/60 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              aria-label={viewMode === 'carousel' ? 'عرض شبكة التهاني' : 'وضع الكاروسيل'}
            >
              {viewMode === 'carousel' ? (
                <>
                  <GridIcon className="w-3.5 h-3.5 text-wedding-bronze" />
                  <span>عرض الشبكة</span>
                </>
              ) : (
                <>
                  <CarouselIcon className="w-3.5 h-3.5 text-wedding-bronze" />
                  <span>وضع الكاروسيل</span>
                </>
              )}
            </button>

            {/* Autoplay Toggle (Carousel only) */}
            {viewMode === 'carousel' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  isPlaying
                    ? 'bg-wedding-gold/20 border-wedding-gold text-wedding-espresso font-bold'
                    : 'bg-wedding-cream border-wedding-sand text-wedding-bronze hover:bg-wedding-beige/50'
                }`}
                title={isPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي'}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="w-3.5 h-3.5 text-wedding-goldDark" />
                    <span>تلقائي</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-3.5 h-3.5 text-wedding-bronze" />
                    <span>تشغيل</span>
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Wishes Display Content */}
        {filteredWishes.length === 0 ? (
          <div className="wedding-glass rounded-3xl p-10 text-center text-wedding-mocha max-w-md my-8 border border-wedding-sand shadow-luxury">
            <div className="w-12 h-12 rounded-full bg-wedding-beige/60 flex items-center justify-center mx-auto mb-4 text-wedding-gold">
              {showOnlyFavorites ? <HeartIcon filled={true} className="w-6 h-6 text-wedding-rose" /> : <SearchIcon className="w-6 h-6 text-wedding-bronze" />}
            </div>
            <p className="text-lg font-bold text-wedding-espresso mb-2">
              {showOnlyFavorites ? 'لم تقم بحفظ أي تهنئة في المفضلة بعد' : 'لم نعثر على أي تهنئة مطابقة للبحث'}
            </p>
            <p className="text-sm text-wedding-warmTaupe mb-5 leading-relaxed">
              {showOnlyFavorites
                ? 'اضغط على رمز القلب في أي بطاقة لحفظها، وسيبقى إعجابك محفوظاً دائماً حتى بعد تحديث الصفحة.'
                : 'جرّب البحث بكلمة أخرى أو اسم شخص آخر من قائمة المهنئين.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setShowOnlyFavorites(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-wedding-mocha text-wedding-cream text-xs font-semibold hover:bg-wedding-espresso transition-all duration-200 cursor-pointer shadow-md"
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
              {/* Layered Deck Effect with Decent Brown and Beige Tones */}
              <div className="absolute w-[88%] h-full rounded-3xl bg-wedding-beige/70 scale-95 translate-y-3 -z-10 border border-wedding-sand/80 shadow-md"></div>
              <div className="absolute w-[94%] h-full rounded-3xl bg-wedding-sand/50 scale-[0.98] translate-y-1.5 -z-10 border border-wedding-sand/90 shadow-sm"></div>

              {/* Foreground Card */}
              <div className="w-full wedding-glass rounded-3xl p-7 md:p-12 relative flex flex-col justify-between transition-all duration-500 ease-out border border-wedding-gold/40 shadow-luxury">

                {/* Subtle Vintage Corner Ornaments */}
                <span className="absolute top-4 right-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>
                <span className="absolute top-4 left-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>
                <span className="absolute bottom-4 right-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>
                <span className="absolute bottom-4 left-4 text-wedding-gold/40 text-xl font-serif select-none">✤</span>

                {/* Card Top: Numbering & Date */}
                <div className="flex items-center justify-between text-xs text-wedding-warmTaupe border-b border-wedding-sand/50 pb-4 mb-5">
                  <span className="font-serif tracking-widest bg-wedding-beige/80 text-wedding-mocha px-3 py-1 rounded-full font-bold border border-wedding-sand/40">
                    {currentIndex + 1} / {filteredWishes.length}
                  </span>
                  <span className="font-arabic text-wedding-warmTaupe">
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
                <div className="border-t border-wedding-sand/50 pt-5 mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Sender Name */}
                  <div className="text-center sm:text-right">
                    <h3 className="text-lg md:text-xl font-bold font-kufi text-wedding-espresso">
                      {currentWish.name}
                    </h3>
                    <p className="text-xs text-wedding-bronze font-serif tracking-wider">
                      من أطيب الأمنيات والدعوات
                    </p>
                  </div>

                  {/* Reaction / Share Buttons */}
                  <div className="flex items-center gap-2.5">
                    {/* Love Button with SVG and Persistent JSON State */}
                    <button
                      onClick={() => toggleLike(currentWish.id)}
                      className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer active:scale-90 flex items-center justify-center ${
                        likes[currentWish.id]
                          ? 'bg-wedding-roseLight border-wedding-rose/50 text-wedding-rose shadow-sm'
                          : 'bg-wedding-cream border-wedding-sand text-wedding-warmTaupe hover:border-wedding-rose/40 hover:text-wedding-rose hover:bg-wedding-roseLight/30'
                      }`}
                      title={likes[currentWish.id] ? 'إلغاء الإعجاب' : 'أحببته وحفظ في المفضلة'}
                      aria-label={likes[currentWish.id] ? 'إلغاء الإعجاب' : 'أحببته'}
                    >
                      <HeartIcon filled={Boolean(likes[currentWish.id])} className={`w-5 h-5 ${likes[currentWish.id] ? 'scale-110' : ''}`} />
                    </button>

                    {/* Copy Button with SVG Feedback */}
                    <button
                      onClick={() => copyWish(currentWish)}
                      className="px-3.5 py-2 rounded-full text-xs font-semibold bg-wedding-cream border border-wedding-sand hover:border-wedding-gold text-wedding-mocha hover:text-wedding-espresso transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="نسخ التهنئة"
                    >
                      {copiedId === currentWish.id ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-wedding-goldDark" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5 text-wedding-bronze" />
                          <span>نسخ</span>
                        </>
                      )}
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
            <div className="flex items-center justify-center gap-5 mt-6">
              {/* Prev Button (In RTL, clicking Prev goes to previous slide) */}
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full wedding-glass flex items-center justify-center text-wedding-espresso hover:bg-wedding-gold/20 hover:scale-105 transition-all duration-200 active:scale-95 shadow-md border border-wedding-gold/40 cursor-pointer"
                aria-label="السابق"
                title="السابق"
              >
                <ChevronRightIcon className="w-6 h-6 text-wedding-espresso" />
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5 max-w-[240px] overflow-hidden py-2 px-3 rounded-full bg-wedding-ivory/90 border border-wedding-sand shadow-inner">
                {filteredWishes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
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
                className="w-12 h-12 rounded-full wedding-glass flex items-center justify-center text-wedding-espresso hover:bg-wedding-gold/20 hover:scale-105 transition-all duration-200 active:scale-95 shadow-md border border-wedding-gold/40 cursor-pointer"
                aria-label="التالي"
                title="التالي"
              >
                <ChevronLeftIcon className="w-6 h-6 text-wedding-espresso" />
              </button>
            </div>

            <p className="text-xs text-wedding-warmTaupe font-arabic mt-3.5">
              استخدم أسهم لوحة المفاتيح للتنقل أو اسحب الشاشة على الجوال
            </p>

          </div>

        ) : (

          /* GRID VIEW */
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
            {filteredWishes.map((wish, idx) => (
              <div
                key={wish.id || idx}
                className="wedding-glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 border border-wedding-sand/80 hover:border-wedding-gold/50"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-wedding-warmTaupe mb-3 pb-2.5 border-b border-wedding-sand/40">
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

                <div className="pt-3.5 border-t border-wedding-sand/40 flex items-center justify-between">
                  <span className="font-bold text-sm font-kufi text-wedding-mocha">
                    {wish.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleLike(wish.id)}
                      className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                        likes[wish.id]
                          ? 'bg-wedding-roseLight border-wedding-rose/40 text-wedding-rose'
                          : 'bg-wedding-cream border-wedding-sand text-wedding-warmTaupe hover:text-wedding-rose'
                      }`}
                      title={likes[wish.id] ? 'إلغاء الإعجاب' : 'إعجاب'}
                    >
                      <HeartIcon filled={Boolean(likes[wish.id])} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyWish(wish)}
                      className="p-1.5 rounded-lg border border-wedding-sand bg-wedding-cream text-wedding-warmTaupe hover:text-wedding-espresso hover:border-wedding-gold transition-all duration-200 cursor-pointer"
                      title="نسخ التهنئة"
                    >
                      {copiedId === wish.id ? (
                        <CheckIcon className="w-4 h-4 text-wedding-goldDark" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-wedding-warmTaupe text-sm font-arabic pb-6">
          <p className="flex items-center justify-center gap-2 mb-1.5">
            <span>دامت دياركم عامرة بالأفراح والمسرّات</span>
            <SparkleIcon className="w-3.5 h-3.5 text-wedding-gold" />
          </p>
          <p className="text-xs text-wedding-bronze/80 font-serif">
            Warm Mocha, Linen Beige & Champagne Gold Wedding Celebration
          </p>
        </footer>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-wedding-espresso text-wedding-ivory px-5 py-2.5 rounded-full shadow-2xl text-xs md:text-sm font-arabic border border-wedding-gold/40 transition-all duration-300 flex items-center gap-2">
            <SparkleIcon className="w-3.5 h-3.5 text-wedding-gold" />
            <span>{toastMessage}</span>
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
