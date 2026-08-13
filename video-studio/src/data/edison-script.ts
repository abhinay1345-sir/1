// edison-script.ts — SINGLE SOURCE OF TRUTH for the Edison documentary
// All timing, narration, shots, and SFX derive from this file.
// Change a duration here → narration, shot cuts, SFX times, and the mix all follow.

import type { EdisonSegment, EdisonShot } from "./edison-types";

export const EDISON_SEGMENTS: EdisonSegment[] = [
  // S1 — Title Card (4s, no narration)
  {
    id: "s1_title",
    act: "title",
    startSec: 0,
    endSec: 4,
    durationSec: 4,
    narration: "",
    shots: [
      {
        id: "s1_filament_draw",
        type: "animation",
        src: "filament_draw", // SVG animation of filament drawing + glowing
        startFrame: 0,
        endFrame: 100, // 4s at 25fps
        layer: "hero",
      },
      {
        id: "s1_title_reveal",
        type: "text",
        src: "The Bulb Wasn't Enough",
        startFrame: 30,
        endFrame: 100,
        layer: "title",
      },
      {
        id: "s1_subtitle_reveal",
        type: "text",
        src: "Edison & the adoption of electric light",
        startFrame: 55,
        endFrame: 100,
        layer: "subtitle",
      },
    ],
  },

  // S2 — Act 1: The Problem (38s, ~95 words)
  {
    id: "s2_problem",
    act: "act1",
    startSec: 4,
    endSec: 42,
    durationSec: 38,
    narration: "For most of human history, night was a barrier. After sunset, the world ran on fire — candles, oil lamps, gas jets. They flickered. They smoked. They burned the air you breathed. In London, Paris, New York, the streets after dark were pools of shadow, lit only by hissing gas mantles that stained the walls and poisoned the lungs. Factories stopped. Streets emptied. The productive day ended when the sun went down. The question wasn't whether electric light could work — it was whether anyone would trust it enough to let it into their homes.",
    shots: [
      // 10 shots × ~3.8s each = 38s (max 4s per shot)
      { id: "s2_01", type: "photo", src: "19thc_street_gaslamps.jpg", startFrame: 100, endFrame: 195, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s2_02", type: "photo", src: "candlelit_interior.jpg", startFrame: 195, endFrame: 290, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s2_03", type: "photo", src: "gas_mantle_closeup.jpg", startFrame: 290, endFrame: 385, layer: "hero", kenBurns: { zoom: 1.12, pan: -20 } },
      { id: "s2_04", type: "photo", src: "smoky_victorian_room.jpg", startFrame: 385, endFrame: 480, layer: "hero", kenBurns: { zoom: 1.08, pan: 30 } },
      { id: "s2_05", type: "photo", src: "dark_factory_interior.jpg", startFrame: 480, endFrame: 575, layer: "hero", kenBurns: { zoom: 1.1, pan: -25 } },
      { id: "s2_06", type: "photo", src: "empty_night_street.jpg", startFrame: 575, endFrame: 670, layer: "hero", kenBurns: { zoom: 1.08, pan: 20 } },
      { id: "s2_07", type: "photo", src: "gas_street_lamps_row.jpg", startFrame: 670, endFrame: 765, layer: "hero", kenBurns: { zoom: 1.1, pan: -30 } },
      { id: "s2_07b", type: "text", src: "Night was a barrier.", startFrame: 765, endFrame: 805, layer: "lower_third" },
      { id: "s2_08", type: "photo", src: "victorian_home_evening.jpg", startFrame: 805, endFrame: 900, layer: "hero", kenBurns: { zoom: 1.08, pan: 25 } },
      { id: "s2_09", type: "photo", src: "transition_candle_to_darkness.jpg", startFrame: 900, endFrame: 1050, layer: "hero", kenBurns: { zoom: 1.12, pan: 0 } },
    ],
  },

  // S3 — Act 2: Edison's Real Challenge (50s, ~125 words)
  {
    id: "s3_challenge",
    act: "act2",
    startSec: 42,
    endSec: 92,
    durationSec: 50,
    narration: "By 1878, electric light wasn't new. Arc lamps blasted public squares with harsh, buzzing light. But for homes and offices, you needed something gentler — a filament that glowed without burning up in minutes. Dozens of inventors had tried. Swan in England. Maxim in America. Their lamps worked — briefly. The real problem wasn't the bulb. It was everything around it. A lamp needs current. Current needs a generator. A generator needs fuel. The current must travel through wires — safely, reliably — to a meter, to a socket, to the lamp. And the customer must pay for it. Edison realized: he wasn't inventing a light bulb. He was inventing an entire electrical system. Generator. Wires. Meters. Sockets. Lamps. All of it. Or none of it worked.",
    shots: [
      // 13 shots × ~3.8s = 50s (system diagram counts as continuous animation, cut sub-views ≤4s)
      { id: "s3_01", type: "photo", src: "arc_lamp_street.jpg", startFrame: 1050, endFrame: 1145, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s3_02", type: "photo", src: "swan_lamp.jpg", startFrame: 1145, endFrame: 1240, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s3_03", type: "animation", src: "system_diagram", startFrame: 1240, endFrame: 1365, layer: "graphic" }, // continuous, internal cuts
      { id: "s3_03a", type: "graphic_subview", src: "system_diagram_bulb", startFrame: 1240, endFrame: 1340, layer: "graphic" },
      { id: "s3_03b", type: "graphic_subview", src: "system_diagram_generator", startFrame: 1340, endFrame: 1440, layer: "graphic" },
      { id: "s3_03c", type: "graphic_subview", src: "system_diagram_wires", startFrame: 1440, endFrame: 1540, layer: "graphic" },
      { id: "s3_03d", type: "graphic_subview", src: "system_diagram_meter", startFrame: 1540, endFrame: 1640, layer: "graphic" },
      { id: "s3_03e", type: "graphic_subview", src: "system_diagram_customer", startFrame: 1640, endFrame: 1740, layer: "graphic" },
      { id: "s3_04", type: "photo", src: "edison_menlo_park_portrait.jpg", startFrame: 1740, endFrame: 1835, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
      { id: "s3_05", type: "photo", src: "early_generator.jpg", startFrame: 1835, endFrame: 1930, layer: "hero", kenBurns: { zoom: 1.1, pan: 20 } },
      { id: "s3_06", type: "photo", src: "wiring_installation.jpg", startFrame: 1930, endFrame: 2025, layer: "hero", kenBurns: { zoom: 1.08, pan: -25 } },
      { id: "s3_07", type: "photo", src: "edison_meter.jpg", startFrame: 2025, endFrame: 2120, layer: "hero", kenBurns: { zoom: 1.12, pan: 15 } },
      { id: "s3_08", type: "text", src: "He wasn't inventing a bulb.\nHe was inventing a system.", startFrame: 2120, endFrame: 2170, layer: "title" },
      { id: "s3_09", type: "animation", src: "blueprint_to_reality", startFrame: 2170, endFrame: 2300, layer: "graphic" },
    ],
  },

  // S4 — Act 3a: Public Demonstration (40s, ~100 words)
  {
    id: "s4_demo",
    act: "act3a",
    startSec: 92,
    endSec: 132,
    durationSec: 40,
    narration: "People don't adopt what they can't see. So Edison made them see it. December 1879. Menlo Park. He strung lamps along the laboratory grounds — a street of electric light in the middle of a New Jersey winter. Three thousand people came. They walked the paths under steady, smokeless glow. No hiss of gas. No smell of oil. Just light, clean and constant. Newspapers called it 'a fairyland of light.' The demonstration wasn't a stunt. It was the core strategy: make the abstract tangible. Let people stand in the future you're selling. Once they've seen it, they can't unsee it. The orders started coming before the wires were even laid.",
    shots: [
      // 10 shots × 4s = 40s
      { id: "s4_01", type: "photo", src: "menlo_park_exterior_night.jpg", startFrame: 2300, endFrame: 2400, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s4_02", type: "photo", src: "menlo_park_lamps_path.jpg", startFrame: 2400, endFrame: 2500, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s4_03", type: "photo", src: "crowd_at_menlo_park.jpg", startFrame: 2500, endFrame: 2600, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s4_04", type: "photo", src: "edison_at_demo.jpg", startFrame: 2600, endFrame: 2700, layer: "hero", kenBurns: { zoom: 1.12, pan: 15 } },
      { id: "s4_05", type: "photo", src: "lamp_closeup_glowing.jpg", startFrame: 2700, endFrame: 2800, layer: "hero", kenBurns: { zoom: 1.15, pan: 0 } },
      { id: "s4_06", type: "animation", src: "newspaper_anim", startFrame: 2800, endFrame: 2900, layer: "graphic" }, // New York Herald Dec 1879
      { id: "s4_07", type: "photo", src: "menlo_park_lab_interior.jpg", startFrame: 2900, endFrame: 3000, layer: "hero", kenBurns: { zoom: 1.08, pan: -25 } },
      { id: "s4_08", type: "photo", src: "electric_lamp_vs_gas_lamp.jpg", startFrame: 3000, endFrame: 3100, layer: "hero", kenBurns: { zoom: 1.1, pan: 20 } },
      { id: "s4_09", type: "text", src: "Make people see it.", startFrame: 3100, endFrame: 3180, layer: "title" },
      { id: "s4_10", type: "animation", src: "orders_coming_in", startFrame: 3180, endFrame: 3300, layer: "graphic" },
    ],
  },

  // S5 — Act 3b: Sell the System (42s, ~105 words)
  {
    id: "s5_system",
    act: "act3b",
    startSec: 132,
    endSec: 174,
    durationSec: 42,
    narration: "You couldn't just sell a bulb. The customer had no wires, no current, no meter. So Edison sold the whole thing. The Edison Electric Light Company didn't market lamps — it marketed light as a service. One bulb. Then one building — the Merchant's Safe Deposit Company, 1881. Then one street. Then a district. The system diagram wasn't a slide. It was the business model. Generator in the basement. Wires in the walls. Meters at the panel. Lamps in the sockets. You paid for light, not hardware. This was the shift: from product to infrastructure. From invention to utility. The bulb was the visible tip. The system was the iceberg underneath.",
    shots: [
      // 11 shots ≤4s each (city network continuous, internal sub-views cut)
      { id: "s5_01", type: "animation", src: "city_network", startFrame: 3300, endFrame: 3550, layer: "graphic" }, // continuous expansion
      { id: "s5_01a", type: "graphic_subview", src: "city_network_bulb", startFrame: 3300, endFrame: 3400, layer: "graphic" },
      { id: "s5_01b", type: "graphic_subview", src: "city_network_building", startFrame: 3400, endFrame: 3500, layer: "graphic" },
      { id: "s5_01c", type: "graphic_subview", src: "city_network_street", startFrame: 3500, endFrame: 3600, layer: "graphic" },
      { id: "s5_01d", type: "graphic_subview", src: "city_network_city", startFrame: 3600, endFrame: 3700, layer: "graphic" },
      { id: "s5_02", type: "photo", src: "merchants_safe_deposit.jpg", startFrame: 3700, endFrame: 3800, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s5_03", type: "photo", src: "early_electric_wiring.jpg", startFrame: 3800, endFrame: 3900, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s5_04", type: "photo", src: "edison_socket.jpg", startFrame: 3900, endFrame: 4000, layer: "hero", kenBurns: { zoom: 1.12, pan: -15 } },
      { id: "s5_05", type: "photo", src: "electric_meter_early.jpg", startFrame: 4000, endFrame: 4100, layer: "hero", kenBurns: { zoom: 1.08, pan: 20 } },
      { id: "s5_06", type: "text", src: "Sell the system.\nNot just the bulb.", startFrame: 4100, endFrame: 4180, layer: "title" },
      { id: "s5_07", type: "animation", src: "infrastructure_iceberg", startFrame: 4180, endFrame: 4350, layer: "graphic" },
    ],
  },

  // S6 — Act 4: The Pearl Street Moment (50s, ~120 words)
  {
    id: "s6_pearl",
    act: "act4",
    startSec: 174,
    endSec: 224,
    durationSec: 50,
    narration: "September 4, 1882. Pearl Street, Lower Manhattan. Six Jumbo generators — each the size of a locomotive — spun up. Steam hissed. Copper conductors ran through brick tunnels beneath the streets. When the switch closed, fifty-nine customers in a quarter-square-mile district saw their lamps glow. The New York Times building. The Drexel, Morgan & Co. offices. The New York Stock Exchange. It wasn't a demonstration anymore. It was a service. You flipped a switch. Light appeared. You paid a bill. The system worked. Pearl Street proved the model: central generation, underground distribution, metered delivery. Within a year, the district expanded. Within a decade, the model spread to every major city. The invention had become a utility.",
    shots: [
      // 13 shots ≤4s (Pearl Street expansion continuous, internal cuts)
      { id: "s6_01", type: "photo", src: "pearl_street_station_exterior.jpg", startFrame: 4350, endFrame: 4450, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s6_02", type: "photo", src: "jumbo_generator.jpg", startFrame: 4450, endFrame: 4550, layer: "hero", kenBurns: { zoom: 1.12, pan: 25 } },
      { id: "s6_03", type: "photo", src: "underground_conduits.jpg", startFrame: 4550, endFrame: 4650, layer: "hero", kenBurns: { zoom: 1.1, pan: -20 } },
      { id: "s6_04", type: "animation", src: "pearl_street_network", startFrame: 4650, endFrame: 4950, layer: "graphic" }, // continuous
      { id: "s6_04a", type: "graphic_subview", src: "pearl_generator", startFrame: 4650, endFrame: 4750, layer: "graphic" },
      { id: "s6_04b", type: "graphic_subview", src: "pearl_wires", startFrame: 4750, endFrame: 4850, layer: "graphic" },
      { id: "s6_04c", type: "graphic_subview", src: "pearl_buildings", startFrame: 4850, endFrame: 4950, layer: "graphic" },
      { id: "s6_05", type: "photo", src: "nyt_building_lit.jpg", startFrame: 4950, endFrame: 5050, layer: "hero", kenBurns: { zoom: 1.08, pan: 15 } },
      { id: "s6_06", type: "photo", src: "drexel_morgan_office.jpg", startFrame: 5050, endFrame: 5150, layer: "hero", kenBurns: { zoom: 1.1, pan: -25 } },
      { id: "s6_07", type: "photo", src: "nyse_trading_floor.jpg", startFrame: 5150, endFrame: 5250, layer: "hero", kenBurns: { zoom: 1.08, pan: 20 } },
      { id: "s6_08", type: "text", src: "The invention became a service.", startFrame: 5250, endFrame: 5330, layer: "title" },
      { id: "s6_09", type: "photo", src: "manhattan_electrified_map.jpg", startFrame: 5330, endFrame: 5430, layer: "hero", kenBurns: { zoom: 1.12, pan: 0 } },
      { id: "s6_10", type: "animation", src: "city_electrifies_timelapse", startFrame: 5430, endFrame: 5600, layer: "graphic" },
    ],
  },

  // S7 — Act 5: The Business Lesson (38s, ~95 words)
  {
    id: "s7_lesson",
    act: "act5",
    startSec: 224,
    endSec: 262,
    durationSec: 38,
    narration: "The lesson isn't about Edison. It's about adoption. A revolutionary invention fails if nobody understands how to use it. The telephone needed exchanges. The automobile needed roads and gas stations. The personal computer needed software and networks. The electric car needed charging infrastructure. Edison understood: don't merely sell the invention. Build the environment that makes the invention useful. The bulb was brilliant. But the system — generators, wires, meters, sockets, billing, service — that was the real invention. Today, every platform company follows the same playbook. They don't just ship code. They build the ecosystem the code lives in.",
    shots: [
      // 10 shots ≤4s
      { id: "s7_01", type: "animation", src: "historical_to_modern_bridge", startFrame: 5600, endFrame: 5700, layer: "graphic" },
      { id: "s7_02", type: "photo", src: "telephone_exchange.jpg", startFrame: 5700, endFrame: 5800, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s7_03", type: "photo", src: "early_automobile_gas_station.jpg", startFrame: 5800, endFrame: 5900, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s7_04", type: "photo", src: "early_personal_computer.jpg", startFrame: 5900, endFrame: 6000, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
      { id: "s7_05", type: "photo", src: "ev_charging_station.jpg", startFrame: 6000, endFrame: 6100, layer: "hero", kenBurns: { zoom: 1.12, pan: 20 } },
      { id: "s7_06", type: "text", src: "Don't just sell the invention.\nBuild the environment.", startFrame: 6100, endFrame: 6180, layer: "title" },
      { id: "s7_07", type: "photo", src: "modern_data_center.jpg", startFrame: 6180, endFrame: 6280, layer: "hero", kenBurns: { zoom: 1.08, pan: -25 } },
      { id: "s7_08", type: "photo", src: "smartphone_ecosystem.jpg", startFrame: 6280, endFrame: 6380, layer: "hero", kenBurns: { zoom: 1.1, pan: 15 } },
      { id: "s7_09", type: "photo", src: "cloud_infrastructure.jpg", startFrame: 6380, endFrame: 6480, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s7_10", type: "animation", src: "platform_playbook", startFrame: 6480, endFrame: 6550, layer: "graphic" },
    ],
  },

  // S8 — Act 6: Ending (34s, ~75 words + tagline)
  {
    id: "s8_ending",
    act: "act6",
    startSec: 262,
    endSec: 296,
    durationSec: 34,
    narration: "So. Was Edison simply selling a light bulb? Not really. He was helping build a system in which electric light could become a normal part of everyday life. The most powerful inventions don't always win because they're the most impressive. They win when someone figures out how to make people adopt them.",
    shots: [
      // 9 shots ≤4s
      { id: "s8_01", type: "animation", src: "darkness_to_first_lamp", startFrame: 6550, endFrame: 6650, layer: "graphic" },
      { id: "s8_02", type: "animation", src: "lamps_spreading", startFrame: 6650, endFrame: 6750, layer: "graphic" },
      { id: "s8_03", type: "animation", src: "city_illuminates", startFrame: 6750, endFrame: 6850, layer: "graphic" },
      { id: "s8_04", type: "photo", src: "historical_city_night_lit.jpg", startFrame: 6850, endFrame: 6950, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s8_05", type: "animation", src: "historical_to_modern_transition", startFrame: 6950, endFrame: 7050, layer: "graphic" },
      { id: "s8_06", type: "photo", src: "modern_city_skyline_night.jpg", startFrame: 7050, endFrame: 7150, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s8_07", type: "text", src: "The most powerful inventions\nwin when someone figures out\nhow to make people adopt them.", startFrame: 7150, endFrame: 7300, layer: "title" },
      { id: "s8_08", type: "text", src: "The Bulb Wasn't Enough", startFrame: 7300, endFrame: 7400, layer: "title_end" },
      { id: "s8_09", type: "animation", src: "final_fade", startFrame: 7400, endFrame: 7400, layer: "graphic" }, // end at frame 7400 = 296s
    ],
  },
];

// Total frames = 7400 (296s) + title 100 frames (4s) = 7500 frames = 300s at 25fps
export const TOTAL_FRAMES = 7500;
export const FPS = 25;
export const WIDTH = 1280;
export const HEIGHT = 720;

// Type definitions for this file
export type EdisonSegment = {
  id: string;
  act: "title" | "act1" | "act2" | "act3a" | "act3b" | "act4" | "act5" | "act6";
  startSec: number;
  endSec: number;
  durationSec: number;
  narration: string;
  shots: EdisonShot[];
};

export type EdisonShot = {
  id: string;
  type: "photo" | "animation" | "text" | "graphic_subview";
  src: string;
  startFrame: number;
  endFrame: number;
  layer: "hero" | "graphic" | "title" | "subtitle" | "lower_third" | "title_end";
  kenBurns?: { zoom: number; pan: number };
};