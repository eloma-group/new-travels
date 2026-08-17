import Hero from "./components/Hero";
import Destination from "./components/Destination";
import Moments from "./components/Moments";
// import Postcards from "./components/Postcards";
import Showcase from "./components/Showcase";
import Footer from "./components/Footer";

export default function App() {
  return (
    <main className="min-h-dvh bg-cream">
      <Hero />
      <Destination />
      <Moments />
      {/* <Postcards /> */}
      <Showcase />
      <Footer />
    </main>
  );
}
