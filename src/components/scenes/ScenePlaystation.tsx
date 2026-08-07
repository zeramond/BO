import Scene from "@/components/Scene";

export default function ScenePlaystation() {
  return (
    <Scene
      image="/images/ps_neon.jpg"
      eyebrow="PLAYSTATION LOUNGE"
      title={
        <>
          Level Up
          <br />
          Your Night.
        </>
      }
      description="Premium gaming stations, immersive lighting and the perfect place to challenge your friends between bowling sessions."
    />
  );
}