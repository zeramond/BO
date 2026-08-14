import Scene from "@/components/Scene";

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
      <a
        href="https://coffee-client-production.up.railway.app/moment"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 inline-flex rounded-full bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105"
      >
        View Café
      </a>
    </Scene>
  );
}
