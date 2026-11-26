import SpinWheelClient from "./SpinWheelClient";

export const metadata = {
  title: "Spin Wheel - Random Name Picker & Winner Generator | thenexoratools",
  description:
    "Free online Spin Wheel and Random Name Picker. Add names, spin the wheel, pick a random winner, remove winners, share results, and use it for giveaways, classrooms, teams, games and more.",
  keywords: [
    "spin wheel",
    "random name picker",
    "random picker",
    "wheel spinner",
    "spin the wheel",
    "winner picker",
    "random winner generator",
    "giveaway picker",
    "classroom random picker",
    "team picker",
    "name picker",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://thenexoratools.com/spin-wheel",
  },
  openGraph: {
    title: "Spin Wheel - Random Name Picker | thenexoratools",
    description:
      "Spin a free random wheel to pick winners, names, teams, students and more.",
    url: "https://thenexoratools.com/spin-wheel",
    siteName: "thenexoratools",
    type: "website",
  },
};

export default function Page() {
  return <SpinWheelClient />;
}
