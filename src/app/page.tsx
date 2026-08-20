import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SceneManager from "@/components/SceneManager";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const requestHeaders = await headers();
  const hostname = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();

  if (hostname === "admin.bobowlingom.com") {
    redirect("/admin/reservations");
  }

  return (
    <>
      <Navbar />

      <main className="bg-black">
        <section className="relative grid">
          <div className="sticky top-0 z-20 col-start-1 row-start-1 h-screen self-start">
            <Hero />
          </div>

          <div className="relative col-start-1 row-start-1">
            <SceneManager />
          </div>
        </section>

        <Gallery />
        <Contact />
      </main>
    </>
  );
}
