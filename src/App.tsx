import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Packages from "./pages/Packages";
import { useRoute } from "./router";

export default function App() {
  const route = useRoute();

  // Trailing slashes and case shouldn't decide whether a page exists.
  const path = route.replace(/\/+$/, "").toLowerCase() || "/";

  if (path === "/contact") return <Contact />;
  if (path === "/packages") return <Packages />;
  return <Home />;
}
