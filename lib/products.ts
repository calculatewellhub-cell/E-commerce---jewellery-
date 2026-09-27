export type CategorySlug = "rings" | "necklaces" | "earrings" | "bracelets" | "pendants" | "bangles";
export type Metal = "Yellow Gold" | "Rose Gold" | "White Gold" | "Platinum";

export interface Product {
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  metal: Metal;
  purity: string;
  weight: string;
  gemstone: string;
  certification: string;
  image: string;
  short: string;
  description: string;
  highlights: string[];
  rating: number;
  reviews: number;
  badge?: string;
  tags: string[];
  inStock: boolean;
  /** Colours used by the interactive 3D viewer */
  viewer: { metal: string; gem: string | null };
}

export interface Category {
  slug: CategorySlug;
  name: string;
  title: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    slug: "rings",
    name: "Rings",
    title: "Engagement & Diamond Rings",
    description:
      "Solitaires, halo rings, bands and signet rings in 18K gold and platinum, set with IGI-certified diamonds and precious gemstones.",
    image: "/images/products/eternal-solitaire-diamond-ring.svg",
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    title: "Gold & Diamond Necklaces",
    description:
      "Bridal chokers, kundan and polki necklaces and everyday gold chains — heirloom craftsmanship for every occasion.",
    image: "/images/products/royal-emerald-kundan-necklace.svg",
  },
  {
    slug: "earrings",
    name: "Earrings",
    title: "Jhumkas, Studs & Drop Earrings",
    description: "Pearl jhumkas, gemstone studs and diamond drops, designed to be light enough to wear all day.",
    image: "/images/products/pearl-drop-jhumka-earrings.svg",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    title: "Tennis & Gold Bracelets",
    description: "Diamond tennis bracelets and sculpted gold bracelets that stack beautifully.",
    image: "/images/products/celestial-diamond-tennis-bracelet.svg",
  },
  {
    slug: "pendants",
    name: "Pendants",
    title: "Gemstone & Diamond Pendants",
    description: "Sapphire, ruby and diamond pendants with matching chains, gift-ready.",
    image: "/images/products/sapphire-teardrop-pendant.svg",
  },
  {
    slug: "bangles",
    name: "Bangles",
    title: "Traditional Gold Bangles",
    description: "Temple, antique and contemporary 22K gold bangles, hallmarked and made to your size.",
    image: "/images/products/temple-heritage-gold-bangles.svg",
  },
];

const GOLD = "#e6c068";
const ROSE = "#e8a896";
const WHITE = "#e8ecf0";

