import Hero from "../components/Hero";
import Destination from "../components/Destination";
import Moments from "../components/Moments";
import Invitation from "../components/Invitation";
import Postcards from "../components/Postcards";
import Showcase from "../components/Showcase";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-dvh bg-cream">
      <Hero />
      <Destination />
      <Moments />
      <Invitation />
      <Postcards />
      <Showcase />
      <Footer />
    </main>
  );
}
