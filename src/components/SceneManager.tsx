import SceneTransition from "@/components/SceneTransition";
import ScenePlaystation from "@/components/scenes/ScenePlaystation";
import SceneCoffee from "@/components/scenes/SceneCoffee";
import SceneBilliards from "@/components/scenes/SceneBilliards";
import SceneFoosball from "@/components/scenes/SceneFoosball";

export default function SceneManager() {
  return (
    <SceneTransition>
      <ScenePlaystation />
      <SceneCoffee />
      <SceneBilliards />
      <SceneFoosball />
    </SceneTransition>
  );
}