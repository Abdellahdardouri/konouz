// next
import Image from 'next/image';
import Link from 'next/link';

// data
import categories from '@/data/clothing-images.json';

const CategoryHighlights = () => {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 px-4 py-10 md:py-16">
      <h2 className="font-cairo text-[clamp(24px,18px_+_2vw,36px)] font-semibold text-veryDarkPurple">
        تسوق حسب الفئة
      </h2>
      <div className="grid w-full max-w-[95%] grid-cols-2 gap-4 md:max-w-[904px] md:grid-cols-4 md:gap-6">
        {categories.map((category, i) => (
          <Link
            key={i}
            href={category.url}
            className="group relative aspect-square overflow-hidden rounded-[16px] shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-all duration-500 group-hover:scale-110"
              unoptimized
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-center md:p-4">
              <span className="font-cairo text-[clamp(14px,2vw,18px)] font-bold text-white drop-shadow-md">
                {category.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryHighlights;
