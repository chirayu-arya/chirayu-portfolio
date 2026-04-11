import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Photography from "./components/Photography";
import About from "./components/About";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Work />
      <Photography />
      <About />
      <Contact />
    </main>
  );
}
