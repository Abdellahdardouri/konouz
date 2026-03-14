import { Product, Menu, Collection } from '@/lib/shopify/types';

function makeProduct(
  id: string,
  handle: string,
  title: string,
  description: string,
  price: string,
  images: string[],
  tags: string[],
  category: string
): Product {
  const imageObjs = images.map((url, i) => ({
    url,
    altText: `${title} - صورة ${i + 1}`,
    width: 800,
    height: 1000
  }));

  return {
    id,
    handle,
    availableForSale: true,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [{ id: `option-${id}`, name: 'النوع', values: ['قياسي'] }],
    priceRange: {
      maxVariantPrice: { amount: price, currencyCode: 'MAD' },
      minVariantPrice: { amount: price, currencyCode: 'MAD' }
    },
    variants: [
      {
        id: `variant-${id}`,
        title: 'قياسي',
        availableForSale: true,
        selectedOptions: [{ name: 'النوع', value: 'قياسي' }],
        price: { amount: price, currencyCode: 'MAD' },
        image: { originalSrc: images[0] ?? '' }
      }
    ],
    featuredImage: imageObjs[0] ?? { url: '', altText: title, width: 800, height: 1000 },
    images: imageObjs,
    seo: { title, description },
    tags: [category, ...tags],
    updatedAt: new Date().toISOString()
  };
}

