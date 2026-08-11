import { Player } from "@remotion/player";
import { VideoComposition } from "./MyVideo";
import { MyVideo } from "./MyVideo";
import React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Player
      composition={VideoComposition}
      components={MyVideo}
      playbackRate={1}
      loop={false}
      showTimeline={true}
    />
  </React.StrictMode>
);