/**
 * Central brand tokens. Rename the product here — nowhere else.
 */
export const brand = {
  name: "Piton",
  shortName: "Piton",
  tagline: "Find the right AI. Find the right people. Build the right thing.",
  positioning: "The anchor point between AI decisions and AI implementation.",
  description:
    "Discover AI tools, compare what actually works, and connect with people who can turn it into something useful.",
  colors: {
    ink: "#17181C",
    navy: "#060F20",
    cream: "#FDF9F3",
    teal: "#0A7D79",
    canvas: "#F7F8F6",
  },
  products: {
    atlas: { name: "AI Atlas", href: "/ai/tools", blurb: "Discover AI systems with clarity." },
    arena: { name: "AI Arena", href: "/arena", blurb: "Compare capabilities, not hype." },
    network: { name: "AI Network", href: "/network", blurb: "Builders with proof, not résumés." },
  },
  cta: {
    primary: { label: "Find My AI Stack", href: "/ai/recommend" },
    secondary: { label: "Explore AI", href: "/ai/tools" },
    tertiary: { label: "Join the AI Network", href: "/builders/join" },
  },
} as const;

export type Brand = typeof brand;
