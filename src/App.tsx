import Home from "./pages/Home";
import Contact from "./pages/Contact";
import { useRoute } from "./router";

export default function App() {
  const route = useRoute();

  // Trailing slashes and case shouldn't decide whether a page exists.
  const path = route.replace(/\/+$/, "").toLowerCase() || "/";

  return path === "/contact" ? <Contact /> : <Home />;
}
