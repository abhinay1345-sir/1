import {Config} from "@remotion/cli/config";

// Allow the renderer to load local file:// assets (images, audio) from
// public/runtime/<project>/ when rendering with real project props.
Config.setChromiumDisableWebSecurity(true);
