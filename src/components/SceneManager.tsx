import SceneTransition from "@/components/SceneTransition";
import ScenePlaystation from "@/components/scenes/ScenePlaystation";
import SceneCoffee from "@/components/scenes/SceneCoffee";
import SceneBilliards from "@/components/scenes/SceneBilliards";

export default function SceneManager() {
  return (
    <SceneTransition>
      <ScenePlaystation />
      <SceneCoffee />
      <SceneBilliards />
    </SceneTransition>
  );
}