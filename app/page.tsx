import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Featured from "./components/Featured";
import Work from "./components/Work";
import Photography from "./components/Photography";
import Contact from "./components/Contact";
import PageBlobs from "./components/PageBlobs";

export default function Home() {
  return (
    <main className="relative bg-black overflow-x-hidden">
      <Nav />
      {/* Page blobs span the full page height (every 15%); rendered first so DOM order keeps them behind sections */}
      <PageBlobs palette="crimson-purple" startTop="0" />
      <Hero />
      <About />
      <Featured />
      <Work />
      <Photography />
      <Contact />
    </main>
  );
}
