// next
import Link from 'next/link';

// components
import Logo from '@/components/layout/Logo';

const HomeVideo = () => {
  return (
    <div className="pointer-events-none relative h-[470px] select-none md:h-[calc(100vh_-_80px)]">
      {/* Background video */}
      <video
        playsInline
        muted
        loop
        autoPlay
        preload="auto"
        className="absolute h-full w-full object-cover"
      >
        <source src="/videos/hero-103.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content overlay */}
      <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center md:gap-8">
        <h1 className="font-cairo text-[clamp(28px,5vw,64px)] font-bold leading-tight text-white drop-shadow-lg">
          كل ما يحتاجه بيتك
          <br />
          في مكان واحد
        </h1>
        <p className="max-w-[600px] font-cairo text-[clamp(16px,2vw,22px)] font-medium text-white/90 drop-shadow-md">
          منتجات عملية وأفكار مفيدة للبيت بتصميم جميل وتسوق سهل
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/search"
            className="rounded-[8px] bg-white px-8 py-4 font-cairo text-[clamp(16px,1.5vw,20px)] font-bold text-veryDarkPurple shadow-lg transition-all duration-300 hover:bg-purple hover:text-white"
          >
            تسوق الآن
          </Link>
          <Link
            href="/search/new-arrivals"
            className="rounded-[8px] border-2 border-white px-8 py-4 font-cairo text-[clamp(16px,1.5vw,20px)] font-bold text-white shadow-lg transition-all duration-300 hover:bg-white/20"
          >
            اكتشف الجديد
          </Link>
        </div>
      </div>

      {/* Logo bottom corner */}
      <Logo size="lg" className="absolute bottom-4 left-4 md:bottom-8 md:left-8" />
    </div>
  );
};

export default HomeVideo;
