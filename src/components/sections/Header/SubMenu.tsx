'use client';

import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';

// Category preview images mapped to parent menu titles
const categoryImages: Record<string, Array<{ title: string; image: string; url: string }>> = {
  المطبخ: [
    {
      title: 'أدوات المطبخ',
      image: 'https://images.pexels.com/photos/4397897/pexels-photo-4397897.jpeg?w=300',
      url: '/search/kitchen-tools'
    },
    {
      title: 'التحضير والطبخ',
      image: 'https://images.pexels.com/photos/6896379/pexels-photo-6896379.jpeg?w=300',
      url: '/search/cooking'
    }
  ],
  'تنظيم المنزل': [
    {
      title: 'علب ومنظمات',
      image: 'https://images.pexels.com/photos/4990270/pexels-photo-4990270.jpeg?w=300',
      url: '/search/organizers'
    },
    {
      title: 'حلول ذكية',
      image: 'https://images.pexels.com/photos/7262776/pexels-photo-7262776.jpeg?w=300',
      url: '/search/organization'
    }
  ]
};

const SubMenu = ({
  items,
  parent
}: {
  items: { title: string; path: string }[];
  parent: string;
}) => {
  const previewImages = categoryImages[parent] || [];

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-[79px] z-40 flex items-center justify-center border-t border-purple bg-white/70 py-[24px] opacity-0 backdrop-blur-lg transition-all duration-500">
      <div className="flex w-full max-w-[700px] items-stretch justify-between gap-8 px-4">
        {/* Sub-links — side by side in a row */}
        <nav className="flex flex-row flex-wrap items-start justify-start gap-x-8 gap-y-4">
          <h3 className="sr-only">{parent} Sub Menu</h3>
          {items.map((item, i) => (
            <Link
              href={item.path}
              key={i}
              className="hover-line whitespace-nowrap font-cairo text-[18px] font-semibold text-veryDarkPurple"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Preview images */}
        {previewImages.length > 0 && (
          <div className="flex flex-shrink-0 items-center justify-center gap-4">
            {previewImages.slice(0, 2).map((imageItem, i) => (
              <Link
                href={imageItem.url}
                key={i}
                title={imageItem.title}
                className={clsx(
                  'transition-all hover:[&_img]:scale-110',
                  i === 0 ? 'fade-up' : 'fade-up-delay'
                )}
                style={{ opacity: 0 }}
              >
                <div className="relative aspect-[7/10] h-[160px] overflow-hidden rounded-[8px]">
                  <Image
                    src={imageItem.image}
                    alt={imageItem.title}
                    fill
                    className="object-cover transition-all duration-300 will-change-transform"
                    sizes="112px"
                    unoptimized
                  />
                </div>
                <p className="mt-1 text-center font-cairo text-[13px] text-darkPurple">
                  {imageItem.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubMenu;
