// next
import dynamic from 'next/dynamic';

// loading component
import Loading from '@/components/common/Loading';
const loading = () => <Loading />;

// components
import HomeVideo from '@/components/sections/HomeVideo';
const CategoryHighlights = dynamic(() => import('@/components/sections/CategoryHighlights'), {
  loading
});
const Discounts = dynamic(() => import('@/components/sections/Discounts'), {
  loading
});
const BestSellers = dynamic(() => import('@/components/sections/BestSellers'), {
  loading
});
const BrandStatement = dynamic(() => import('@/components/sections/BrandStatement'), {
  loading
});
const Promotions = dynamic(() => import('@/components/sections/Promotions'), {
  loading
});
const NewArrivals = dynamic(() => import('@/components/sections/NewArrivals/NewArrivals'), {
  loading
});
const TrustBlock = dynamic(() => import('@/components/sections/TrustBlock'), {
  loading
});
const AboutUs = dynamic(() => import('@/components/sections/AboutUs'), {
  loading
});

export const metadata = {
  description:
    'كنوز - متجر منتجات البيت للمغرب. اكتشف مجموعتنا من أدوات المطبخ والتنظيم والأجهزة الصغيرة',
  keywords: [
    'كنوز',
    'منتجات البيت',
    'متجر المغرب',
    'أدوات المطبخ',
    'تنظيم المنزل',
    'الأجهزة الصغيرة'
  ],
  openGraph: {
    type: 'website',
    locale: 'ar_MA',
    url: '/',
    title: 'كنوز',
    siteName: 'كنوز',
    description:
      'كنوز - متجر منتجات البيت للمغرب. اكتشف مجموعتنا من أدوات المطبخ والتنظيم والأجهزة الصغيرة',
    images: {
      url: '/images/screenshots/home.webp',
      alt: 'كنوز - متجر البيت',
      width: 1200,
      height: 660,
      type: 'image/webp',
      secureUrl: '/images/screenshots/home.webp'
    }
  }
};

export default async function HomePage() {
  return (
    <>
      <HomeVideo />
      <CategoryHighlights />
      <Discounts />
      <BestSellers />
      <BrandStatement />
      <Promotions />
      <NewArrivals />
      <TrustBlock />
      <AboutUs />
    </>
  );
}