// Pexels helper — consistent sizing
const px = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const mockProducts: Product[] = [
  // ── Kitchen / المطبخ ──────────────────────────────
  makeProduct(
    'p1',
    'electric-kettle',
    'غلاية كهربائية 1.7 لتر',
    'غلاية بسرعة تسخين عالية وشاشة درجة الحرارة. مثالية للشاي والنسكافيه في دقيقة.',
    '249',
    [px('2878741'), px('4226896'), px('7362541')],
    ['trending', 'new'],
    'kitchen'
  ),

  makeProduct(
    'p2',
    'blender-pro',
    'خلاط قوي متعدد السرعات',
    'خلاط 600 واط بـ 8 سرعات مناسب للعصائر والصلصات. حوض زجاجي 1.5 لتر سهل التنظيف.',
    '399',
    [px('3735218'), px('4397891'), px('5946029')],
    ['trending'],
    'kitchen'
  ),

  makeProduct(
    'p3',
    'food-containers',
    'طقم علب زجاجية لحفظ الطعام',
    'مجموعة 8 علب زجاجية بأغطية محكمة للثلاجة والميكروويف. آمنة للغذاء ومقاومة للروائح.',
    '179',
    [px('6896379'), px('4397887'), px('5905706')],
    ['new'],
    'kitchen'
  ),

  makeProduct(
    'p4',
    'kitchen-knives-set',
    'طقم سكاكين مطبخ ستانلس',
    'طقم 5 سكاكين من الفولاذ المقاوم للصدأ مع حامل خشبي. حادة ومتوازنة لتقطيع دقيق.',
    '319',
    [px('4397897'), px('5765770'), px('4252134')],
    ['trending'],
    'kitchen'
  ),

  makeProduct(
    'p5',
    'cutting-board-bamboo',
    'طقم ألواح تقطيع خيزران',
    'طقم 3 ألواح من الخيزران الطبيعي بأحجام مختلفة. مضاد للجراثيم وسهل التنظيف.',
    '119',
    [px('4110225'), px('7294728'), px('4252138')],
    [],
    'kitchen'
  ),

  makeProduct(
    'p6',
    'non-stick-pan',
    'طاجين تيفال غير لاصق 28 سم',
    'طاجين بطلاء تيتانيوم لمنع الالتصاق وتوزيع الحرارة بالتساوي. مناسب لجميع أنواع المواقد.',
    '289',
    [px('4253700'), px('1633525'), px('5966346')],
    ['trending'],
    'kitchen'
  ),

  makeProduct(
    'p7',
    'pour-over-coffee',
    'طقم تحضير قهوة يدوي بور أوفر',
    'طقم متكامل للقهوة المختصة: مصفاة زجاجية ومطحنة يدوية وكيتل بدقة. لمحبي القهوة الحقيقية.',
    '359',
    [px('302899'), px('312418'), px('894695')],
    ['new'],
    'kitchen'
  ),

  makeProduct(
    'p8',
    'kitchen-scale',
    'ميزان مطبخ رقمي دقيق',
    'ميزان رقمي بدقة حتى 1 جرام وشاشة LCD واضحة. ضروري للطبخ الدقيق والحلويات.',
    '89',
    [px('4397897'), px('4397884'), px('6896379')],
    [],
    'kitchen'
  ),

  // ── Organization / تنظيم المنزل ──────────────────
  makeProduct(
    'p9',
    'drawer-organizer',
    'منظم أدراج شفاف متعدد الأقسام',
    'منظم من البلاستيك الشفاف بـ 6 أقسام قابلة للتخصيص. يناسب المطبخ وغرفة النوم والمكتب.',
    '149',
    [px('4990270'), px('5824901'), px('7319158')],
    ['new'],
    'organization'
  ),

  makeProduct(
    'p10',
    'fabric-storage-boxes',
    'طقم صناديق تخزين قماشية',
    'صناديق بقماش مقوى ومقابض جلدية بـ 3 أحجام. أنيقة وعملية لتنظيم أي غرفة.',
    '199',
    [px('7262776'), px('5824887'), px('4251069')],
    ['trending'],
    'organization'
  ),

  makeProduct(
    'p11',
    'floating-shelves',
    'رفوف عائمة خشبية',
    'رفوف من خشب الصنوبر سهلة التركيب بـ 3 أحجام. مثالية لعرض الديكور والكتب واللوازم.',
    '259',
    [px('4988575'), px('1350789'), px('6585760')],
    ['new'],
    'organization'
  ),

  makeProduct(
    'p12',
    'desk-organizer',
    'منظم مكتب وأقلام خشبي',
    'منظم خشبي أنيق بـ 5 أقسام للأقلام والملاحظات واللوازم اليومية. يرتب مكتبك بذوق.',
    '89',
    [px('3740747'), px('4050291'), px('6690748')],
    [],
    'organization'
  ),

  makeProduct(
    'p13',
    'vacuum-bags-set',
    'أكياس تخزين مفرغة من الهواء',
    'أكياس تخزين بتقنية ضخ الهواء توفر 80٪ من المساحة. مثالية للملابس الثقيلة والأغطية.',
    '99',
    [px('5765720'), px('4991015'), px('7319110')],
    ['trending', 'new'],
    'organization'
  ),

  makeProduct(
    'p14',
    'door-organizer',
    'منظم خلف الباب متعدد الجيوب',
    'منظم بـ 16 جيب من القماش المقوى يعلق على أي باب. مثالي للحمام وغرفة النوم.',
    '129',
    [px('4988575'), px('5824887'), px('4990270')],
    ['trending'],
    'organization'
  ),

  makeProduct(
    'p15',
    'under-sink-organizer',
    'منظم تحت المغسلة قابل للتعديل',
    'منظم معدني قابل للتمديد يستغل المساحة تحت المغسلة بالكامل. سهل التركيب بدون أدوات.',
    '159',
    [px('4990270'), px('7319158'), px('5824901')],
    [],
    'organization'
  ),

  // ── Appliances / الأجهزة الصغيرة ──────────────────
  makeProduct(
    'p16',
    'air-fryer',
    'قلاية هوائية ذكية 4.5 لتر',
    'قلاية هوائية بدون زيت بـ 8 برامج تلقائية وشاشة رقمية. طبخ صحي وسريع للعائلة.',
    '599',
    [px('5718069'), px('4551832'), px('4226896')],
    ['trending', 'new'],
    'appliances'
  ),

  makeProduct(
    'p17',
    'espresso-machine',
    'ماكينة إسبريسو منزلية 15 بار',
    'ماكينة قهوة أوتوماتيكية بضغط 15 بار وبخار الحليب. إسبريسو ولاتيه احترافي في البيت.',
    '899',
    [px('302899'), px('1695052'), px('4226715')],
    ['trending'],
    'appliances'
  ),

  makeProduct(
    'p18',
    'hand-mixer',
    'خفاقة يدوية كهربائية 5 سرعات',
    'خفاقة خفيفة بـ 5 سرعات ورأسين للخفق والعجن. مريحة في اليد وسهلة التنظيف.',
    '229',
    [px('4226897'), px('5946029'), px('4226878')],
    ['new'],
    'appliances'
  ),

  makeProduct(
    'p19',
    'rice-cooker',
    'طنجرة أرز ذكية 1.8 لتر',
    'طنجرة أرز بذاكرة ذكية تحافظ على الدفء تلقائياً. تطبخ الأرز والطاجين والبخار بضغطة واحدة.',
    '349',
    [px('4958705'), px('5765734'), px('6984876')],
    [],
    'appliances'
  ),

  makeProduct(
    'p20',
    'mini-chopper',
    'مفرمة مطبخ صغيرة متعددة',
    'مفرمة كهربائية 500 واط للخضر والمكسرات والتوابل. موفرة للوقت وسهلة الغسيل.',
    '279',
    [px('3735218'), px('5946029'), px('4397891')],
    ['trending'],
    'appliances'
  ),

  makeProduct(
    'p21',
    'sandwich-maker',
    'جهاز صنع الساندويش والفطائر',
    'جهاز تحضير الساندويش والفطائر بألواح غير لاصقة قابلة للإزالة. فطور سريع كل يوم.',
    '189',
    [px('4226898'), px('4226884'), px('1640772')],
    ['new'],
    'appliances'
  ),

  makeProduct(
    'p22',
    'electric-grill',
    'شواية كهربائية منزلية',
    'شواية كهربائية 2000 واط بسطح غير لاصق وصينية لتجميع الدهون. شواء داخل البيت بدون دخان.',
    '499',
    [px('4253700'), px('5966346'), px('1633525')],
    ['trending'],
    'appliances'
  ),

  // ── Bathroom / الحمام والتنظيف ────────────────────
  makeProduct(
    'p23',
    'bathroom-organizer',
    'منظم حمام خيزران 3 طوابق',
    'منظم خيزران طبيعي بـ 3 طوابق للشامبو والصابون والمناشف. يضفي لمسة طبيعية على حمامك.',
    '169',
    [px('6197122'), px('3771113'), px('6957655')],
    ['new'],
    'bathroom'
  ),

  makeProduct(
    'p24',
    'cleaning-mop',
    'مكنسة ممسحة دوارة 360 درجة',
    'ممسحة ذكية بدوران 360° وعصر بدون تلويث اليدين. تنظيف سريع وفعال لجميع أنواع الأرضيات.',
    '199',
    [px('9462278'), px('4107118'), px('6195756')],
    ['trending'],
    'bathroom'
  ),

  makeProduct(
    'p25',
    'towel-rack',
    'حامل مناشف بـ 5 بارات',
    'حامل مناشف من الحديد بطلاء مضاد للصدأ وقواعد ثابتة. يسع 5 مناشف كبيرة دفعة واحدة.',
    '129',
    [px('6210536'), px('3766912'), px('6957643')],
    [],
    'bathroom'
  ),

  makeProduct(
    'p26',
    'shower-caddy',
    'سلة دش ستانلس ستيل 3 طوابق',
    'سلة دش من الستانلس المقاوم للصدأ تعلق على شاور دون حفر. تسع كل مستلزمات الحمام.',
    '89',
    [px('6957647'), px('6957650'), px('6210537')],
    ['new'],
    'bathroom'
  ),

  makeProduct(
    'p27',
    'bath-mat-set',
    'طقم سجادات حمام قطنية',
    'طقم سجادتين من القطن العضوي: ناعمتان ومضادتان للانزلاق. غسيل سهل في الغسالة.',
    '149',
    [px('6197125'), px('6197126'), px('4210358')],
    ['trending'],
    'bathroom'
  ),

  makeProduct(
    'p28',
    'soap-dispenser',
    'موزع صابون فوم أوتوماتيك',
    'موزع صابون بمستشعر لمسي يعطي كمية دقيقة. يمنع التلوث ويوفر الصابون.',
    '79',
    [px('6957643'), px('4210342'), px('3771113')],
    ['new'],
    'bathroom'
  )
];

