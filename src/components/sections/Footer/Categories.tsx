// next
import Link from 'next/link';

// shopify
import { getMenu } from '@/lib/shopify';

const Categories = async () => {
  const menu = await getMenu('main-menu');
  return (
    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-start">
      <h3 className="font-cairo text-[18px] font-bold text-white">المتجر</h3>
      <div className="flex flex-col items-center gap-3 md:items-start">
        {menu.map((menuItem, i) => (
          <div key={i} className="flex flex-col items-center gap-3 md:items-start">
            <Link
              href={menuItem.path}
              className="font-cairo text-[15px] text-lightPurple transition-all duration-200 hover:text-gold hover:translate-x-[-3px]"
            >
              {menuItem.title}
            </Link>
            {menuItem.items.map((subMenuItem, j) => (
              <Link
                href={subMenuItem.path}
                key={j}
                className="font-cairo text-[15px] text-lightPurple/70 transition-all duration-200 hover:text-gold hover:translate-x-[-3px]"
              >
                {subMenuItem.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
