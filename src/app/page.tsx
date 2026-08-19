import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SceneManager from "@/components/SceneManager";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-black">
        <section className="relative grid">
          <div className="sticky top-0 col-start-1 row-start-1 h-screen self-start">
            <Hero />
          </div>

          <div className="pointer-events-none relative z-10 col-start-1 row-start-1">
            <SceneManager />
          </div>
        </section>

        <Gallery />
        <Contact />
      </main>
    </>
  );
}
