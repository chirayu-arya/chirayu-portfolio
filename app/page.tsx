import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Featured from "./components/Featured";
import Work from "./components/Work";
import Photography from "./components/Photography";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Featured />
      <Work />
      <Photography />
      <Contact />
    </main>
  );
}
