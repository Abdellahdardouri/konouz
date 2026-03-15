'use client';

import Link from 'next/link';

const SubMenu = ({
  items,
  parent
}: {
  items: { title: string; path: string }[];
  parent: string;
}) => {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-[63px] z-40 flex items-center justify-center border-t border-gold/20 bg-white-warm/90 py-[24px] opacity-0 backdrop-blur-lg transition-all duration-500">
      <div className="flex w-full max-w-[700px] items-stretch justify-center gap-8 px-4">
        <nav className="flex flex-row flex-wrap items-start justify-center gap-x-8 gap-y-4">
          <h3 className="sr-only">القائمة الفرعية — {parent}</h3>
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
      </div>
    </div>
  );
};

export default SubMenu;
