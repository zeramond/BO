import SceneTransition from "@/components/SceneTransition";
import ScenePlaystation from "@/components/scenes/ScenePlaystation";
import SceneCoffee from "@/components/scenes/SceneCoffee";

export default function SceneManager() {
  return (
    <SceneTransition>
      <ScenePlaystation />
      <SceneCoffee />
    </SceneTransition>
  );
}