// ── Data access functions ────────────────────────────────────

export function getMockProducts(): Product[] {
  return mockProducts;
}

export function getMockCollectionProducts(collection: string): Product[] {
  if (collection === 'new-arrivals' || collection === 'new')
    return mockProducts.filter((p) => p.tags.includes('new'));
  if (collection === 'best-sellers' || collection === 'trending')
    return mockProducts.filter((p) => p.tags.includes('trending'));
  if (collection === 'all-products' || collection === '') return mockProducts;
  if (collection === 'kitchen-tools' || collection === 'cooking')
    return mockProducts.filter((p) => p.tags.includes('kitchen'));
  if (collection === 'organizers')
    return mockProducts.filter((p) => p.tags.includes('organization'));
  return mockProducts.filter((p) => p.tags.includes(collection));
}

export function getMockProduct(handle: string): Product | undefined {
  return mockProducts.find((p) => p.handle === handle);
}

export function getMockMenu(): Menu[] {
  return [
    { title: 'كل المنتجات', path: '/search', items: [] },
    {
      title: 'المطبخ',
      path: '/search/kitchen',
      items: [
        { title: 'أدوات المطبخ', path: '/search/kitchen-tools' },
        { title: 'التحضير والطبخ', path: '/search/cooking' },
        { title: 'حفظ الطعام', path: '/search/kitchen' }
      ]
    },
    {
      title: 'تنظيم المنزل',
      path: '/search/organization',
      items: [
        { title: 'علب ومنظمات', path: '/search/organizers' },
        { title: 'رفوف وتخزين', path: '/search/organization' }
      ]
    },
    { title: 'الأجهزة الصغيرة', path: '/search/appliances', items: [] },
    { title: 'الحمام والتنظيف', path: '/search/bathroom', items: [] },
    { title: 'وصل حديثاً', path: '/search/new-arrivals', items: [] },
    { title: 'المنتجات الرائجة', path: '/search/best-sellers', items: [] },
    { title: 'من نحن', path: '/about-us', items: [] }
  ];
}

