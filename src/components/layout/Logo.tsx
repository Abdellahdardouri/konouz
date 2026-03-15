import clsx from 'clsx';
import Image from 'next/image';

const Logo = ({ size, className }: { size: 'sm' | 'lg'; className?: string }) => {
  if (size === 'lg') {
    return (
      <div className={clsx('select-none', className)}>
        <Image
          src="/images/logo.png"
          alt="كنوز"
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={clsx('flex select-none items-center gap-2', className)}>
      <Image
        src="/images/logo.png"
        alt="كنوز"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
        priority
      />
      <span className="hidden font-cairo text-xl font-semibold tracking-wide text-espresso sm:inline md:text-2xl">
        كنوز
      </span>
    </div>
  );
};

export default Logo;
