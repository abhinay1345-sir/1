// edison-script.ts — SINGLE SOURCE OF TRUTH for the Edison documentary
// All timing, narration, shots, and SFX derive from this file.
// Change a duration here → narration, shot cuts, SFX times, and the mix all follow.

import type { EdisonSegment, EdisonShot } from "./edison-types";

const FPS = 25;
const GAP_SEC = 0.8; // inter-segment breathing gap
const TITLE_SEC = 4;

// Measured narration durations (from edge-tts -8% output)
const DUR = {
  s1_title: TITLE_SEC,
  s2_problem: 34.61,
  s3_challenge: 56.78,
  s4_demo: 43.73,
  s5_system: 46.87,
  s6_pearl: 52.75,
  s7_lesson: 43.42,
  s8_ending: 18.12,
} as const;

function sec(f: number) { return Math.round(f * FPS); }
function frames(s: number) { return Math.round(s * FPS); }

let cursor = 0;
const seg = (id: string, act: EdisonSegment["act"], key: keyof typeof DUR, narration: string, shots: EdisonShot[]) => {
  const startFrame = cursor;
  const durationSec = DUR[key];
  const endFrame = startFrame + frames(durationSec);
  const startSec = startFrame / FPS;
  const endSec = endFrame / FPS;
  cursor = endFrame + frames(GAP_SEC);
  return { id, act, startSec, endSec, durationSec, narration, shots, startFrame, endFrame };
};

