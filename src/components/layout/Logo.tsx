// clsx
import clsx from 'clsx';

const Logo = ({ size, className }: { size: 'sm' | 'lg'; className?: string }) => {
  return (
    <div
      className={clsx(
        'select-none font-cairo font-bold tracking-wide text-veryDarkPurple',
        className,
        {
          'text-[28px]': size === 'sm',
          'text-[48px] text-white drop-shadow-lg': size === 'lg'
        }
      )}
    >
      كنوز
    </div>
  );
};

export default Logo;
