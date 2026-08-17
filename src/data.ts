// Premium travel photography (Unsplash — free, hotlinked at production sizes).
const u = (id: string, w: number, q = 78) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const brand = "Aurea";

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Journeys", href: "#journeys" },
  { label: "Contact", href: "#contact" },
] as const;

// Avatars for the "people joined" cluster.
export const avatars = [
  u("photo-1500648767791-00dcc994a43e", 96, 60),
  u("photo-1494790108377-be9c29b29330", 96, 60),
  u("photo-1507003211169-0a1dd7228f2d", 96, 60),
  u("photo-1438761681033-6461ffad8d80", 96, 60),
] as const;

// Five distinct tourist experiences. Clicking a card swaps the hero.
export type Experience = {
  key: string;
  hero: string;
  thumb: string;
  eyebrow: string;
  title: string;
  card: string;
  place: string;
  copy: string;
};

const build = (id: string, rest: Omit<Experience, "hero" | "thumb" | "key">): Experience => ({
  key: rest.card.toLowerCase().replace(/\s+/g, "-"),
  hero: u(id, 2000),
  thumb: u(id, 600),
  ...rest,
});

// "Pure Adventure" gallery — 6 staggered slots whose images auto-rotate.
const p = (id: string) => u(id, 640, 72);

export type Slot = { h: "sm" | "md" | "lg"; offset: number; featured: boolean };

export const momentLayout: Slot[] = [
  { h: "lg", offset: 44, featured: false },
  { h: "md", offset: 0, featured: false },
  { h: "lg", offset: 52, featured: false },
  { h: "md", offset: 8, featured: true },
  { h: "lg", offset: 40, featured: false },
  { h: "md", offset: 4, featured: false },
];

export type MomentSet = {
  images: string[];
  alts: string[];
  caption: { title: string; copy: string };
};

export const momentSets: MomentSet[] = [
  {
    images: [
      p("photo-1564507592333-c60657eea523"),
      p("photo-1599661046289-e31897846e41"),
      p("photo-1614082242765-7c98ca0f3df3"),
      p("photo-1477586957327-847a0f3f4fe3"),
      p("photo-1615836245337-f5b9b2303f10"),
      p("photo-1567157577867-05ccb1388e66"),
    ],
    alts: [
      "The Taj Mahal glowing at sunrise",
      "The pink façade of Hawa Mahal in Jaipur",
      "Ornate courtyard of a Rajasthan city palace",
      "Jal Mahal, the water palace of Jaipur",
      "Udaipur's City Palace on Lake Pichola",
      "A colourful street in old India",
    ],
    caption: {
      title: "Palaces of Rajasthan",
      copy: "Wander marble mausoleums, pink-city bazaars and desert forts.",
    },
  },
  {
    images: [
      p("photo-1506973035872-a4ec16b8e8d9"),
      p("photo-1523482580672-f109ba8cb9be"),
      p("photo-1582672060674-bc2bd808a8b5"),
      p("photo-1523731407965-2430cd12f5e4"),
      p("photo-1494233892892-84542a694e72"),
      p("photo-1552465011-b4e21bf6e79a"),
    ],
    alts: [
      "Sydney Opera House by the harbour",
      "Sydney Harbour Bridge at dusk",
      "Turquoise coral of the Great Barrier Reef",
      "White sand swirls of Whitehaven Beach",
      "The Sea Cliff Bridge along the New South Wales coast",
      "Eucalyptus valleys of the Blue Mountains",
    ],
    caption: {
      title: "Australian Shores",
      copy: "From reef-fringed islands to the harbour city and wild coast.",
    },
  },
  {
    images: [
      p("photo-1588083949404-c4f1ed1323b3"),
      p("photo-1609920658906-8223bd289001"),
      p("photo-1626621341517-bbf3d9990a23"),
      p("photo-1529108190281-9a4f620bc2d8"),
      p("photo-1514395462725-fb4566210144"),
      p("photo-1512343879784-a960bf40e7f2"),
    ],
    alts: [
      "The Golden Temple mirrored in its sacred pool",
      "A houseboat drifting through Kerala's backwaters",
      "Monasteries above the high desert of Ladakh",
      "Uluru glowing red at sunset",
      "Melbourne's skyline along the river",
      "Palm-lined sands of a Goa beach",
    ],
    caption: {
      title: "Sacred Trails & Red Earth",
      copy: "Golden temples, palm-fringed backwaters and the outback's red heart.",
    },
  },
];

