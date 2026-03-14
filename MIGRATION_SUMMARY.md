# كنوز — Migration Summary

## Overview

Full migration of a Japanese clothing e-commerce Next.js app (Rumusha) into an Arabic home-products store named **كنوز** (Konouz) targeting the Moroccan market.

---

## Completed Changes (26 Steps)

### Step 1 — Mock Data Layer

Created `src/lib/mock-data.ts` with:

- `Product` type compatible with Shopify types
- 20 Arabic home products across 4 categories (kitchen, organization, appliances, bathroom)
- Moroccan Dirham pricing (MAD)
- Pexels royalty-free image URLs
- Functions: `getMockProducts()`, `getMockCollectionProducts()`, `getMockMenu()`, `getMockProduct()`, `getMockCollections()`
- Arabic navigation menu structure

### Step 2 — Shopify Fallback

Modified `src/lib/shopify/index.ts`:

- Imported mock data functions
- Added `if (!domain)` guards on `getMenu()`, `getCollectionProducts()`, `getProducts()`, `getProduct()`, `getCollections()`
- Site works fully without Shopify credentials

### Step 3 — RTL Arabic Layout

Modified `src/app/layout.tsx`:

- `lang="en"` → `lang="ar"`, added `dir="rtl"`
- Added Cairo font import alongside Lora + Quicksand
- Updated site name to "كنوز"
- Updated baseUrl to `konouz.ma`

### Step 4 — Arabic Fonts

Modified `src/fonts/fonts.ts`:

- Added `Cairo` from Google Fonts with Arabic + Latin subsets
- Weights 300–900 included

### Step 5 — Tailwind Config

Modified `tailwind.config.js`:

- Added `cairo` font family
- Set Cairo as default `sans` font

### Step 6 — Logo Replaced

Modified `src/components/layout/Logo.tsx`:

- Replaced `/images/logo.png` with Arabic text "كنوز"
- Uses Cairo font, bold, with size variants

### Step 7 — HomeVideo Section

Modified `src/components/sections/HomeVideo.tsx`:

- Added dark overlay (bg-black/40)
- Arabic headline: كل ما يحتاجه بيتك في مكان واحد
- Arabic subline about practical home products
- Two CTA buttons: تسوق الآن + اكتشف الجديد
- Video sources: hero.mov (primary) → clothing-shoot.mp4 → clothing-shoot.webm (fallbacks)
- Logo moved to bottom-left (RTL)

### Step 8 — Discounts Marquee

Modified `src/components/sections/Discounts.tsx`:

- Moroccan Arabic text: توصيل سريع • منتجات مختارة • جودة عالية • كنوز
- Marquee direction set to "right" for RTL
- Added 'use client' directive

### Step 9 — BestSellers Section

Modified `src/components/sections/BestSellers/index.tsx`:

- Title: "الأكثر طلباً"
- Collections: kitchen, organization, appliances, bathroom
- Arabic tab labels: المطبخ، تنظيم المنزل، الأجهزة الصغيرة، الحمام

### Step 10 — Promotions Section

Modified `src/components/sections/Promotions.tsx`:

- Replaced winter clothing image with Pexels shelf/home image
- Title: اختيارات عملية للبيت
- Body: منتجات تساعدك في تنظيم المنزل
- CTA: تصفح المجموعة → /search
- Panel moved to left side (RTL appropriate)

### Step 11 — NewArrivals Section

Modified `src/components/sections/NewArrivals/NewArrivals.tsx`:

- Title: "وصل حديثاً"
- CTA: "عرض المزيد" → /search/new-arrivals

### Step 12 — AboutUs Section

Modified `src/components/sections/AboutUs.tsx`:

- Title: من نحن
- Arabic body copy about Konouz mission
- CTA: اعرف أكثر → /about-us

### Step 13 — Header

Modified `src/components/sections/Header/index.tsx`:

- sr-only h1: "كنوز"
- sr-only h2: "القائمة الرئيسية"

### Step 14 — Footer Components

- `Categories.tsx`: title "Navigation" → "المتجر"
- `SocialMedia.tsx`: "Follow us" → "تابعنا"
- `CopyRight.tsx`: "جميع الحقوق محفوظة © 2024 كنوز"
- `Disclaimer.tsx`: Arabic title "تنبيه" + Arabic disclaimer text

### Step 15 — Social Media JSON

Updated `src/data/social-media.json`: all URLs → empty strings `""`

### Step 16 — clothing-images.json

Replaced clothing categories with home product categories (4 entries with Pexels images and Arabic titles)

### Step 17 — ProductCard

Modified `src/components/product/ProductCard.tsx`:

- Currency: JPY Intl.NumberFormat → `{price} د.م.`
- Removed color variant dots and color logic
- Added Arabic badges: "جديد" (new), "الأكثر طلباً" (best-seller)
- Numeric rank badge (Arabic numerals)
- `unoptimized` on images for Pexels URLs

### Step 18 — next.config.js

Added Pexels image domains to `remotePatterns`

### Step 19 — page.tsx Metadata

Updated metadata to Arabic description, keywords, and Open Graph data

### Step 20 — globals.css RTL

Added RTL base styles and Arabic font feature settings (ligatures)
Updated btn classes for RTL direction (arrow icon flipped)

### Step 21 — Hero Video

Copied `AdobeStock_742901103.mov` → `public/videos/hero.mov`
Note: .mov has limited browser support (Safari native only). Fallback to existing `.mp4` is in place.

### Step 22 — About Page

Created `src/app/about-us/page.tsx` with:

- Full Arabic about section
- Company values grid
- CTA to browse store

### Step 23 — CategoryHighlights Section

Created `src/components/sections/CategoryHighlights.tsx`:

- 4-card category grid with hover zoom effect
- Uses clothing-images.json (repurposed with home category data)
- Added between HomeVideo and Discounts in page.tsx

### Step 24 — TrustBlock Section

Created `src/components/sections/TrustBlock.tsx`:

- 3 trust point cards
- منتجات مختارة بعناية | تصفح سهل وصور واضحة | توصيل سريع في المغرب
- Added between Promotions and NewArrivals in page.tsx

### Step 25 — MIGRATION_NOTES.md

Created detailed notes covering file map, what was changed, what still needs real data, and asset placeholders.

### Step 26 — MIGRATION_SUMMARY.md

This file.

---

## Known Limitations / Next Steps

1. **Hero video**: `.mov` file only plays natively in Safari. Convert to `.mp4`/`.webm` for full support
2. **Product images**: All Pexels placeholders — replace with real product photography
3. **Shopify integration**: Configured but dormant — add env vars when store is ready
4. **Social links**: Empty strings in `social-media.json` — add real profile URLs
5. **Swiper RTL**: BestSellers slider may need `dir="rtl"` prop on Swiper for correct RTL sliding direction — test in browser
6. **Search page**: `/search` and collection pages may still have LTR layout elements — needs review
7. **Product detail page**: `/product/[handle]` not migrated — will need Arabic labels

---

## Technology Stack

- **Framework**: Next.js (App Router, Edge runtime)
- **Styling**: Tailwind CSS + custom CSS
- **Fonts**: Cairo (Arabic), Lora, Quicksand — from Google Fonts
- **Animations**: Framer Motion, CSS keyframes
- **Product Slider**: Swiper.js
- **Marquee**: react-fast-marquee
- **Parallax**: react-scroll-parallax
- **Images**: Pexels (placeholders), Next.js Image optimization
- **Data**: Mock data (production-ready fallback), Shopify Storefront API (when configured)
