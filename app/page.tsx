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
      <Hero />
      {/* Hero is scoped + crimson; everything below gets crimson + vibrant purple */}
      <PageBlobs palette="crimson-purple" startTop="100vh" />
      <About />
      <Featured />
      <Work />
      <Photography />
      <Contact />
    </main>
  );
}