export const EDISON_SEGMENTS: EdisonSegment[] = [
  // S1 — Title Card (4s, no narration)
  seg("s1_title", "title", "s1_title", "", [
    { id: "s1_filament_draw", type: "animation", src: "filament_draw", startFrame: 0, endFrame: sec(4), layer: "hero" },
    { id: "s1_title_reveal", type: "text", src: "The Bulb Wasn't Enough", startFrame: sec(0.5), endFrame: sec(4), layer: "title" },
    { id: "s1_subtitle_reveal", type: "text", src: "Edison & the adoption of electric light", startFrame: sec(1.5), endFrame: sec(4), layer: "subtitle" },
  ]),

  // S2 — Act 1: The Problem (34.61s) — 9 shots ≤4s
  seg("s2_problem", "act1", "s2_problem",
    "For most of human history, night was a barrier. After sunset, the world ran on fire — candles, oil lamps, gas jets. They flickered. They smoked. They burned the air you breathed. In London, Paris, New York, the streets after dark were pools of shadow, lit only by hissing gas mantles that stained the walls and poisoned the lungs. Factories stopped. Streets emptied. The productive day ended when the sun went down. The question wasn't whether electric light could work — it was whether anyone would trust it enough to let it into their homes.",
    [
      { id: "s2_01", type: "photo", src: "19thc_street_gaslamps.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s2_02", type: "photo", src: "candlelit_interior.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s2_03", type: "photo", src: "gas_mantle_closeup.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: -20 } },
      { id: "s2_04", type: "photo", src: "smoky_victorian_room.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: 30 } },
      { id: "s2_05", type: "photo", src: "dark_factory_interior.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: -25 } },
      { id: "s2_06", type: "photo", src: "empty_night_street.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: 20 } },
      { id: "s2_07", type: "photo", src: "gas_street_lamps_row.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: -30 } },
      { id: "s2_08", type: "text", src: "Night was a barrier.", startFrame: 0, endFrame: 0, layer: "lower_third" },
      { id: "s2_09", type: "photo", src: "victorian_home_evening.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: 25 } },
      { id: "s2_10", type: "photo", src: "transition_candle_to_darkness.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: 0 } },
    ]
  ),

  // S3 — Act 2: Edison's Real Challenge (56.78s) — 15 shots ≤4s
  seg("s3_challenge", "act2", "s3_challenge",
    "By 1878, electric light wasn't new. Arc lamps blasted public squares with harsh, buzzing light. But for homes and offices, you needed something gentler — a filament that glowed without burning up in minutes. Dozens of inventors had tried. Swan in England. Maxim in America. Their lamps worked — briefly. The real problem wasn't the bulb. It was everything around it. A lamp needs current. Current needs a generator. A generator needs fuel. The current must travel through wires — safely, reliably — to a meter, to a socket, to the lamp. And the customer must pay for it. Edison realized: he wasn't inventing a light bulb. He was inventing an entire electrical system. Generator. Wires. Meters. Sockets. Lamps. All of it. Or none of it worked.",
    [
      { id: "s3_01", type: "photo", src: "arc_lamp_street.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s3_02", type: "photo", src: "swan_lamp.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s3_03", type: "photo", src: "maxim_lamp.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
      { id: "s3_04", type: "animation", src: "system_diagram", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s3_04a", type: "graphic_subview", src: "system_diagram_bulb", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s3_04b", type: "graphic_subview", src: "system_diagram_generator", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s3_04c", type: "graphic_subview", src: "system_diagram_wires", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s3_04d", type: "graphic_subview", src: "system_diagram_meter", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s3_04e", type: "graphic_subview", src: "system_diagram_customer", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s3_05", type: "photo", src: "edison_menlo_park_portrait.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
      { id: "s3_06", type: "photo", src: "early_generator.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 20 } },
      { id: "s3_07", type: "photo", src: "wiring_installation.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -25 } },
      { id: "s3_08", type: "photo", src: "edison_meter.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: 15 } },
      { id: "s3_09", type: "text", src: "He wasn't inventing a bulb.\nHe was inventing a system.", startFrame: 0, endFrame: 0, layer: "title" },
      { id: "s3_10", type: "animation", src: "blueprint_to_reality", startFrame: 0, endFrame: 0, layer: "graphic" },
    ]
  ),

  // S4 — Act 3a: Public Demonstration (43.73s) — 11 shots ≤4s
  seg("s4_demo", "act3a", "s4_demo",
    "People don't adopt what they can't see. So Edison made them see it. December 1879. Menlo Park. He strung lamps along the laboratory grounds — a street of electric light in the middle of a New Jersey winter. Three thousand people came. They walked the paths under steady, smokeless glow. No hiss of gas. No smell of oil. Just light, clean and constant. Newspapers called it 'a fairyland of light.' The demonstration wasn't a stunt. It was the core strategy: make the abstract tangible. Let people stand in the future you're selling. Once they've seen it, they can't unsee it. The orders started coming before the wires were even laid.",
    [
      { id: "s4_01", type: "photo", src: "menlo_park_exterior_night.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s4_02", type: "photo", src: "menlo_park_lamps_path.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s4_03", type: "photo", src: "crowd_at_menlo_park.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s4_04", type: "photo", src: "edison_at_demo.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: 15 } },
      { id: "s4_05", type: "photo", src: "lamp_closeup_glowing.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.15, pan: 0 } },
      { id: "s4_06", type: "animation", src: "newspaper_anim", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s4_07", type: "photo", src: "menlo_park_lab_interior.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -25 } },
      { id: "s4_08", type: "photo", src: "electric_lamp_vs_gas_lamp.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 20 } },
      { id: "s4_09", type: "text", src: "Make people see it.", startFrame: 0, endFrame: 0, layer: "title" },
      { id: "s4_10", type: "animation", src: "orders_coming_in", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s4_11", type: "photo", src: "victorian_house_electric.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
    ]
  ),

  // S5 — Act 3b: Sell the System (46.87s) — 12 shots ≤4s
  seg("s5_system", "act3b", "s5_system",
    "You couldn't just sell a bulb. The customer had no wires, no current, no meter. So Edison sold the whole thing. The Edison Electric Light Company didn't market lamps — it marketed light as a service. One bulb. Then one building — the Merchant's Safe Deposit Company, 1881. Then one street. Then a district. The system diagram wasn't a slide. It was the business model. Generator in the basement. Wires in the walls. Meters at the panel. Lamps in the sockets. You paid for light, not hardware. This was the shift: from product to infrastructure. From invention to utility. The bulb was the visible tip. The system was the iceberg underneath.",
    [
      { id: "s5_01", type: "animation", src: "city_network", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s5_01a", type: "graphic_subview", src: "city_network_bulb", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s5_01b", type: "graphic_subview", src: "city_network_building", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s5_01c", type: "graphic_subview", src: "city_network_street", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s5_01d", type: "graphic_subview", src: "city_network_city", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s5_02", type: "photo", src: "merchants_safe_deposit.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s5_03", type: "photo", src: "early_electric_wiring.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s5_04", type: "photo", src: "edison_socket.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: -15 } },
      { id: "s5_05", type: "photo", src: "electric_meter_early.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: 20 } },
      { id: "s5_06", type: "text", src: "Sell the system.\nNot just the bulb.", startFrame: 0, endFrame: 0, layer: "title" },
      { id: "s5_07", type: "animation", src: "infrastructure_iceberg", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s5_08", type: "photo", src: "edison_electric_light_co.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -10 } },
    ]
  ),

  // S6 — Act 4: The Pearl Street Moment (52.75s) — 14 shots ≤4s
  seg("s6_pearl", "act4", "s6_pearl",
    "September 4, 1882. Pearl Street, Lower Manhattan. Six Jumbo generators — each the size of a locomotive — spun up. Steam hissed. Copper conductors ran through brick tunnels beneath the streets. When the switch closed, fifty-nine customers in a quarter-square-mile district saw their lamps glow. The New York Times building. The Drexel, Morgan & Co. offices. The New York Stock Exchange. It wasn't a demonstration anymore. It was a service. You flipped a switch. Light appeared. You paid a bill. The system worked. Pearl Street proved the model: central generation, underground distribution, metered delivery. Within a year, the district expanded. Within a decade, the model spread to every major city. The invention had become a utility.",
    [
      { id: "s6_01", type: "photo", src: "pearl_street_station_exterior.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s6_02", type: "photo", src: "jumbo_generator.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: 25 } },
      { id: "s6_03", type: "photo", src: "underground_conduits.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: -20 } },
      { id: "s6_04", type: "animation", src: "pearl_street_network", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s6_04a", type: "graphic_subview", src: "pearl_generator", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s6_04b", type: "graphic_subview", src: "pearl_wires", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s6_04c", type: "graphic_subview", src: "pearl_buildings", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s6_05", type: "photo", src: "nyt_building_lit.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: 15 } },
      { id: "s6_06", type: "photo", src: "drexel_morgan_office.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: -25 } },
      { id: "s6_07", type: "photo", src: "nyse_trading_floor.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: 20 } },
      { id: "s6_08", type: "text", src: "The invention became a service.", startFrame: 0, endFrame: 0, layer: "title" },
      { id: "s6_09", type: "photo", src: "manhattan_electrified_map.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: 0 } },
      { id: "s6_10", type: "animation", src: "city_electrifies_timelapse", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s6_11", type: "photo", src: "pearl_street_district.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
    ]
  ),

  // S7 — Act 5: The Business Lesson (43.42s) — 11 shots ≤4s
  seg("s7_lesson", "act5", "s7_lesson",
    "The lesson isn't about Edison. It's about adoption. A revolutionary invention fails if nobody understands how to use it. The telephone needed exchanges. The automobile needed roads and gas stations. The personal computer needed software and networks. The electric car needed charging infrastructure. Edison understood: don't merely sell the invention. Build the environment that makes the invention useful. The bulb was brilliant. But the system — generators, wires, meters, sockets, billing, service — that was the real invention. Today, every platform company follows the same playbook. They don't just ship code. They build the ecosystem the code lives in.",
    [
      { id: "s7_01", type: "animation", src: "historical_to_modern_bridge", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s7_02", type: "photo", src: "telephone_exchange.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s7_03", type: "photo", src: "early_automobile_gas_station.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s7_04", type: "photo", src: "early_personal_computer.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -15 } },
      { id: "s7_05", type: "photo", src: "ev_charging_station.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.12, pan: 20 } },
      { id: "s7_06", type: "text", src: "Don't just sell the invention.\nBuild the environment.", startFrame: 0, endFrame: 0, layer: "title" },
      { id: "s7_07", type: "photo", src: "modern_data_center.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -25 } },
      { id: "s7_08", type: "photo", src: "smartphone_ecosystem.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 15 } },
      { id: "s7_09", type: "photo", src: "cloud_infrastructure.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -20 } },
      { id: "s7_10", type: "animation", src: "platform_playbook", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s7_11", type: "photo", src: "ai_platform_ecosystem.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: -10 } },
    ]
  ),

  // S8 — Act 6: Ending (18.12s) — 7 shots ≤4s (tighter ending)
  seg("s8_ending", "act6", "s8_ending",
    "So. Was Edison simply selling a light bulb? Not really. He was helping build a system in which electric light could become a normal part of everyday life. The most powerful inventions don't always win because they're the most impressive. They win when someone figures out how to make people adopt them.",
    [
      { id: "s8_01", type: "animation", src: "darkness_to_first_lamp", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s8_02", type: "animation", src: "lamps_spreading", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s8_03", type: "animation", src: "city_illuminates", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s8_04", type: "photo", src: "historical_city_night_lit.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.08, pan: -30 } },
      { id: "s8_05", type: "animation", src: "historical_to_modern_transition", startFrame: 0, endFrame: 0, layer: "graphic" },
      { id: "s8_06", type: "photo", src: "modern_city_skyline_night.jpg", startFrame: 0, endFrame: 0, layer: "hero", kenBurns: { zoom: 1.1, pan: 25 } },
      { id: "s8_07", type: "text", src: "The most powerful inventions\nwin when someone figures out\nhow to make people adopt them.", startFrame: 0, endFrame: 0, layer: "title" },
      { id: "s8_08", type: "text", src: "The Bulb Wasn't Enough", startFrame: 0, endFrame: 0, layer: "title_end" },
    ]
  ),
];

// Helper to backfill absolute frames from relative zeros (runs at import time)
let absCursor = 0;
for (const s of EDISON_SEGMENTS) {
  const segFrames = frames(s.durationSec);
  s.startFrame = absCursor;
  s.endFrame = absCursor + segFrames;
  absCursor = s.endFrame + frames(GAP_SEC);
  for (const shot of s.shots) {
    const relStart = shot.startFrame;
    const relEnd = shot.endFrame;
    // If shot has 0/0, we'll assign in a second pass below (not needed if we pre-compute)
    shot.startFrame = s.startFrame + relStart;
    shot.endFrame = s.startFrame + (relEnd || relStart + sec(4));
  }
}
const TOTAL_FRAMES = absCursor - frames(GAP_SEC); // last segment has no trailing gap

import { WIDTH, HEIGHT } from "./edison-types";

export { TOTAL_FRAMES, FPS, WIDTH, HEIGHT };
export type { EdisonSegment, EdisonShot } from "./edison-types";