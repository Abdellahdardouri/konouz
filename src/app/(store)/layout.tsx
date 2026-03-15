import dynamic from 'next/dynamic';
import { ReactNode, Suspense } from 'react';
import Loading from '@/components/common/Loading';
import Header from '@/components/sections/Header';

const loading = () => <Loading />;
const Footer = dynamic(() => import('@/components/sections/Footer'), { loading });

export default async function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Suspense>
        <main>{children}</main>
      </Suspense>
      <Footer />
    </>
  );
}
