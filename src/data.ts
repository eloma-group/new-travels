// Premium travel photography (Unsplash - free, hotlinked at production sizes).
const u = (id: string, w: number, q = 78) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const brand = "Aurea";

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Packages", href: "#packages" },
  { label: "Gallery", href: "#gallery" },
  { label: "Journeys", href: "#journeys" },
  { label: "Contact", href: "/contact" },
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

// "Pure Adventure" gallery- 6 staggered slots whose images auto-rotate.
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

// "Amazing Destination" showcase - a 3D-tilt hero band with floating cards.
export const destination = {
  eyebrow: "Amazing",
  title: "Destination",
  copy: "Wander further than the map lets you dream. Hand-crafted journeys, local guides who feel like friends and moments that stay with you long after you're home.",
  // Two travellers on an adventure together - mirrors the reference frame.
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

// "The Wander Index" - centered editorial band: three arched portals into real
// places, each with a short signature line, threaded by a flight route.
export const wander = {
  script: "hand-picked",
  eyebrow: "Curated escapes",
  // editorial headline - middle word carries the brown gradient accent
  heading: ["Places that", "rearrange", "you, a little."],
  copy: "No rushed checklists. A short list of destinations we keep returning to - with local guides who feel like old friends and rooms that earn the journey there.",
  plates: [
    {
      key: "jaipur",
      name: "Jaipur",
      region: "India",
      tag: "Pink City",
      img: u("photo-1477587458883-47145ed94245", 640, 78),
    },
    {
      key: "kerala",
      name: "Kerala",
      region: "India",
      tag: "Backwaters",
      img: u("photo-1602216056096-3b40cc0c9944", 760, 80),
    },
    {
      key: "agra",
      name: "Agra",
      region: "India",
      tag: "Taj at dawn",
      img: u("photo-1548013146-72479768bada", 980, 82),
    },
    {
      key: "sydney",
      name: "Sydney",
      region: "Australia",
      tag: "Harbour city",
      img: u("photo-1540202404-a2f29016b523", 760, 80),
    },
    {
      key: "gold-coast",
      name: "Gold Coast",
      region: "Australia",
      tag: "Surf coast",
      img: u("photo-1506372023823-741c83b836fe", 640, 78),
    },
  ],
  stats: [
    { value: 4.9, decimals: 1, suffix: "", label: "Guest rating" },
    { value: 120, decimals: 0, suffix: "+", label: "Destinations" },
    { value: 18, decimals: 0, suffix: "k", label: "Travellers" },
  ],
} as const;

// Bottom "app showcase" - a 3D phone mockup standing on a ledge against a
// rugged Australian coastline scene.
export const showcase = {
  bg: u("photo-1624138784614-87fd1b6528f8", 2200, 80), // Sydney Opera House & Harbour Bridge
  appPhoto: u("photo-1598324789736-4861f89564a0", 800, 82), // Taj Mahal, Agra (in-app)
  // section header
  eyebrow: "The EG Travel app",
  heading: "Your whole India & Australia trip, handled from your pocket.",
  headingAccent: "India & Australia",
  sub: "Visas, itineraries and local guides - sorted before you land and tracked from one calm, simple app.",
  // phone-screen mock
  brand: "EG TRAVEL",
  appHeadline: "Visas for India & Australia, made simple",
  appSub: "Complete visa support- 100% remote",
  cta: "Get visa assistance",
  priceNote: "From",
  price: "$135",
  priceUnit: "/ person",
  discount: "Discounts for groups of 2+",
  ticker: ["Jaipur", "Agra", "Sydney", "Goa", "Uluru", "Kerala"],
} as const;

// "Postcards" - a scattered print-wall collage: polaroids, a clipping, a
// boarding pass and a stamp pinned around a centred editorial core.
export const postcards = {
  chip: "Field notes",
  script: "postcards from",
  heading: ["the long", "way round"],
  copy: "Frames our travellers brought home - a palace gate at first light, a backwater at dusk, the reef from the edge of the boat. No stock, no filters. Just the long way round.",
  cta: "Open the journal",
  meta: "42 stories · new one most weeks",
  watermark: "wander",

  jaipur: {
    img: u("photo-1477587458883-47145ed94245", 700, 78),
    alt: "The pink façade of Hawa Mahal in Jaipur",
    name: "Jaipur",
    line: "The gatekeeper who opens Amber at dawn",
    tag: "Travel guides",
  },
  kerala: {
    img: u("photo-1602216056096-3b40cc0c9944", 700, 78),
    alt: "A houseboat drifting through Kerala's palm-lined backwaters",
    name: "Kerala",
    line: "How to spend a week on the backwaters",
    tag: "Slow travel",
  },
  traveller: {
    img: u("photo-1544005313-94ddf0286df2", 620, 76),
    alt: "A traveller on the road at golden hour",
  },
  street: {
    img: u("photo-1512343879784-a960bf40e7f2", 420, 74),
    alt: "Palm-lined sands of a Goa beach",
  },
  stamp: {
    img: u("photo-1529108190281-9a4f620bc2d8", 520, 76),
    alt: "Uluru glowing red at sunset",
    place: "Uluru",
    coord: "25.3°S · 131.0°E",
    note: "Entered NT · 2026",
  },
  reel: {
    img: u("photo-1506973035872-a4ec16b8e8d9", 1000, 80),
    alt: "Sydney Opera House on the harbour",
    place: "Sydney Harbour, NSW",
    length: "2 min film",
  },
  pass: {
    from: "MEL",
    to: "DEL",
    route: "Melbourne → New Delhi",
    seat: "12A",
    gate: "07",
    board: "21:40",
  },
  stat: { value: "12k", label: "travellers joined last season" },
} as const;

// ============================================================
// Footer - company details, link columns, hubs and socials.
// NOTE: `abn` and the social profile URLs are placeholders - drop the real
// EG Travel values in here and the footer picks them up (an empty `abn`
// simply hides its chip).
// ============================================================
const ADDRESS = "71 Gipps Street, Collingwood, Melbourne, VIC 3066, Australia";
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { heading: string; links: FooterLink[] };

export const footer = {
  tagline:
    "Hand-crafted journeys through India and Australia - visas, itineraries and local guides, handled end to end.",

  // CTA band
  script: "wherever next",
  ctaHeading: ["Tell us where you", "want to wake up."],
  ctaCopy:
    "One note from you and a real person - not a form - plans the rest. Join the list for quiet drops of new routes and seasonal windows.",
  ctaPlaceholder: "you@example.com",
  ctaNote: "No spam. Two or three notes a year, only when something is worth the trip.",

  phone: { label: "1800 054 555", href: "tel:1800054555" },
  email: { label: "connect@egtravel.com.au", href: "mailto:connect@egtravel.com.au" },
  address: {
    lines: ["71 Gipps Street, Collingwood,", "Melbourne, VIC 3066, Australia"],
    maps: MAPS,
  },
  abn: "", // e.g. "12 693 138 733"
  company: "EG Travel Australia Pty Ltd",
  companyUnit: "(Unit of Eloma Group)",

  // Live local time at either end of the route we fly most.
  hubs: [
    { city: "Melbourne", region: "Australia", tz: "Australia/Melbourne" },
    { city: "New Delhi", region: "India", tz: "Asia/Kolkata" },
  ],

  columns: [
    {
      heading: "Businesses",
      links: [
        { label: "Bivry", href: "https://bivry.com.au", external: true },
        { label: "EG Digital", href: "https://egdigital.com.au", external: true },
        { label: "Eloma Group", href: "https://elomagroup.com.au", external: true },
        { label: "Contact us", href: "/contact" },
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
        { label: "Contact", href: "/contact" },
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
  ] as FooterColumn[],

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
  build("photo-1587135941948-670b381f08ce", {
    eyebrow: "A Monument to Love",
    title: "Golden Hour at the Taj Mahal",
    card: "Taj Mahal",
    place: "Agra, India",
    copy: "White marble turning amber at sunrise, with private early access before the crowds arrive.",
  }),
];

// ---------------------------------------------------------------------------
// "The invitation" - oversized wordmark with a landscape showing through the
// letters and a cut-out traveller standing in front of it.
// ---------------------------------------------------------------------------
export const invite = {
  script: "the invitation",
  eyebrow: "Est. 2011 · 40+ countries",
  words: ["EG", "Travel"],
  tagline: "Travel & Adventure",
  copy: "Every journey we design begins the same way - someone standing at the edge of an ordinary week, deciding to go.",
  cta: "Start your journey",
  // the two plates that flank the wordmark
  plates: [
    {
      key: "udaipur",
      img: u("photo-1695956353120-54ce5e91632b", 620, 82),
      name: "Udaipur",
      tag: "Lake palaces",
    },
    {
      key: "uluru",
      img: u("photo-1774257784483-f3fc96d42730", 620, 82),
      name: "Uluru",
      tag: "Red centre",
    },
  ],
  // the route book that closes the section
  indexTitle: "The route book",
  index: [
    { n: "01", name: "Udaipur", coord: "24.5°N · 73.6°E", note: "Lake palaces" },
    { n: "02", name: "Ladakh", coord: "34.1°N · 77.5°E", note: "High passes" },
    { n: "03", name: "Uluru", coord: "25.3°S · 131.0°E", note: "Red centre" },
    { n: "04", name: "Kyoto", coord: "35.0°N · 135.7°E", note: "Old lanes" },
  ],
  // warm ridgeline that reads well inside the letterforms
  fill: u("photo-1520968869663-678928035aa1", 2200, 84),
  traveller: "/images/traveller.png",
};

// ============================================================
// Contact page - "the desk". The copy is written as
// correspondence on purpose: the enquiry is a sentence you
// finish rather than a form you fill.
// NOTE: the FAQ answers and the office hours below are drafts -
// confirm them with the travel desk before this goes live.
// ============================================================
/* Offices we only hold a written address for open through a Maps search. */
const gmaps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const contactPage = {
  eyebrow: "Contact",
  script: "one note, that's all",
  heading: ["Start with", "a sentence."],
  copy: "No booking engine, no queue number. Finish the note below and it lands with a planner who has actually walked the route.",

  // ---- the full-bleed mosaic that sits under the masthead ----
  // Six tiles laid edge to edge. Nothing slides: each tile turns over in its
  // own place, so the band keeps changing without the page ever moving.
  // `size` maps to a grid span in Contact.tsx; `axis` picks the turn axis.
  mosaic: [
    {
      key: "rajasthan",
      size: "sm",
      axis: "y",
      faces: [
        {
          img: u("photo-1599661046289-e31897846e41", 900, 78),
          title: "Pink City",
          kicker: "Explore the beauty",
          alt: "The pink facade of Hawa Mahal in Jaipur",
        },
        {
          img: u("photo-1587135941948-670b381f08ce", 900, 78),
          title: "Taj Mahal",
          kicker: "Just beautiful",
          alt: "The Taj Mahal at golden hour",
        },
      ],
    },
    {
      key: "kerala",
      size: "sm",
      axis: "x",
      faces: [
        {
          img: u("photo-1609920658906-8223bd289001", 900, 78),
          title: "Kerala Backwaters",
          kicker: "Go slowly",
          alt: "A houseboat drifting through Kerala's backwaters",
        },
        {
          img: u("photo-1512343879784-a960bf40e7f2", 900, 78),
          title: "Goa Sands",
          kicker: "Explore the beauty",
          alt: "Palm-lined sands of a Goa beach",
        },
      ],
    },
    {
      key: "ladakh",
      size: "tall",
      axis: "y",
      faces: [
        {
          img: u("photo-1626621341517-bbf3d9990a23", 1100, 80),
          title: "Ladakh",
          kicker: "High and quiet",
          alt: "Monasteries above the high desert of Ladakh",
        },
        {
          img: u("photo-1552465011-b4e21bf6e79a", 1100, 80),
          title: "Blue Mountains",
          kicker: "Just beautiful",
          alt: "Eucalyptus valleys of the Blue Mountains",
        },
      ],
    },
    {
      key: "sydney",
      size: "sm",
      axis: "x",
      faces: [
        {
          img: u("photo-1506973035872-a4ec16b8e8d9", 900, 78),
          title: "Sydney",
          kicker: "Just beautiful",
          alt: "Sydney Opera House by the harbour",
        },
        {
          img: u("photo-1523482580672-f109ba8cb9be", 900, 78),
          title: "Harbour at Dusk",
          kicker: "Stay out late",
          alt: "Sydney Harbour Bridge at dusk",
        },
      ],
    },
    {
      key: "whitsundays",
      size: "sm",
      axis: "y",
      faces: [
        {
          img: u("photo-1523731407965-2430cd12f5e4", 900, 78),
          title: "Whitehaven",
          kicker: "Explore the beauty",
          alt: "White sand swirls of Whitehaven Beach",
        },
        {
          img: u("photo-1582672060674-bc2bd808a8b5", 900, 78),
          title: "The Great Reef",
          kicker: "Look under",
          alt: "Turquoise coral of the Great Barrier Reef",
        },
      ],
    },
    {
      key: "red-centre",
      size: "wide",
      axis: "x",
      faces: [
        {
          img: u("photo-1529108190281-9a4f620bc2d8", 1800, 80),
          title: "Uluru",
          kicker: "Just beautiful",
          alt: "Uluru glowing red at sunset",
        },
        {
          img: u("photo-1494233892892-84542a694e72", 1800, 80),
          title: "The Coast Road",
          kicker: "Take the long way",
          alt: "The Sea Cliff Bridge along the New South Wales coast",
        },
        {
          img: u("photo-1514395462725-fb4566210144", 1800, 80),
          title: "Melbourne",
          kicker: "Where we sit",
          alt: "Melbourne's skyline along the river",
        },
      ],
    },
  ],

  // The hero shows what an answer looks like instead of promising one.
  exchange: [
    {
      who: "The traveller",
      line: "Somewhere green. Two weeks in March. We don't want to be rushed.",
    },
    {
      who: brand,
      line: "Kerala, then - the second week, before the heat comes up. We know a boat, and the man who cooks on it.",
    },
  ],
  exchangeNote: "How the first note back usually reads",

  // ---- every desk we keep ----
  // `lat`/`lon` come straight off each Maps pin; they only drive the distance
  // and bearing readout on the chart, so building-level accuracy is plenty.
  // Ordered west to east by clock inside each group, so the two lists read the
  // way the working day actually travels around them.
  // `opens`/`closes` are local 24h and drive both the live open/closed state
  // and the day rule drawn under each office.
  // NOTE: 9-18 local is assumed everywhere except Melbourne and Gurugram -
  // confirm the real hours with each desk before this goes live.
  offices: [
    // --- Australia ---
    {
      key: "perth",
      lat: -31.9515,
      lon: 115.8573,
      city: "Perth",
      region: "Western Australia",
      group: "Australia",
      tz: "Australia/Perth",
      opens: 9,
      closes: 18,
      lines: ["The Wentworth Building, Level 2", "300 Murray St, Perth WA 6000"],
      maps: "https://maps.app.goo.gl/4GbRF1oKBHYGiNbc7",
    },
    {
      key: "adelaide",
      lat: -34.9423,
      lon: 138.5837,
      city: "Adelaide",
      region: "South Australia",
      group: "Australia",
      tz: "Australia/Adelaide",
      opens: 9,
      closes: 18,
      lines: ["2 Greenhill Road", "Wayville SA 5034"],
      maps: "https://maps.app.goo.gl/HnuDAVg7dYgJk1dF6",
    },
    {
      key: "brisbane",
      lat: -27.4683,
      lon: 153.0303,
      city: "Brisbane",
      region: "Queensland",
      group: "Australia",
      tz: "Australia/Brisbane",
      opens: 9,
      closes: 18,
      lines: ["71 Eagle Street", "Brisbane City QLD 4000"],
      maps: "https://maps.app.goo.gl/KZ8b3NLKEt2yr6W78",
    },
    {
      key: "melbourne",
      lat: -37.8049,
      lon: 144.9899,
      city: "Melbourne",
      region: "Victoria",
      group: "Australia",
      tz: "Australia/Melbourne",
      opens: 9,
      closes: 18,
      tag: "Head office",
      lines: ["71 Gipps Street, Collingwood", "Melbourne VIC 3066"],
      maps: "https://maps.app.goo.gl/Yxa7MEn8AzoconF86",
    },
    {
      key: "sydney",
      lat: -33.8676,
      lon: 151.2118,
      city: "Sydney",
      region: "New South Wales",
      group: "Australia",
      tz: "Australia/Sydney",
      opens: 9,
      closes: 18,
      lines: ["60 Martin Place", "Sydney NSW 2000"],
      maps: "https://maps.app.goo.gl/ZyWuqs54hJxdBdAs7",
    },

    // --- everywhere else ---
    {
      key: "toronto",
      lat: 43.6487,
      lon: -79.3817,
      city: "Toronto",
      region: "Canada",
      group: "International",
      tz: "America/Toronto",
      opens: 9,
      closes: 18,
      lines: ["First Canadian Place", "100 King St W #5600, Toronto ON M5X 1C9"],
      maps: gmaps("First Canadian Place, 100 King St W #5600, Toronto, ON M5X 1C9, Canada"),
    },
    {
      key: "washington",
      lat: 38.8972,
      lon: -77.01,
      city: "Washington",
      region: "United States",
      group: "International",
      tz: "America/New_York",
      opens: 9,
      closes: 18,
      lines: ["20 F Street NW", "Washington, DC 20001"],
      maps: "https://maps.app.goo.gl/emZJUVKQH3966yJHA",
    },
    {
      key: "london",
      lat: 51.5144,
      lon: -0.1049,
      city: "London",
      region: "United Kingdom",
      group: "International",
      tz: "Europe/London",
      opens: 9,
      closes: 18,
      lines: ["107-111 Fleet Street", "London EC4A 2AB"],
      maps: "https://maps.app.goo.gl/FWNZRfZQjN9twUBKA",
    },
    {
      key: "dubai",
      lat: 25.2001,
      lon: 55.2752,
      city: "Dubai",
      region: "United Arab Emirates",
      group: "International",
      tz: "Asia/Dubai",
      opens: 9,
      closes: 18,
      lines: ["Boulevard Plaza Tower 1, Level 9", "Downtown Dubai"],
      maps: "https://maps.app.goo.gl/HDmawG4aAxADydT36",
    },
    {
      key: "gurugram",
      lat: 28.4211,
      lon: 77.0469,
      city: "Gurugram",
      region: "India",
      group: "International",
      tz: "Asia/Kolkata",
      opens: 10,
      closes: 19,
      lines: ["Tower A, Spaze iTech Park, 5th Floor", "Sohna - Gurgaon Rd, Gurugram 122018"],
      maps: gmaps("Tower A, Spaze iTech Park, 5th Floor, Sohna - Gurgaon Rd, Gurugram 122018"),
    },
    {
      key: "singapore",
      lat: 1.2846,
      lon: 103.851,
      city: "Singapore",
      region: "Singapore",
      group: "International",
      tz: "Asia/Singapore",
      opens: 9,
      closes: 18,
      lines: ["One Raffles Place Tower 2, #19-20", "1 Raffles Place, Singapore 048616"],
      maps: gmaps("1 Raffles Pl, #19-20 One Raffles Place Tower 2, Singapore 048616"),
    },
    {
      key: "hong-kong",
      lat: 22.28,
      lon: 114.1737,
      city: "Hong Kong",
      region: "Hong Kong SAR",
      group: "International",
      tz: "Asia/Hong_Kong",
      opens: 9,
      closes: 18,
      lines: ["18 Harbour Road, 35/F", "Wan Chai, Hong Kong Island"],
      maps: "https://maps.app.goo.gl/cWmxdmQ6oHkgL9td8",
    },
  ],

  steps: [
    {
      n: "01",
      title: "A planner reads it",
      body: "Not a bot and not a queue. The note goes to whoever knows that route best.",
    },
    {
      n: "02",
      title: "You hear back",
      body: "A call or a written reply with real dates, honest options and what each one costs.",
    },
    {
      n: "03",
      title: "We hold the pieces",
      body: "Flights, rooms, guides and visas are lined up before you pay for any of it.",
    },
  ],

  faq: [
    {
      q: "How quickly will someone reply?",
      a: "Same working day for notes that arrive before 4pm in Melbourne. Anything later is answered the next morning.",
    },
    {
      q: "Do you charge to plan a trip?",
      a: "No. Route options, itineraries and quotes cost nothing. You pay once you accept an itinerary, not before.",
    },
    {
      q: "Can you handle visas?",
      a: "Yes. Visa assistance starts at $135 per person, with discounts for groups of two or more.",
    },
    {
      q: "Do you book flights on their own?",
      a: "We do. Flights, airport transfers and travel insurance can all be booked without a full itinerary.",
    },
  ],

  travellers: ["just me", "two of us", "a family", "a small group"],
  nights: ["4-6", "7-10", "11-14", "two weeks +"],
} as const;
