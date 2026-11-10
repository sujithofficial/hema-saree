/**
 * DEMONSTRATION CATALOGUE
 * All products, prices, stock levels and orders below are sample data for the
 * prototype. Replace with the boutique's real inventory before launch.
 */

export interface ProductImage {
  /** Path without size suffix, e.g. "/images/p-silk-mustard" → -480.webp / -960.webp */
  base: string;
  alt: string;
  widths?: number[];
}

export type CategorySlug =
  "silk" | "kanchipuram" | "cotton" | "banarasi" | "linen" | "festive" | "daily-wear";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  subtitle: string;
  categories: CategorySlug[];
  price: number;
  mrp?: number;
  stock: number;
  fabric: string;
  colour: string;
  occasion: string[];
  weave: string;
  length: string;
  blouse: string;
  care: string;
  description: string;
  images: ProductImage[];
  isNew?: boolean;
  isBestseller?: boolean;
  isWedding?: boolean;
  addedAt: string;
  popularity: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  note: string;
  description: string;
  image: ProductImage;
}

const img = (base: string, alt: string, widths?: number[]): ProductImage => ({
  base: `/images/${base}`,
  alt,
  widths,
});

export const CATEGORIES: Category[] = [
  {
    slug: "kanchipuram",
    name: "Kanchipuram",
    note: "Temple borders, korvai weaves",
    description:
      "Mulberry silk with contrast borders and pure zari, woven for ceremonies and heirloom keeping.",
    image: img("p-kanchi-emerald", "Emerald Kanchipuram silk saree with rani pink border"),
  },
  {
    slug: "banarasi",
    name: "Banarasi",
    note: "Brocade, katan, tissue",
    description:
      "Dense brocade jaals, katan silk and shimmering tissue — the language of North Indian celebration.",
    image: img("p-banarasi-gold", "Antique gold tissue Banarasi saree with maroon border"),
  },
  {
    slug: "silk",
    name: "Silk",
    note: "Soft silks for every season",
    description: "Lightweight soft silks and art silks with refined zari detail, easy to drape.",
    image: img("p-silk-mustard", "Mustard soft silk saree with bottle green border"),
  },
  {
    slug: "cotton",
    name: "Cotton",
    note: "Block prints, Chettinad, handloom",
    description: "Breathable handloom cottons and hand block prints for long Indian summers.",
    image: img("p-cotton-indigo", "Indigo hand block printed cotton saree"),
  },
  {
    slug: "linen",
    name: "Linen",
    note: "Slub texture, zari stripes",
    description: "Pure linen with a soft slub hand and quiet metallic borders — modern and airy.",
    image: img("p-linen-sage", "Sage green linen saree with silver border"),
  },
  {
    slug: "festive",
    name: "Festive",
    note: "Organza, zari, celebration",
    description: "Sarees chosen for pujas, sangeets and festive evenings with family.",
    image: img("p-festive-magenta", "Magenta organza festive saree with gold scallop border"),
  },
  {
    slug: "daily-wear",
    name: "Daily Wear",
    note: "Easy drapes, honest weaves",
    description:
      "Everyday handlooms that soften with every wash — for work, errands and slow Sundays.",
    image: img("p-daily-terracotta", "Terracotta handloom cotton saree with ikat border"),
  },
];

const SILK_BLOUSE = "Unstitched running blouse piece, 0.8 m, in matching silk";
const COTTON_BLOUSE = "Unstitched running blouse piece, 0.8 m";

