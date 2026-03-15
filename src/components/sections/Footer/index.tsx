// next
import Image from 'next/image';

// components
import Categories from './Categories';
import CopyRight from './CopyRight';
import Disclaimer from './Disclaimer';
import PaymentMethods from './PaymentMethods';
import SocialMedia from './SocialMedia';

const Footer = () => {
  return (
    <footer className="bg-veryDarkPurple">
      <h2 className="sr-only">تذييل الصفحة</h2>

      {/* Logo mark */}
      <div className="flex justify-center pb-12 pt-24">
        <Image
          src="/images/logo.png"
          alt="كنوز"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      {/* Three columns */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-12 px-6 md:flex-row md:gap-8 md:px-12">
        {/* Column 1: المتجر */}
        <Categories />

        {/* Column 2: تواصل معنا */}
        <SocialMedia />

        {/* Column 3: عن المتجر */}
        <Disclaimer />
      </div>

      {/* Gold divider line */}
      <div className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-12">
        <div className="h-px w-full bg-purple/30" />
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row md:px-12">
        <CopyRight />
        <PaymentMethods />
      </div>
    </footer>
  );
};

export default Footer;
