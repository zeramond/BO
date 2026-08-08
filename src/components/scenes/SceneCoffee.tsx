import Scene from "@/components/Scene";
import Link from "next/link";

export default function SceneCoffee() {
  return (
    <Scene
      image="/images/coffee2.jpg"
      eyebrow="CAFÉ"
      title={
        <>
          Take A Break.
          <br />
          Stay Awhile.
        </>
      }
      description="Fresh coffee, desserts, and a relaxed atmosphere between games."
    >
      <Link
  href="/cafe"
  className="mt-12 inline-flex rounded-full bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105"
>
  View Café
</Link>
    </Scene>
  );
}