// "Amazing Destination" showcase — a 3D-tilt hero band with floating cards.
export const destination = {
  eyebrow: "Amazing",
  title: "Destination",
  copy: "Wander further than the map lets you dream. Hand-crafted journeys, local guides who feel like friends and moments that stay with you long after you're home.",
  // Two travellers on an adventure together — mirrors the reference frame.
  hero: u("photo-1539635278303-d4002c07eae3", 1100, 82),
  // Floating 3D card imagery.
  cards: [
    u("photo-1506905925346-21bda4d32df4", 480, 74),
    u("photo-1476514525535-07fb3b4ae5f1", 480, 74),
  ],
  // Guest avatars for the little "loved by" chip.
  faces: [
    u("photo-1500648767791-00dcc994a43e", 96, 60),
    u("photo-1544005313-94ddf0286df2", 96, 60),
    u("photo-1507003211169-0a1dd7228f2d", 96, 60),
  ],
  stats: [
    { value: "4.9", label: "Guest rating" },
    { value: "120+", label: "Destinations" },
    { value: "18k", label: "Happy travellers" },
  ],
} as const;

// "The Wander Index" — centered editorial band: three arched portals into real
// places, each tagged with true coordinates, threaded by a flight route.
export const wander = {
  script: "hand-picked",
  eyebrow: "Curated escapes",
  // editorial headline — middle word carries the brown gradient accent
  heading: ["Places that", "rearrange", "you, a little."],
  copy: "No rushed checklists. A short list of destinations we keep returning to — with local guides who feel like old friends and rooms that earn the journey there.",
  plates: [
    {
      key: "jaipur",
      name: "Jaipur",
      region: "India",
      coord: "26.9°N · 75.8°E",
      img: u("photo-1477587458883-47145ed94245", 640, 78),
    },
    {
      key: "kerala",
      name: "Kerala",
      region: "India",
      coord: "9.5°N · 76.3°E",
      img: u("photo-1602216056096-3b40cc0c9944", 760, 80),
    },
    {
      key: "agra",
      name: "Agra",
      region: "India",
      coord: "27.2°N · 78.0°E",
      img: u("photo-1548013146-72479768bada", 980, 82),
    },
    {
      key: "sydney",
      name: "Sydney",
      region: "Australia",
      coord: "33.9°S · 151.2°E",
      img: u("photo-1540202404-a2f29016b523", 760, 80),
    },
    {
      key: "gold-coast",
      name: "Gold Coast",
      region: "Australia",
      coord: "28.0°S · 153.4°E",
      img: u("photo-1506372023823-741c83b836fe", 640, 78),
    },
  ],
  stats: [
    { value: 4.9, decimals: 1, suffix: "", label: "Guest rating" },
    { value: 120, decimals: 0, suffix: "+", label: "Destinations" },
    { value: 18, decimals: 0, suffix: "k", label: "Travellers" },
  ],
} as const;

// Bottom "app showcase" — a 3D phone mockup standing on a ledge against a
// rugged Australian coastline scene.
export const showcase = {
  bg: u("photo-1624138784614-87fd1b6528f8", 2200, 80), // Sydney Opera House & Harbour Bridge
  appPhoto: u("photo-1598324789736-4861f89564a0", 800, 82), // Taj Mahal, Agra (in-app)
  // section header
  eyebrow: "The EG Travel app",
  heading: "Your whole India & Australia trip, handled from your pocket.",
  headingAccent: "India & Australia",
  sub: "Visas, itineraries and local guides — sorted before you land and tracked from one calm, simple app.",
  // phone-screen mock
  brand: "EG TRAVEL",
  appHeadline: "Visas for India & Australia, made simple",
  appSub: "Complete visa support — 100% remote",
  cta: "Get visa assistance",
  priceNote: "From",
  price: "$135",
  priceUnit: "/ person",
  discount: "Discounts for groups of 2+",
  ticker: ["Jaipur", "Agra", "Sydney", "Goa", "Uluru", "Kerala"],
} as const;

