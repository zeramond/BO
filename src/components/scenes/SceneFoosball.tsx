import Scene from "@/components/Scene";

export default function SceneFoosball() {
  return (
    <Scene
      image="/images/foosball2.jpg"
      eyebrow="FOOSBALL"
      title={
        <>
          Fast Hands.
          <br />
          Faster Games.
        </>
      }
      description="Quick matches, close competition, and another reason to challenge your friends."
    />
  );
}