export const products: Product[] = [
  {
    slug: "eternal-solitaire-diamond-ring",
    sku: "AUR-RG-001",
    name: "Eternal Solitaire Diamond Ring",
    category: "rings",
    price: 125000,
    compareAt: 139000,
    metal: "White Gold",
    purity: "18K",
    weight: "3.8 g",
    gemstone: "1.00 ct round brilliant diamond, VVS2, F colour",
    certification: "IGI certified diamond, BIS hallmarked gold",
    image: "/images/products/eternal-solitaire-diamond-ring.svg",
    short: "A timeless one-carat solitaire in a four-prong 18K white gold setting.",
    description:
      "The Eternal Solitaire is our signature engagement ring: a one-carat IGI-certified round brilliant diamond held high in a four-prong cathedral setting so it catches light from every angle. The 2 mm comfort-fit band is cast in 18K white gold and rhodium-finished for a lasting, mirror-bright shine.",
    highlights: ["1.00 ct IGI-certified diamond", "Comfort-fit 18K white gold band", "Free resizing within 60 days", "Lifetime exchange at full gold value"],
    rating: 4.9,
    reviews: 214,
    badge: "Bestseller",
    tags: ["engagement ring", "solitaire", "diamond ring", "proposal"],
    inStock: true,
    viewer: { metal: WHITE, gem: "#dff3ff" },
  },
  {
    slug: "rose-petal-halo-ring",
    sku: "AUR-RG-002",
    name: "Rose Petal Halo Ring",
    category: "rings",
    price: 68500,
    metal: "Rose Gold",
    purity: "18K",
    weight: "3.2 g",
    gemstone: "0.80 ct pink sapphire with 0.24 ct diamond halo",
    certification: "GIA-graded sapphire, BIS hallmarked gold",
    image: "/images/products/rose-petal-halo-ring.svg",
    short: "A blush pink sapphire framed by a halo of micro-pavé diamonds.",
    description:
      "Soft, romantic and quietly bold. A cushion-cut pink sapphire sits inside a halo of 18 micro-pavé diamonds, set on a slender 18K rose gold band with petal-shaped shoulders.",
    highlights: ["Natural pink sapphire", "18 micro-pavé diamonds", "Petal-shaped shoulders", "Gift box & certificate included"],
    rating: 4.8,
    reviews: 96,
    badge: "New",
    tags: ["halo ring", "pink sapphire", "rose gold ring", "anniversary"],
    inStock: true,
    viewer: { metal: ROSE, gem: "#f06aa0" },
  },
  {
    slug: "royal-emerald-kundan-necklace",
    sku: "AUR-NK-001",
    name: "Royal Emerald Kundan Necklace",
    category: "necklaces",
    price: 245000,
    compareAt: 268000,
    metal: "Yellow Gold",
    purity: "22K",
    weight: "48.5 g",
    gemstone: "Zambian emerald drops with kundan work",
    certification: "BIS hallmarked 22K gold",
    image: "/images/products/royal-emerald-kundan-necklace.svg",
    short: "A regal 22K kundan necklace with hand-set Zambian emerald drops.",
    description:
      "Inspired by Mughal court jewellery, this necklace is hand-set by our karigars in Jaipur using traditional kundan technique. Seven Zambian emerald drops hang from a 22K gold collar, finished with meenakari enamel on the reverse.",
    highlights: ["Hand-set kundan by Jaipur artisans", "Zambian emerald drops", "Meenakari enamel reverse", "Matching earrings available"],
    rating: 5,
    reviews: 58,
    badge: "Bridal",
    tags: ["bridal necklace", "kundan", "emerald necklace", "wedding jewellery"],
    inStock: true,
    viewer: { metal: GOLD, gem: "#1fae6b" },
  },
  {
    slug: "celestial-diamond-tennis-bracelet",
    sku: "AUR-BR-001",
    name: "Celestial Diamond Tennis Bracelet",
    category: "bracelets",
    price: 185000,
    metal: "White Gold",
    purity: "18K",
    weight: "9.6 g",
    gemstone: "3.10 ct total, 52 round diamonds, VS1, G–H",
    certification: "IGI certified, BIS hallmarked",
    image: "/images/products/celestial-diamond-tennis-bracelet.svg",
    short: "Fifty-two matched diamonds in a flexible line of light.",
    description:
      "A continuous line of 52 hand-matched round diamonds, each in its own four-prong basket so the bracelet moves like silk. Secured with a hidden box clasp and double safety latch.",
    highlights: ["3.10 ct total diamond weight", "Double safety latch", "Hand-matched stones", "Made-to-size"],
    rating: 4.9,
    reviews: 71,
    tags: ["tennis bracelet", "diamond bracelet", "gift for her"],
    inStock: true,
    viewer: { metal: WHITE, gem: "#dff3ff" },
  },
  {
    slug: "pearl-drop-jhumka-earrings",
    sku: "AUR-ER-001",
    name: "Pearl Drop Jhumka Earrings",
    category: "earrings",
    price: 42000,
    metal: "Yellow Gold",
    purity: "22K",
    weight: "8.4 g",
    gemstone: "South Sea cultured pearls",
    certification: "BIS hallmarked 22K gold",
    image: "/images/products/pearl-drop-jhumka-earrings.svg",
    short: "Lightweight 22K gold jhumkas with lustrous South Sea pearls.",
    description:
      "Classic temple-bell jhumkas reimagined to be light enough for all-day wear. Each dome is hand-chased with a granulation border and finished with a lustrous South Sea pearl drop.",
    highlights: ["Only 4.2 g per earring", "South Sea pearls", "Hand-chased granulation", "Screw-back for security"],
    rating: 4.8,
    reviews: 132,
    badge: "Trending",
    tags: ["jhumka", "pearl earrings", "gold earrings", "festive"],
    inStock: true,
    viewer: { metal: GOLD, gem: "#f7efe6" },
  },
  {
    slug: "sapphire-teardrop-pendant",
    sku: "AUR-PD-001",
    name: "Sapphire Teardrop Pendant",
    category: "pendants",
    price: 56000,
    metal: "White Gold",
    purity: "18K",
    weight: "2.9 g",
    gemstone: "1.20 ct Ceylon blue sapphire with diamond halo",
    certification: "GIA-graded sapphire",
    image: "/images/products/sapphire-teardrop-pendant.svg",
    short: "A deep Ceylon sapphire teardrop in a halo of diamonds, chain included.",
    description:
      "A pear-shaped Ceylon sapphire of rich cornflower blue, framed by twelve brilliant diamonds and suspended from an 18-inch 18K white gold cable chain.",
    highlights: ["1.20 ct Ceylon sapphire", "18-inch chain included", "Diamond halo", "Gift-ready packaging"],
    rating: 4.7,
    reviews: 64,
    tags: ["sapphire pendant", "gemstone necklace", "gift"],
    inStock: true,
    viewer: { metal: WHITE, gem: "#2a5bd7" },
  },
  {
    slug: "temple-heritage-gold-bangles",
    sku: "AUR-BG-001",
    name: "Temple Heritage Gold Bangles (Pair)",
    category: "bangles",
    price: 138000,
    metal: "Yellow Gold",
    purity: "22K",
    weight: "24.0 g (pair)",
    gemstone: "Ruby accents",
    certification: "BIS hallmarked 22K gold",
    image: "/images/products/temple-heritage-gold-bangles.svg",
    short: "A pair of 22K temple bangles with ruby accents.",
    description:
      "South Indian temple craftsmanship in a pair of 22K gold bangles, embossed with lotus motifs and set with ruby accents. Available in sizes 2.2 to 2.10.",
    highlights: ["Sold as a pair", "Lotus temple motifs", "Ruby accents", "Sizes 2.2 – 2.10"],
    rating: 4.9,
    reviews: 88,
    tags: ["gold bangles", "temple jewellery", "south indian"],
    inStock: true,
    viewer: { metal: GOLD, gem: "#e0204a" },
  },
  {
    slug: "classic-22k-gold-rope-chain",
    sku: "AUR-NK-002",
    name: "Classic 22K Gold Rope Chain",
    category: "necklaces",
    price: 28500,
    metal: "Yellow Gold",
    purity: "22K",
    weight: "4.1 g",
    gemstone: "None",
    certification: "BIS hallmarked 22K gold",
    image: "/images/products/classic-22k-gold-rope-chain.svg",
    short: "An everyday 22K gold rope chain, 20 inches.",
    description:
      "A finely twisted 22K gold rope chain that layers beautifully or holds your favourite pendant. Lobster clasp, 20-inch length, unisex.",
    highlights: ["20-inch length", "Unisex", "Lobster clasp", "Pairs with any pendant"],
    rating: 4.6,
    reviews: 305,
    tags: ["gold chain", "everyday", "unisex", "men"],
    inStock: true,
    viewer: { metal: GOLD, gem: null },
  },
  {
    slug: "ruby-heart-stud-earrings",
    sku: "AUR-ER-002",
    name: "Ruby Heart Stud Earrings",
    category: "earrings",
    price: 34000,
    metal: "Rose Gold",
    purity: "18K",
    weight: "2.6 g",
    gemstone: "0.90 ct total Burmese rubies",
    certification: "BIS hallmarked gold",
    image: "/images/products/ruby-heart-stud-earrings.svg",
    short: "Heart-cut Burmese rubies in 18K rose gold — the perfect gift.",
    description: "Two heart-cut rubies of vivid pigeon-blood red, set in 18K rose gold with a hidden diamond gallery.",
    highlights: ["Burmese rubies", "Hidden diamond gallery", "Push-back with safety lock", "Valentine's favourite"],
    rating: 4.8,
    reviews: 119,
    tags: ["ruby earrings", "studs", "gift for her", "valentine"],
    inStock: true,
    viewer: { metal: ROSE, gem: "#e0204a" },
  },
  {
    slug: "mens-onyx-signet-ring",
    sku: "AUR-RG-003",
    name: "Men's Onyx Signet Ring",
    category: "rings",
    price: 48000,
    metal: "Yellow Gold",
    purity: "18K",
    weight: "7.2 g",
    gemstone: "Black onyx",
    certification: "BIS hallmarked gold",
    image: "/images/products/mens-onyx-signet-ring.svg",
    short: "A bold 18K gold signet ring with a polished black onyx face.",
    description: "A modern heirloom for him: a weighty 18K gold signet with a polished black onyx face. Can be engraved with initials free of charge.",
    highlights: ["Free initial engraving", "7.2 g solid 18K gold", "Polished black onyx", "Sizes 16 – 26"],
    rating: 4.7,
    reviews: 47,
    tags: ["mens ring", "signet ring", "gift for him"],
    inStock: true,
    viewer: { metal: GOLD, gem: "#1b1b1b" },
  },
  {
    slug: "bridal-polki-diamond-choker",
    sku: "AUR-NK-003",
    name: "Bridal Polki Diamond Choker Set",
    category: "necklaces",
    price: 395000,
    compareAt: 425000,
    metal: "Yellow Gold",
    purity: "22K",
    weight: "62.0 g",
    gemstone: "Uncut polki diamonds, 9.5 ct total",
    certification: "Certified polki, BIS hallmarked",
    image: "/images/products/bridal-polki-diamond-choker.svg",
    short: "A statement bridal choker with uncut polki diamonds, earrings included.",
    description:
      "Our most requested bridal piece: a 22K gold choker set with 9.5 carats of uncut polki diamonds, finished with Basra-style pearl hangings. Comes with matching earrings and a velvet trousseau box.",
    highlights: ["9.5 ct uncut polki", "Matching earrings included", "Velvet trousseau box", "Personal bridal styling on WhatsApp"],
    rating: 5,
    reviews: 39,
    badge: "Bridal",
    tags: ["bridal set", "polki", "choker", "wedding"],
    inStock: true,
    viewer: { metal: GOLD, gem: "#fff8e6" },
  },
  {
    slug: "infinity-rose-gold-bracelet",
    sku: "AUR-BR-002",
    name: "Infinity Rose Gold Bracelet",
    category: "bracelets",
    price: 31500,
    metal: "Rose Gold",
    purity: "18K",
    weight: "5.0 g",
    gemstone: "None",
    certification: "BIS hallmarked gold",
    image: "/images/products/infinity-rose-gold-bracelet.svg",
    short: "Sculpted infinity links in warm 18K rose gold.",
    description: "Softly sculpted infinity links in 18K rose gold — minimal, meaningful and made to be worn every day.",
    highlights: ["Adjustable 6.5–7.5 in", "Everyday wear", "Symbol of forever", "Gift wrap included"],
    rating: 4.6,
    reviews: 152,
    tags: ["rose gold bracelet", "infinity", "everyday", "gift"],
    inStock: true,
    viewer: { metal: ROSE, gem: null },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function productsInCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function relatedProducts(product: Product, count = 4) {
  const same = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const others = products.filter((p) => p.category !== product.category);
  return [...same, ...others].slice(0, count);
}

export const faqs = [
  {
    q: "Is your gold hallmarked and are your diamonds certified?",
    a: "Yes. Every gold piece carries a BIS hallmark with HUID, and every diamond above 0.30 ct ships with an IGI or GIA certificate you can verify online.",
  },
  {
    q: "How do I order on WhatsApp?",
    a: "Add pieces to your bag and tap “Order on WhatsApp”. Your order summary opens in WhatsApp, pre-filled — our concierge confirms size, payment and delivery within minutes during store hours.",
  },
  {
    q: "Do you offer free shipping and returns?",
    a: "All orders ship free with full insurance across India in 3–7 working days. Unworn pieces can be returned within 15 days for a full refund.",
  },
  {
    q: "What is your exchange and buy-back policy?",
    a: "We offer lifetime exchange at 100% of the prevailing gold value and buy-back at 90%, with diamonds valued at the invoice rate.",
  },
  {
    q: "Can I customise a design or get a ring resized?",
    a: "Absolutely. Share a reference image on WhatsApp for bespoke designs (usually 2–3 weeks). Ring resizing is free within 60 days of purchase.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "UPI, all major cards, net banking, EMI on cards above ₹25,000, bank transfer, and cash on delivery for orders up to ₹50,000.",
  },
];

export const testimonials = [
  { name: "Priya S.", city: "Bengaluru", text: "I ordered my engagement ring entirely over WhatsApp. The video call to see the diamond sealed it — absolutely flawless.", rating: 5 },
  { name: "Rahul M.", city: "Delhi", text: "Bought the tennis bracelet for our anniversary. Certificate, insured delivery, beautiful packaging. Five stars.", rating: 5 },
  { name: "Ananya K.", city: "Mumbai", text: "My bridal polki set was even more stunning in person. The styling advice from their concierge was a lovely touch.", rating: 5 },
];