// ============================================================
// Footer — company details, link columns, hubs and socials.
// NOTE: `abn` and the social profile URLs are placeholders — drop the real
// EG Travel values in here and the footer picks them up (an empty `abn`
// simply hides its chip).
// ============================================================
const ADDRESS = "71 Gipps Street, Collingwood, Melbourne, VIC 3066, Australia";

export const footer = {
  tagline:
    "Hand-crafted journeys through India and Australia — visas, itineraries and local guides, handled end to end.",

  // CTA band
  script: "wherever next",
  ctaHeading: ["Tell us where you", "want to wake up."],
  ctaCopy:
    "One note from you and a real person — not a form — plans the rest. Join the list for quiet drops of new routes and seasonal windows.",
  ctaPlaceholder: "you@example.com",
  ctaNote: "No spam. Two or three notes a year, only when something is worth the trip.",

  phone: { label: "1800 054 555", href: "tel:1800054555" },
  email: { label: "connect@egtravel.com.au", href: "mailto:connect@egtravel.com.au" },
  address: {
    lines: ["71 Gipps Street, Collingwood,", "Melbourne, VIC 3066, Australia"],
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
  },
  abn: "", // e.g. "12 693 138 733"
  company: "EG Travel Australia Pty Ltd (Unit of Eloma Group)",

  // Live local time at either end of the route we fly most.
  hubs: [
    { city: "Melbourne", region: "Australia", tz: "Australia/Melbourne" },
    { city: "New Delhi", region: "India", tz: "Asia/Kolkata" },
  ],

  columns: [
    {
      heading: "Destinations",
      links: [
        { label: "Jaipur", href: "#journeys" },
        { label: "Kerala", href: "#journeys" },
        { label: "Agra", href: "#journeys" },
        { label: "Sydney", href: "#journeys" },
        { label: "Gold Coast", href: "#journeys" },
        { label: "All destinations", href: "#journeys" },
      ],
    },
    {
      heading: "Journeys",
      links: [
        { label: "Visa assistance", href: "#app" },
        { label: "Flight bookings", href: "#packages" },
        { label: "Custom itineraries", href: "#packages" },
        { label: "Group departures", href: "#packages" },
        { label: "Airport transfers", href: "#packages" },
        { label: "Travel insurance", href: "#packages" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About us", href: "#" },
        { label: "Our journey", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Media", href: "#" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Help centre", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Manage booking", href: "#" },
        { label: "Travel advisories", href: "#" },
        { label: "Booking conditions", href: "#" },
        { label: "Cancellation policy", href: "#" },
      ],
    },
  ],

  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Booking Conditions", href: "#" },
  ],
} as const;

export const experiences: Experience[] = [
  build("photo-1518548419970-58e3b4079ab2", {
    eyebrow: "Island of the Gods",
    title: "Sacred Temples of Ancient Bali",
    card: "Bali Temples",
    place: "Bali, Indonesia",
    copy: "Clifftop shrines, golden-hour rituals and warm island air with guides who know Bali by heart.",
  }),
  build("photo-1570077188670-e3a8d69ac5ff", {
    eyebrow: "The Aegean Blue",
    title: "Cliffside Sunsets over Santorini",
    card: "Santorini",
    place: "Santorini, Greece",
    copy: "Whitewashed lanes, caldera views and slow sunsets sinking into a deep blue sea.",
  }),
  build("photo-1573843981267-be1999ff37cd", {
    eyebrow: "Barefoot Luxury",
    title: "An Overwater Escape in the Maldives",
    card: "Maldives",
    place: "North Malé Atoll",
    copy: "Private overwater villas above impossibly clear lagoons and living coral gardens.",
  }),
  build("photo-1493976040374-85c8e12f0c0e", {
    eyebrow: "Old Japan",
    title: "The Timeless Streets of Kyoto",
    card: "Kyoto",
    place: "Kyoto, Japan",
    copy: "Lantern-lit alleys, ancient pagodas and quiet temple gardens glowing at dusk.",
  }),
  build("photo-1509316785289-025f5b846b35", {
    eyebrow: "The Red Earth",
    title: "Canyons of the Wild Desert",
    card: "Red Desert",
    place: "Arizona, USA",
    copy: "Towering mesas, endless horizons and campfire skies across the open desert.",
  }),
];