export function getMockCollections(): Collection[] {
  return [
    {
      handle: '',
      title: 'كل المنتجات',
      description: 'جميع منتجات كنوز',
      seo: { title: 'كل المنتجات', description: 'جميع منتجات كنوز' },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'all-products',
      title: 'كل المنتجات',
      description: 'جميع منتجات كنوز',
      seo: { title: 'كل المنتجات', description: 'جميع منتجات كنوز' },
      path: '/search/all-products',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'kitchen',
      title: 'المطبخ',
      description: 'أدوات ومستلزمات المطبخ',
      seo: { title: 'المطبخ', description: 'أدوات ومستلزمات المطبخ' },
      path: '/search/kitchen',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'kitchen-tools',
      title: 'أدوات المطبخ',
      description: 'أدوات مطبخ عملية',
      seo: { title: 'أدوات المطبخ', description: 'أدوات مطبخ عملية' },
      path: '/search/kitchen-tools',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'cooking',
      title: 'التحضير والطبخ',
      description: 'كل ما يلزم للطبخ',
      seo: { title: 'التحضير والطبخ', description: 'كل ما يلزم للطبخ' },
      path: '/search/cooking',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'organization',
      title: 'تنظيم المنزل',
      description: 'منتجات تنظيم المنزل',
      seo: { title: 'تنظيم المنزل', description: 'منتجات تنظيم المنزل' },
      path: '/search/organization',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'organizers',
      title: 'علب ومنظمات',
      description: 'علب ومنظمات البيت',
      seo: { title: 'علب ومنظمات', description: 'علب ومنظمات البيت' },
      path: '/search/organizers',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'appliances',
      title: 'الأجهزة الصغيرة',
      description: 'أجهزة منزلية صغيرة',
      seo: { title: 'الأجهزة الصغيرة', description: 'أجهزة منزلية صغيرة' },
      path: '/search/appliances',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'bathroom',
      title: 'الحمام والتنظيف',
      description: 'منتجات الحمام والنظافة',
      seo: { title: 'الحمام والتنظيف', description: 'منتجات الحمام والنظافة' },
      path: '/search/bathroom',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'new-arrivals',
      title: 'وصل حديثاً',
      description: 'أحدث المنتجات',
      seo: { title: 'وصل حديثاً', description: 'أحدث المنتجات' },
      path: '/search/new-arrivals',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'best-sellers',
      title: 'المنتجات الرائجة',
      description: 'المنتجات الرائجة',
      seo: { title: 'المنتجات الرائجة', description: 'المنتجات الرائجة' },
      path: '/search/best-sellers',
      updatedAt: new Date().toISOString()
    },
    {
      handle: 'trending',
      title: 'المنتجات الرائجة',
      description: 'المنتجات الرائجة',
      seo: { title: 'المنتجات الرائجة', description: 'المنتجات الرائجة' },
      path: '/search/trending',
      updatedAt: new Date().toISOString()
    }
  ];
}
