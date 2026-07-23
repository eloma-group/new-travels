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
      p("photo-1551632811-561732d1e306"),
      p("photo-1533587851505-d119e13fa0d7"),
      p("photo-1508672019048-805c876b67e2"),
      p("photo-1539635278303-d4002c07eae3"),
      p("photo-1504280390367-361c6d9f38f4"),
      p("photo-1507608869274-d3177c8bb4c7"),
    ],
    alts: [
      "Two hikers on a trail below snow-capped peaks",
      "Travellers watching sunset over a coastal city",
      "A traveller on a jetty facing still mountain water",
      "Friends laughing together on a mountain hike",
      "A forest campsite seen from inside a tent",
      "Hot-air balloons drifting across a clear sky",
    ],
    caption: {
      title: "Ridgeline Trekking",
      copy: "Summit volcanic ridgelines with expert local guides.",
    },
  },
  {
    images: [
      p("photo-1518548419970-58e3b4079ab2"),
      p("photo-1570077188670-e3a8d69ac5ff"),
      p("photo-1573843981267-be1999ff37cd"),
      p("photo-1493976040374-85c8e12f0c0e"),
      p("photo-1509316785289-025f5b846b35"),
      p("photo-1517824806704-9040b037703b"),
    ],
    alts: [
      "A clifftop temple glowing at sunset",
      "Whitewashed houses above the Aegean sea",
      "Overwater villas on a turquoise lagoon",
      "Lantern-lit streets of an old Japanese town",
      "Red rock mesas across an open desert",
      "A tent beneath the Milky Way at night",
    ],
    caption: {
      title: "Timeless Temple Trails",
      copy: "Wander lantern-lit streets and sacred gardens at dusk.",
    },
  },
  {
    images: [
      p("photo-1506905925346-21bda4d32df4"),
      p("photo-1476514525535-07fb3b4ae5f1"),
      p("photo-1510414842594-a61c69b5ae57"),
      p("photo-1469854523086-cc02fe5d8800"),
      p("photo-1501785888041-af3ef285b470"),
      p("photo-1470071459604-3b5ec3a7fe05"),
    ],
    alts: [
      "Golden sunrise over a sea of clouds",
      "A wooden boat on a still alpine lake",
      "A hidden cove where a waterfall meets the sea",
      "A camper van on an empty desert road",
      "A rowboat on a turquoise mountain lake",
      "Mist drifting through a pine forest",
    ],
    caption: {
      title: "Off-Road Desert Run",
      copy: "Chase the horizon across red earth and open sky.",
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
      key: "kyoto",
      name: "Kyoto",
      region: "Japan",
      coord: "35.0°N · 135.8°E",
      img: u("photo-1493976040374-85c8e12f0c0e", 760, 80),
    },
    {
      key: "santorini",
      name: "Santorini",
      region: "Greece",
      coord: "36.4°N · 25.4°E",
      img: u("photo-1570077188670-e3a8d69ac5ff", 980, 82),
    },
    {
      key: "bali",
      name: "Bali",
      region: "Indonesia",
      coord: "8.4°S · 115.2°E",
      img: u("photo-1518548419970-58e3b4079ab2", 760, 80),
    },
  ],
  stats: [
    { value: 4.9, decimals: 1, suffix: "", label: "Guest rating" },
    { value: 120, decimals: 0, suffix: "+", label: "Destinations" },
    { value: 18, decimals: 0, suffix: "k", label: "Travellers" },
  ],
} as const;

// Bottom "app showcase" — a 3D phone mockup standing on a ledge against a
// misty Japanese pagoda + cherry-blossom scene.
export const showcase = {
  bg: u("photo-1773563163201-9a9a7dfa55d4", 2200, 80), // misty temple wall + plum blossoms
  appPhoto: u("photo-1518548419970-58e3b4079ab2", 800, 82), // sunset temple (in-app)
  // section header
  eyebrow: "The EG Travel app",
  heading: "Your whole Japan trip, handled from your pocket.",
  headingAccent: "Japan",
  sub: "Visas, itineraries and local guides — sorted before you land and tracked from one calm, simple app.",
  // phone-screen mock
  brand: "EG TRAVEL",
  appHeadline: "Visas for Japan, made simple",
  appSub: "Complete visa support — 100% remote",
  cta: "Get visa assistance",
  priceNote: "From",
  price: "$135",
  priceUnit: "/ person",
  discount: "Discounts for groups of 2+",
  ticker: ["Kyoto", "Osaka", "Nara", "Tokyo", "Hakone", "Nikko"],
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
