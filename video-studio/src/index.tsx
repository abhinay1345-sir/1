import React from "react";
import { registerRoot } from "remotion";
import { VideoComposition } from "./MyVideo";
import { EdisonVideoComposition, SceneCompositions } from "./EdisonVideo";

// Single Remotion Root — exposes every Composition to Studio & the render CLI.
//   main-video      : original generic documentary (1920x1080 / 30fps)
//   edison-video    : "The Bulb Wasn't Enough" — 5-min Edison doc (1280x720 / 25fps)
//   edison-s1..s8   : per-scene preview Compositions for manual iteration
const RemotionRoot: React.FC = () => (
  <>
    <VideoComposition />
    <EdisonVideoComposition />
    <SceneCompositions />
  </>
);

registerRoot(RemotionRoot);
