# كنوز Migration Notes

## File Map — What Controls What

| File                                                  | Controls                                            |
| ----------------------------------------------------- | --------------------------------------------------- |
| `src/app/layout.tsx`                                  | Root HTML shell, lang/dir, fonts, site metadata     |
| `src/app/page.tsx`                                    | Homepage section order and SEO metadata             |
| `src/app/about-us/page.tsx`                           | About Us page (new)                                 |
| `src/fonts/fonts.ts`                                  | Font imports (Lora, Quicksand, Cairo)               |
| `tailwind.config.js`                                  | Colors, font families, animations                   |
| `src/styles/globals.css`                              | Global CSS, btn classes, RTL overrides              |
| `src/lib/mock-data.ts`                                | All 20 mock products, mock menu, mock collections   |
| `src/lib/shopify/index.ts`                            | Shopify API with mock-data fallback                 |
| `src/components/layout/Logo.tsx`                      | Arabic wordmark "كنوز"                              |
| `src/components/sections/HomeVideo.tsx`               | Hero section with video + overlay + CTAs            |
| `src/components/sections/CategoryHighlights.tsx`      | 4-category card grid (new section)                  |
| `src/components/sections/Discounts.tsx`               | Marquee banner                                      |
| `src/components/sections/BestSellers/index.tsx`       | Tabbed product slider (kitchen/org/appliances/bath) |
| `src/components/sections/BestSellers/getProducts.ts`  | Server action fetching collection products          |
| `src/components/sections/BestSellers/Slider.tsx`      | Swiper product slider                               |
| `src/components/sections/Promotions.tsx`              | Full-width promo section                            |
| `src/components/sections/TrustBlock.tsx`              | 3 trust point cards (new section)                   |
| `src/components/sections/NewArrivals/NewArrivals.tsx` | New arrivals product list                           |
| `src/components/sections/AboutUs.tsx`                 | Short about blurb section                           |
| `src/components/sections/Header/index.tsx`            | Site header with nav menu                           |
| `src/components/sections/Footer/Categories.tsx`       | Footer nav links                                    |
| `src/components/sections/Footer/SocialMedia.tsx`      | Social media icons                                  |
| `src/components/sections/Footer/CopyRight.tsx`        | Copyright line                                      |
| `src/components/sections/Footer/Disclaimer.tsx`       | Demo disclaimer                                     |
| `src/components/product/ProductCard.tsx`              | Product card (image, title, price, badges)          |
| `src/data/clothing-images.json`                       | Category highlight images/links (repurposed)        |
| `src/data/social-media.json`                          | Social media icon data                              |
| `next.config.js`                                      | Next.js config, image remote domains                |
| `public/videos/hero.mov`                              | Hero background video (copied from board_videos)    |

---

## What Was Changed

### Language & Direction

- `lang="en"` → `lang="ar"`, added `dir="rtl"` to html tag
- Cairo font added (Arabic + Latin support), set as default `sans`
- RTL CSS overrides added to globals.css

### Content (All text replaced with Arabic)

- Hero: new Arabic headline, subline, and two CTA buttons
- Marquee: Moroccan Arabic shipping/brand messages
- BestSellers: tabs changed from clothing → home product categories
- Promotions: new home-products image + Arabic copy
- NewArrivals: Arabic title + "عرض المزيد" CTA
- AboutUs: entirely new Arabic copy
- Header: sr-only labels in Arabic
- Footer: all labels, copyright, disclaimer in Arabic

### Currency

- Japanese Yen (ja-JP / JPY) → Moroccan Dirham format: `{price} د.م.`

### Product Data

- Mock data layer created at `src/lib/mock-data.ts`
- 20 products across 4 categories with Pexels image URLs
- Shopify functions wrapped with `if (!domain)` guard to serve mock data

### Color variants

- Color dot selector removed from ProductCard (home products have no color variants)
- Arabic badges added: "جديد" (new), "الأكثر طلباً" (best-seller), numeric rank

### New Sections

- `CategoryHighlights` — 4-card category grid (between HomeVideo and Discounts)
- `TrustBlock` — 3 trust point cards (between Promotions and NewArrivals)
- `AboutUs page` — full Arabic about-us page at `/about-us`

---

## What Still Needs Real Data

### Products

- Replace mock products in `src/lib/mock-data.ts` with real product data
- Or configure Shopify environment variables to point to a live store:
  ```
  SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
  SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
  ```

### Images

- All product images are Pexels placeholders — replace with actual product photos
- Promotions background (`Promotions.tsx`) uses a Pexels shelf image — replace with brand photo
- Category highlight images in `clothing-images.json` use Pexels — replace with brand imagery

### Videos

- `public/videos/hero.mov` is AdobeStock_742901103.mov (home/board related)
- Browser support: `.mov` works natively only in Safari; other browsers fall back to `clothing-shoot.mp4`
- **Recommended**: Convert `hero.mov` to `hero.mp4` + `hero.webm` for full cross-browser support
  ```
  ffmpeg -i hero.mov -c:v libx264 -crf 23 hero.mp4
  ffmpeg -i hero.mov -c:v libvpx-vp9 -b:v 0 -crf 33 hero.webm
  ```

### Social Media

- URLs in `src/data/social-media.json` are empty strings — add real social profile URLs

### Environment Variables

- `SITE_NAME` env var should be set to `كنوز` in production
- `NEXT_PUBLIC_VERCEL_URL` should be set on deployment

### SEO

- Replace placeholder screenshots at `/images/screenshots/home.webp` with actual screenshots
- Add proper Open Graph images

---

## Where to Insert Real Products

**Option A: Shopify** — Set env vars, products flow automatically
**Option B: Mock data** — Edit `src/lib/mock-data.ts`:

- Update the `mockProducts` array
- Each product needs: id, handle, title, description, price, images[], tags[], category
- Use the `makeProduct()` helper function already defined there

**Category tags used by BestSellers:**

- `'kitchen'` — المطبخ tab
- `'organization'` — تنظيم المنزل tab
- `'appliances'` — الأجهزة الصغيرة tab
- `'bathroom'` — الحمام tab

**Badge tags:**

- `'new'` — shows "جديد" badge
- `'best-seller'` — shows "الأكثر طلباً" badge

---

## Asset Placeholders

| Asset           | Status                          | Replace With             |
| --------------- | ------------------------------- | ------------------------ |
| Product images  | Pexels URLs                     | Real product photos      |
| Hero video      | `hero.mov` (QuickTime)          | `hero.mp4` + `hero.webm` |
| Promotions bg   | Pexels shelf photo              | Brand lifestyle photo    |
| Category images | Pexels kitchen/bathroom photos  | Brand category photos    |
| Logo            | Arabic text "كنوز"              | Keep or add SVG logo     |
| Social URLs     | Empty strings                   | Real social links        |
| OG image        | `/images/screenshots/home.webp` | Real screenshot          |