export const PRODUCTS: Product[] = [
  {
    id: "p01",
    slug: "aranmanai-wine-kanchipuram-silk",
    sku: "HS-KAN-101",
    name: "Aranmanai",
    subtitle: "Wine Kanchipuram silk with gopuram zari border",
    categories: ["kanchipuram", "silk", "festive"],
    price: 24500,
    mrp: 27900,
    stock: 3,
    fabric: "Pure mulberry silk, tested zari",
    colour: "Wine maroon & antique gold",
    occasion: ["Wedding", "Festive", "Ceremony"],
    weave: "Korvai with temple (gopuram) border",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: SILK_BLOUSE,
    care: "Dry clean only. Store wrapped in muslin; refold every few months.",
    description:
      "A deep wine body framed by a broad antique-gold border of rising temple spires. The pallu carries the same gopuram rhythm in denser zari, with scattered mango buttis across the body. Weighty, lustrous and made to be handed down.",
    images: [
      img("hero", "Model wearing the Aranmanai wine Kanchipuram silk saree", [640, 960, 1280]),
      img("d-zari-maroon", "Close-up of gopuram zari border on wine silk"),
      img("hero-crop", "Pallu and border detail of the Aranmanai saree"),
    ],
    isBestseller: true,
    isWedding: true,
    addedAt: "2026-09-02",
    popularity: 98,
  },
  {
    id: "p02",
    slug: "maragatham-emerald-kanchipuram-silk",
    sku: "HS-KAN-102",
    name: "Maragatham",
    subtitle: "Emerald Kanchipuram with rani pink peacock border",
    categories: ["kanchipuram", "silk", "festive"],
    price: 21800,
    stock: 5,
    fabric: "Pure mulberry silk, tested zari",
    colour: "Emerald green & rani pink",
    occasion: ["Wedding", "Festive"],
    weave: "Contrast border with peacock and floral motifs",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched contrast blouse piece in rani pink, 0.8 m",
    care: "Dry clean only. Avoid spraying perfume directly on zari.",
    description:
      "Emerald — maragatham — against a rani pink border is a pairing as old as the Kanchi looms. Peacocks walk the border in gold, while small leaf buttis keep the body light. A saree for muhurtham mornings.",
    images: [
      img("p-kanchi-emerald", "Model wearing the Maragatham emerald Kanchipuram saree"),
      img("d-emerald", "Emerald silk with rani pink peacock zari border, close-up"),
      img("p-kanchi-emerald-crop", "Pallu detail of the Maragatham saree"),
    ],
    isNew: true,
    isWedding: true,
    addedAt: "2026-10-28",
    popularity: 86,
  },
  {
    id: "p03",
    slug: "swarna-jaal-gold-tissue-banarasi",
    sku: "HS-BAN-201",
    name: "Swarna Jaal",
    subtitle: "Antique gold tissue Banarasi with maroon border",
    categories: ["banarasi", "silk", "festive"],
    price: 18900,
    mrp: 21500,
    stock: 4,
    fabric: "Tissue silk with zari brocade",
    colour: "Antique gold & maroon",
    occasion: ["Wedding", "Reception", "Festive"],
    weave: "Kadhwa floral jaal",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched maroon brocade blouse piece, 0.8 m",
    care: "Dry clean only. Fold with tissue paper between layers.",
    description:
      "A soft-gold tissue ground woven through with an all-over floral jaal and finished with a deep maroon border. It catches lamplight beautifully — the saree for a reception or the evening of a wedding.",
    images: [
      img("p-banarasi-gold", "Model wearing the Swarna Jaal gold Banarasi saree"),
      img("d-gold", "Gold tissue brocade with maroon border, close-up"),
      img("p-banarasi-gold-crop", "Pallu detail of the Swarna Jaal saree"),
    ],
    isBestseller: true,
    isWedding: true,
    addedAt: "2026-08-14",
    popularity: 94,
  },
  {
    id: "p04",
    slug: "gulabi-rose-banarasi-katan",
    sku: "HS-BAN-202",
    name: "Gulabi",
    subtitle: "Dusty rose katan silk with scalloped zari border",
    categories: ["banarasi", "silk", "festive"],
    price: 16400,
    stock: 2,
    fabric: "Katan silk with silver & gold zari",
    colour: "Dusty rose",
    occasion: ["Engagement", "Festive", "Day wedding"],
    weave: "Buttidar with scalloped border",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: SILK_BLOUSE,
    care: "Dry clean only.",
    description:
      "Soft rose katan with tiny two-tone buttis and a scalloped border that sits delicately at the hem. Understated enough for a day function, special enough for an engagement.",
    images: [
      img("p-banarasi-rose", "Model wearing the Gulabi dusty rose Banarasi saree"),
      img("d-rose", "Dusty rose katan silk with scalloped zari border, close-up"),
      img("p-banarasi-rose-crop", "Pallu detail of the Gulabi saree"),
    ],
    isNew: true,
    addedAt: "2026-11-01",
    popularity: 80,
  },
  {
    id: "p05",
    slug: "lal-bagh-crimson-bridal-banarasi",
    sku: "HS-BAN-203",
    name: "Lal Bagh",
    subtitle: "Crimson bridal Banarasi with heavy zari pallu",
    categories: ["banarasi", "silk", "festive"],
    price: 28600,
    mrp: 32000,
    stock: 1,
    fabric: "Pure katan silk, dense zari brocade",
    colour: "Crimson red & gold",
    occasion: ["Bridal", "Wedding"],
    weave: "All-over floral jaal, heavy pallu",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched brocade blouse piece, 0.8 m",
    care: "Dry clean only. Store flat if possible.",
    description:
      "The classic bridal red — dense gold flowers climbing across the body into a heavy, almost solid zari pallu. Generous in weight and drape, it photographs richly in every light.",
    images: [
      img("p-banarasi-red", "Model wearing the Lal Bagh crimson bridal Banarasi saree"),
      img("d-red-brocade", "Crimson Banarasi brocade and zari pallu, close-up"),
      img("p-banarasi-red-crop", "Pallu detail of the Lal Bagh saree"),
    ],
    isBestseller: true,
    isWedding: true,
    addedAt: "2026-07-20",
    popularity: 92,
  },
  {
    id: "p06",
    slug: "haldi-mustard-soft-silk",
    sku: "HS-SLK-301",
    name: "Haldi",
    subtitle: "Mustard soft silk with bottle green temple border",
    categories: ["silk", "festive"],
    price: 9800,
    stock: 8,
    fabric: "Soft silk",
    colour: "Mustard & bottle green",
    occasion: ["Festive", "Haldi", "Puja"],
    weave: "Plain body with temple-triangle border",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched bottle green blouse piece, 0.8 m",
    care: "Dry clean recommended.",
    description:
      "Turmeric-bright soft silk with a bottle green border and a fine row of zari temple triangles. Light enough to wear all day through a puja or a haldi morning.",
    images: [
      img("p-silk-mustard", "Model wearing the Haldi mustard soft silk saree"),
      img("d-mustard", "Mustard silk with bottle green border and tassels, close-up"),
      img("p-silk-mustard-crop", "Pallu detail of the Haldi saree"),
    ],
    isBestseller: true,
    addedAt: "2026-09-18",
    popularity: 90,
  },
  {
    id: "p07",
    slug: "mayil-peacock-blue-silk",
    sku: "HS-SLK-302",
    name: "Mayil",
    subtitle: "Peacock blue silk with parrot green border",
    categories: ["silk", "festive"],
    price: 12400,
    mrp: 13900,
    stock: 0,
    fabric: "Pure silk, zari border",
    colour: "Peacock blue & parrot green",
    occasion: ["Festive", "Wedding guest"],
    weave: "Peacock buttis with contrast border",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched parrot green blouse piece, 0.8 m",
    care: "Dry clean only.",
    description:
      "Mayil means peacock — woven here as small buttis across a deep blue body and as a full procession along the parrot green border.",
    images: [
      img("p-silk-peacock", "Model wearing the Mayil peacock blue silk saree"),
      img("d-peacock", "Peacock blue silk with green zari border, close-up"),
      img("p-silk-peacock-crop", "Pallu detail of the Mayil saree"),
    ],
    isNew: true,
    addedAt: "2026-10-20",
    popularity: 84,
  },
  {
    id: "p08",
    slug: "neel-indigo-block-print-cotton",
    sku: "HS-COT-401",
    name: "Neel",
    subtitle: "Indigo hand block printed mulmul cotton",
    categories: ["cotton", "daily-wear"],
    price: 2450,
    stock: 14,
    fabric: "Mulmul cotton",
    colour: "Indigo & white",
    occasion: ["Everyday", "Office"],
    weave: "Hand block printed",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: COTTON_BLOUSE,
    care: "Hand wash cold separately; natural dyes may bleed slightly at first.",
    description:
      "Soft mulmul printed by hand with small white florals on indigo. Breathable, light and easy — the saree you'll reach for on a busy weekday.",
    images: [
      img("p-cotton-indigo", "Model wearing the Neel indigo block print cotton saree"),
      img("d-indigo", "Indigo block printed cotton with wooden block, close-up"),
      img("p-cotton-indigo-crop", "Pallu detail of the Neel saree"),
    ],
    isBestseller: true,
    addedAt: "2026-06-11",
    popularity: 96,
  },
  {
    id: "p09",
    slug: "kattam-ivory-chettinad-cotton",
    sku: "HS-COT-402",
    name: "Kattam",
    subtitle: "Ivory Chettinad cotton with red checks",
    categories: ["cotton", "daily-wear", "festive"],
    price: 2890,
    stock: 9,
    fabric: "Handloom Chettinad cotton",
    colour: "Ivory & red",
    occasion: ["Everyday", "Onam", "Pongal"],
    weave: "Kattam (checks) with broad border",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched red blouse piece, 0.8 m",
    care: "Hand wash or gentle machine wash; starch lightly for crispness.",
    description:
      "Fine red checks on ivory with a broad red border and tasselled pallu. Crisp, structured and quietly festive.",
    images: [
      img("p-cotton-ivory", "Model wearing the Kattam ivory Chettinad cotton saree"),
      img("d-ivory-red", "Ivory checked cotton with red border and tassels, close-up"),
      img("p-cotton-ivory-crop", "Pallu detail of the Kattam saree"),
    ],
    isNew: true,
    addedAt: "2026-10-30",
    popularity: 78,
  },
  {
    id: "p10",
    slug: "pista-sage-linen-silver-zari",
    sku: "HS-LIN-501",
    name: "Pista",
    subtitle: "Sage linen with silver zari border",
    categories: ["linen", "daily-wear"],
    price: 4650,
    mrp: 5200,
    stock: 6,
    fabric: "Pure linen, silver zari",
    colour: "Sage green",
    occasion: ["Office", "Day events"],
    weave: "Handwoven with zari stripe pallu",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: COTTON_BLOUSE,
    care: "Gentle hand wash; iron while slightly damp.",
    description:
      "A cool sage linen with a slubby hand, thin silver borders and a striped, tasselled pallu. Modern without trying too hard.",
    images: [
      img("p-linen-sage", "Model wearing the Pista sage linen saree"),
      img("d-sage", "Sage linen pallu with silver stripes and tassels"),
      img("p-linen-sage-crop", "Drape detail of the Pista saree"),
    ],
    isBestseller: true,
    addedAt: "2026-08-02",
    popularity: 88,
  },
  {
    id: "p11",
    slug: "sandhya-blush-linen-gold-zari",
    sku: "HS-LIN-502",
    name: "Sandhya",
    subtitle: "Blush linen with gold zari stripes",
    categories: ["linen", "daily-wear"],
    price: 4950,
    stock: 7,
    fabric: "Pure linen, gold zari",
    colour: "Blush pink",
    occasion: ["Day events", "Brunch", "Office"],
    weave: "Handwoven, striped pallu with tassels",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: COTTON_BLOUSE,
    care: "Gentle hand wash; iron while slightly damp.",
    description:
      "The colour of evening sky — sandhya — in soft linen, edged in fine gold and finished with blush tassels.",
    images: [
      img("p-linen-blush", "Model wearing the Sandhya blush linen saree"),
      img("d-blush", "Blush linen pallu with gold stripes and tassels"),
      img("p-linen-blush-crop", "Drape detail of the Sandhya saree"),
    ],
    isNew: true,
    addedAt: "2026-11-04",
    popularity: 76,
  },
  {
    id: "p12",
    slug: "rani-magenta-organza-festive",
    sku: "HS-FES-601",
    name: "Rani",
    subtitle: "Magenta organza with gold scallop border",
    categories: ["festive"],
    price: 7800,
    mrp: 8900,
    stock: 4,
    fabric: "Silk organza, embroidered border",
    colour: "Magenta",
    occasion: ["Sangeet", "Festive", "Cocktail"],
    weave: "Sheer organza with sequin buttis",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: "Unstitched magenta silk blouse piece, 0.8 m",
    care: "Dry clean only. Steam, do not press directly.",
    description:
      "Sheer magenta organza that floats as you walk, scattered with sequin buttis and finished with a gold scalloped edge.",
    images: [
      img("p-festive-magenta", "Model wearing the Rani magenta organza saree"),
      img("d-magenta", "Magenta organza with sequin scallop border, close-up"),
      img("p-festive-magenta-crop", "Pallu detail of the Rani saree"),
    ],
    isNew: true,
    addedAt: "2026-10-12",
    popularity: 82,
  },
  {
    id: "p13",
    slug: "mitti-terracotta-ikat-handloom",
    sku: "HS-DLY-701",
    name: "Mitti",
    subtitle: "Terracotta handloom cotton with ikat border",
    categories: ["cotton", "daily-wear"],
    price: 1980,
    stock: 18,
    fabric: "Handloom cotton",
    colour: "Terracotta, black & mustard",
    occasion: ["Everyday", "Office"],
    weave: "Plain body with ikat border",
    length: "5.5 m saree + 0.8 m blouse",
    blouse: COTTON_BLOUSE,
    care: "Hand wash cold; dry in shade.",
    description:
      "Earth-toned handloom cotton with a graphic ikat border in black and mustard. Softens beautifully with every wash.",
    images: [
      img("p-daily-terracotta", "Model wearing the Mitti terracotta handloom cotton saree"),
      img("d-terracotta", "Terracotta cotton with ikat border and tassels, close-up"),
      img("p-daily-terracotta-crop", "Pallu detail of the Mitti saree"),
    ],
    isBestseller: true,
    addedAt: "2026-07-05",
    popularity: 91,
  },
];

export const LOOKBOOK = {
  hero: img(
    "hero",
    "Model in a wine Kanchipuram silk saree beside an arched doorway",
    [640, 960, 1280],
  ),
  wedding: img("wedding", "Bride in a crimson Banarasi saree on a carved swing", [800, 1600]),
  craft: img("craft-loom", "Hands weaving maroon silk with gold zari on a handloom"),
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
