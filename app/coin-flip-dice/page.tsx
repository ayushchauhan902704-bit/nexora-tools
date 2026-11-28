import CoinFlipClient from "./CoinFlipClient";

export const metadata = {
  title:
    "Coin Flip & Dice Roller Online - Free Virtual Coin Toss & Dice | NEXORA",

  description:
    "Free online Coin Flip and Dice Roller. Flip Heads or Tails, roll a virtual dice, play with up to 6 players, and get instant results on mobile or desktop.",

  keywords: [
    "coin flip",
    "coin toss",
    "flip a coin",
    "online coin flip",
    "virtual coin flip",
    "dice roller",
    "online dice roller",
    "virtual dice",
    "roll dice online",
    "free dice roller",
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/coin-flip-dice-roller/",
  },

  openGraph: {
    title:
      "Coin Flip & Dice Roller Online - Free Virtual Coin Toss & Dice",
    description:
      "Flip a virtual coin or roll the dice instantly. Free, fast and mobile-friendly with no registration required.",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Coin Flip & Dice Roller Online - Free Virtual Coin Toss & Dice",
    description:
      "Flip a coin or roll a virtual dice instantly. Free and easy to use.",
  },
};

export default function Page() {
  return <CoinFlipClient />;
}
