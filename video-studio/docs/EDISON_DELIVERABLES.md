# Edison Documentary — "The Bulb Wasn't Enough"
## Phase 8 Deliverables

---

## 1. Full Narration Script (Verbatim) with Timestamps

Narration synthesized via edge-tts `en-US-ChristopherNeural` at -8% rate. The durations below are the *measured* WAV durations that drive each segment's frame count.

### S1 — Title (0:00–0:04, 4.00s, no narration)
**On-screen:** animated filament draw → *The Bulb Wasn't Enough* → *Edison & the adoption of electric light*

### S2 — Act 1: The Problem (0:04–0:39, 34.61s)
> "For most of human history, night was a barrier. After sunset, the world ran on fire — candles, oil lamps, gas jets. They flickered. They smoked. They burned the air you breathed. In London, Paris, New York, the streets after dark were pools of shadow, lit only by hissing gas mantles that stained the walls and poisoned the lungs. Factories stopped. Streets emptied. The productive day ended when the sun went down. The question wasn't whether electric light could work — it was whether anyone would trust it enough to let it into their homes."

**On-screen text (lower third):** "Night was a barrier."

### S3 — Act 2: The Challenge (0:40–1:37, 56.78s)
> "By 1878, electric light wasn't new. Arc lamps blasted public squares with harsh, buzzing light. But for homes and offices, you needed something gentler — a filament that glowed without burning up in minutes. Dozens of inventors had tried. Swan in England. Maxim in America. Their lamps worked — briefly. The real problem wasn't the bulb. It was everything around it. A lamp needs current. Current needs a generator. A generator needs fuel. The current must travel through wires — safely, reliably — to a meter, to a socket, to the lamp. And the customer must pay for it. Edison realized: he wasn't inventing a light bulb. He was inventing an entire electrical system. Generator. Wires. Meters. Sockets. Lamps. All of it. Or none of it worked."

**On-screen title card:** "He wasn't inventing a bulb.\nHe was inventing a system."

### S4 — Act 3a: The Demo (1:38–2:21, 43.73s)
> "People don't adopt what they can't see. So Edison made them see it. December 1879. Menlo Park. He strung lamps along the laboratory grounds — a street of electric light in the middle of a New Jersey winter. Three thousand people came. They walked the paths under steady, smokeless glow. No hiss of gas. No smell of oil. Just light, clean and constant. Newspapers called it 'a fairyland of light.' The demonstration wasn't a stunt. It was the core strategy: make the abstract tangible. Let people stand in the future you're selling. Once they've seen it, they can't unsee it. The orders started coming before the wires were even laid."

**On-screen title card:** "Make people see it."

### S5 — Act 3b: The System (2:21–3:08, 46.87s)
> "You couldn't just sell a bulb. The customer had no wires, no current, no meter. So Edison sold the whole thing. The Edison Electric Light Company didn't market lamps — it marketed light as a service. One bulb. Then one building — the Merchant's Safe Deposit Company, 1881. Then one street. Then a district. The system diagram wasn't a slide. It was the business model. Generator in the basement. Wires in the walls. Meters at the panel. Lamps in the sockets. You paid for light, not hardware. This was the shift: from product to infrastructure. From invention to utility. The bulb was the visible tip. The system was the iceberg underneath."

**On-screen title card:** "Sell the system.\nNot just the bulb."

### S6 — Act 4: Pearl Street (3:08–4:00, 52.75s)
> "September 4, 1882. Pearl Street, Lower Manhattan. Six Jumbo generators — each the size of a locomotive — spun up. Steam hissed. Copper conductors ran through brick tunnels beneath the streets. When the switch closed, fifty-nine customers in a quarter-square-mile district saw their lamps glow. The New York Times building. The Drexel, Morgan & Co. offices. The New York Stock Exchange. It wasn't a demonstration anymore. It was a service. You flipped a switch. Light appeared. You paid a bill. The system worked. Pearl Street proved the model: central generation, underground distribution, metered delivery. Within a year, the district expanded. Within a decade, the model spread to every major city. The invention had become a utility."

**On-screen title card:** "The invention became a service."

### S7 — Act 5: The Lesson (4:00–4:47, 43.42s)
> "The lesson isn't about Edison. It's about adoption. A revolutionary invention fails if nobody understands how to use it. The telephone needed exchanges. The automobile needed roads and gas stations. The personal computer needed software and networks. The electric car needed charging infrastructure. Edison understood: don't merely sell the invention. Build the environment that makes the invention useful. The bulb was brilliant. But the system — generators, wires, meters, sockets, billing, service — that was the real invention. Today, every platform company follows the same playbook. They don't just ship code. They build the ecosystem the code lives in."

**On-screen title card:** "Don't just sell the invention.\nBuild the environment."

### S8 — Act 6: The Ending (4:48–5:06, 18.12s)
> "So. Was Edison simply selling a light bulb? Not really. He was helping build a system in which electric light could become a normal part of everyday life. The most powerful inventions don't always win because they're the most impressive. They win when someone figures out how to make people adopt them."

---

### Segment timing summary

| Segment | Start | End | Duration | Frames |
|---------|-------|-----|----------|--------|
| S1 Title | 0:00.00 | 0:04.00 | 4.00s | 0–100 |
| S2 Problem | 0:04.80 | 0:39.40 | 34.61s | 120–985 |
| S3 Challenge | 0:40.20 | 1:37.00 | 56.78s | 1005–2425 |
| S4 Demo | 1:37.80 | 2:21.52 | 43.73s | 2445–3538 |
| S5 System | 2:22.32 | 3:09.20 | 46.87s | 3558–4730 |
| S6 Pearl | 3:10.00 | 4:02.76 | 52.75s | 4750–6069 |
| S7 Lesson | 4:03.56 | 4:47.00 | 43.42s | 6089–7175 |
| S8 Ending | 4:47.80 | 5:05.92 | 18.12s | 7195–7648 |

**Total: 305.92s (5:05.92)** — inter-segment gap = 0.8s (20 frames)

### Audio layer schematic

```
 0:00──────────────────────────────────────────────────────5:05
 ┌────────────────────────────────────────────────────────────┐
 │ MUSIC  background.mp3  vol 0.16  (fade-in 2.5s, fade-out 3s)│  ← separate swappable layer
 ├────────────────────────────────────────────────────────────┤
 │ SFX    whoosh.wav vol 0.35 ×7 at chapter boundaries          │  ← separate swappable layer
 │        4.0s  40.2s  97.8s  142.3s  190.0s  243.6s  287.8s     │
 ├────────────────────────────────────────────────────────────┤
 │ VO     s2|----34.6s----| s3|----56.8s----| ... |s8|-18.1s-|   │  ← 8 separate swappable WAVs
 └────────────────────────────────────────────────────────────┘
```

---

## 2. Shot-by-Shot Timeline (Frame-Accurate, 25fps)

| Shot ID | Segment | Layer | Type | Source File | Start Frame | End Frame | Duration (frames) | Duration (s) | Ken Burns |
|---------|---------|-------|------|-------------|-------------|-----------|-------------------|--------------|-----------|
| s1_filament_draw | s1_title | hero | animation | (procedural) | 0 | 100 | 100 | 4.00 | — |
| s1_title_reveal | s1_title | title | text | "The Bulb Wasn't Enough" | 13 | 100 | 87 | 3.48 | — |
| s1_subtitle_reveal | s1_title | subtitle | text | "Edison & the adoption of electric light" | 38 | 100 | 62 | 2.48 | — |
| s2_01 | s2_problem | hero | photo | 19thc_street_gaslamps.jpg | 120 | 242 | 122 | 4.88 | zoom 1.08, pan -30 |
| s2_02 | s2_problem | hero | photo | candlelit_interior.jpg | 242 | 364 | 122 | 4.88 | zoom 1.10, pan +25 |
| s2_03 | s2_problem | hero | photo | gas_mantle_closeup.jpg | 364 | 486 | 122 | 4.88 | zoom 1.12, pan -20 |
| s2_04 | s2_problem | hero | photo | smoky_victorian_room.jpg | 486 | 608 | 122 | 4.88 | zoom 1.08, pan +30 |
| s2_05 | s2_problem | hero | photo | dark_factory_interior.jpg | 608 | 730 | 122 | 4.88 | zoom 1.10, pan -25 |
| s2_06 | s2_problem | hero | photo | empty_night_street.jpg | 730 | 852 | 122 | 4.88 | zoom 1.08, pan +20 |
| s2_07 | s2_problem | hero | photo | gas_street_lamps_row.jpg | 852 | 974 | 122 | 4.88 | zoom 1.10, pan -30 |
| s2_08 | s2_problem | lower_third | text | "Night was a barrier." | 974 | 985 | 11 | 0.44 | — |
| s2_09 | s2_problem | hero | photo | victorian_home_evening.jpg | 974 | 985 | 11 | 0.44 | zoom 1.08, pan +25 |
| s2_10 | s2_problem | hero | photo | transition_candle_to_darkness.jpg | 974 | 985 | 11 | 0.44 | zoom 1.12, pan 0 |
| s3_01 | s3_challenge | hero | photo | arc_lamp_street.jpg | 1005 | 1185 | 180 | 7.20 | zoom 1.08, pan -20 |
| s3_02 | s3_challenge | hero | photo | swan_lamp.jpg | 1185 | 1365 | 180 | 7.20 | zoom 1.10, pan +25 |
| s3_03 | s3_challenge | hero | photo | maxim_lamp.jpg | 1365 | 1545 | 180 | 7.20 | zoom 1.08, pan -15 |
| s3_04 | s3_challenge | graphic | animation | system_diagram | 1545 | 1725 | 180 | 7.20 | — |
| s3_04a–e | s3_challenge | graphic | graphic_subview | system_diagram_* | 1725 | 1905 | 180 | 7.20 | — |
| s3_05 | s3_challenge | hero | photo | edison_menlo_park_portrait.jpg | 1905 | 2085 | 180 | 7.20 | zoom 1.08, pan -15 |
| s3_06 | s3_challenge | hero | photo | early_generator.jpg | 2085 | 2265 | 180 | 7.20 | zoom 1.10, pan +20 |
| s3_07 | s3_challenge | hero | photo | wiring_installation.jpg | 2265 | 2445 | 180 | 7.20 | zoom 1.08, pan -25 |
| s3_08 | s3_challenge | hero | photo | edison_meter.jpg | 2265 | 2445 | 180 | 7.20 | zoom 1.12, pan +15 |
| s3_09 | s3_challenge | title | text | "He wasn't inventing a bulb.\nHe was inventing a system." | 2265 | 2445 | 180 | 7.20 | — |
| s3_10 | s3_challenge | graphic | animation | blueprint_to_reality | 2265 | 2445 | 180 | 7.20 | — |
| s4_01 | s4_demo | hero | photo | menlo_park_exterior_night.jpg | 2445 | 2603 | 158 | 6.32 | zoom 1.08, pan -30 |
| s4_02 | s4_demo | hero | photo | menlo_park_lamps_path.jpg | 2603 | 2761 | 158 | 6.32 | zoom 1.10, pan +25 |
| s4_03 | s4_demo | hero | photo | crowd_at_menlo_park.jpg | 2761 | 2919 | 158 | 6.32 | zoom 1.08, pan -20 |
| s4_04 | s4_demo | hero | photo | edison_at_demo.jpg | 2919 | 3077 | 158 | 6.32 | zoom 1.12, pan +15 |
| s4_05 | s4_demo | hero | photo | lamp_closeup_glowing.jpg | 3077 | 3235 | 158 | 6.32 | zoom 1.15, pan 0 |
| s4_06 | s4_demo | graphic | animation | newspaper_anim | 3235 | 3393 | 158 | 6.32 | — |
| s4_07 | s4_demo | hero | photo | menlo_park_lab_interior.jpg | 3393 | 3538 | 145 | 5.80 | zoom 1.08, pan -25 |
| s4_08 | s4_demo | hero | photo | electric_lamp_vs_gas_lamp.jpg | 3393 | 3538 | 145 | 5.80 | zoom 1.10, pan +20 |
| s4_09 | s4_demo | title | text | "Make people see it." | 3393 | 3538 | 145 | 5.80 | — |
| s4_10 | s4_demo | graphic | animation | orders_coming_in | 3393 | 3538 | 145 | 5.80 | — |
| s4_11 | s4_demo | hero | photo | victorian_house_electric.jpg | 3393 | 3538 | 145 | 5.80 | zoom 1.08, pan -15 |
| s5_01 | s5_system | graphic | animation | city_network | 3558 | 3726 | 168 | 6.72 | — |
| s5_01a–d | s5_system | graphic | graphic_subview | city_network_* | 3726 | 3894 | 168 | 6.72 | — |
| s5_02 | s5_system | hero | photo | merchants_safe_deposit.jpg | 3894 | 4062 | 168 | 6.72 | zoom 1.08, pan -20 |
| s5_03 | s5_system | hero | photo | early_electric_wiring.jpg | 4062 | 4230 | 168 | 6.72 | zoom 1.10, pan +25 |
| s5_04 | s5_system | hero | photo | edison_socket.jpg | 4230 | 4398 | 168 | 6.72 | zoom 1.12, pan -15 |
| s5_05 | s5_system | hero | photo | electric_meter_early.jpg | 4398 | 4566 | 168 | 6.72 | zoom 1.08, pan +20 |
| s5_06 | s5_system | title | text | "Sell the system.\nNot just the bulb." | 4566 | 4730 | 164 | 6.56 | — |
| s5_07 | s5_system | graphic | animation | infrastructure_iceberg | 4566 | 4730 | 164 | 6.56 | — |
| s5_08 | s5_system | hero | photo | edison_electric_light_co.jpg | 4566 | 4730 | 164 | 6.56 | zoom 1.08, pan -10 |
| s6_01 | s6_pearl | hero | photo | pearl_street_station_exterior.jpg | 4750 | 4940 | 190 | 7.60 | zoom 1.08, pan -30 |
| s6_02 | s6_pearl | hero | photo | jumbo_generator.jpg | 4940 | 5130 | 190 | 7.60 | zoom 1.12, pan +25 |
| s6_03 | s6_pearl | hero | photo | underground_conduits.jpg | 5130 | 5320 | 190 | 7.60 | zoom 1.10, pan -20 |
| s6_04 | s6_pearl | graphic | animation | pearl_street_network | 5320 | 5510 | 190 | 7.60 | — |
| s6_04a–c | s6_pearl | graphic | graphic_subview | pearl_* | 5510 | 5700 | 190 | 7.60 | — |
| s6_05 | s6_pearl | hero | photo | nyt_building_lit.jpg | 5700 | 5890 | 190 | 7.60 | zoom 1.08, pan +15 |
| s6_06 | s6_pearl | hero | photo | drexel_morgan_office.jpg | 5890 | 6069 | 179 | 7.16 | zoom 1.10, pan -25 |
| s6_07 | s6_pearl | hero | photo | nyse_trading_floor.jpg | 5890 | 6069 | 179 | 7.16 | zoom 1.08, pan +20 |
| s6_08 | s6_pearl | title | text | "The invention became a service." | 5890 | 6069 | 179 | 7.16 | — |
| s6_09 | s6_pearl | hero | photo | manhattan_electrified_map.jpg | 5890 | 6069 | 179 | 7.16 | zoom 1.12, pan 0 |
| s6_10 | s6_pearl | graphic | animation | city_electrifies_timelapse | 5890 | 6069 | 179 | 7.16 | — |
| s6_11 | s6_pearl | hero | photo | pearl_street_district.jpg | 5890 | 6069 | 179 | 7.16 | zoom 1.08, pan -15 |
| s7_01 | s7_lesson | graphic | animation | historical_to_modern_bridge | 6089 | 6279 | 190 | 7.60 | — |
| s7_02 | s7_lesson | hero | photo | telephone_exchange.jpg | 6279 | 6469 | 190 | 7.60 | zoom 1.08, pan -20 |
| s7_03 | s7_lesson | hero | photo | early_automobile_gas_station.jpg | 6469 | 6659 | 190 | 7.60 | zoom 1.10, pan +25 |
| s7_04 | s7_lesson | hero | photo | early_personal_computer.jpg | 6659 | 6849 | 190 | 7.60 | zoom 1.08, pan -15 |
| s7_05 | s7_lesson | hero | photo | ev_charging_station.jpg | 6849 | 7039 | 190 | 7.60 | zoom 1.12, pan +20 |
| s7_06 | s7_lesson | title | text | "Don't just sell the invention.\nBuild the environment." | 7039 | 7175 | 136 | 5.44 | — |
| s7_07 | s7_lesson | hero | photo | modern_data_center.jpg | 7039 | 7175 | 136 | 5.44 | zoom 1.08, pan -25 |
| s7_08 | s7_lesson | hero | photo | smartphone_ecosystem.jpg | 7039 | 7175 | 136 | 5.44 | zoom 1.10, pan +15 |
| s7_09 | s7_lesson | hero | photo | cloud_infrastructure.jpg | 7039 | 7175 | 136 | 5.44 | zoom 1.08, pan -20 |
| s8_01 | s8_ending | hero | photo | filament_glow.jpg | 7195 | 7335 | 140 | 5.60 | — |
| s8_02 | s8_ending | hero | photo | edison_portrait_final.jpg | 7335 | 7475 | 140 | 5.60 | — |
| s8_03 | s8_ending | hero | photo | modern_city_night.jpg | 7475 | 7575 | 100 | 4.00 | — |
| s8_04 | s8_ending | title_end | text | "The Bulb Wasn't Enough" | 7575 | 7648 | 73 | 2.92 | — |

**Total frames: 7648 = 305.92s (5:05.92)**

---

## 3. Asset / Source List (Swappable by Filename)

All assets live in `public/edison/` — drop a real `.jpg`/`.png`/`.webp` with the matching filename to override the procedural plate. Run `npm run edison:manifest` to refresh the manifest.

| Filename | Type | Status | Source / Notes |
|----------|------|--------|----------------|
| 19thc_street_gaslamps.jpg | photo | procedural | London gaslit street, c.1880 |
| candlelit_interior.jpg | photo | procedural | Victorian parlor interior |
| gas_mantle_closeup.jpg | photo | procedural | Welsbach mantle detail |
| smoky_victorian_room.jpg | photo | procedural | Smoke-stained ceiling, gaslight |
| dark_factory_interior.jpg | photo | procedural | Textile mill at dusk |
| empty_night_street.jpg | photo | procedural | Cobblestones, fog, no lamps |
| gas_street_lamps_row.jpg | photo | procedural | Row of standards, Westminster |
| victorian_home_evening.jpg | photo | procedural | Family by gasolier |
| transition_candle_to_darkness.jpg | photo | procedural | Match-cut concept frame |
| arc_lamp_street.jpg | photo | procedural | Yablochkov candles, Paris 1878 |
| swan_lamp.jpg | photo | procedural | Joseph Swan's carbon filament, 1878 |
| maxim_lamp.jpg | photo | procedural | Hiram Maxim's competing lamp |
| edison_menlo_park_portrait.jpg | photo | procedural | Edison at Menlo Park, c.1880 |
| early_generator.jpg | photo | procedural | Edison "Jumbo" dynamo |
| wiring_installation.jpg | photo | procedural | Knob-and-tube wiring crew |
| edison_meter.jpg | photo | procedural | Edison chemical meter |
| menlo_park_exterior_night.jpg | photo | procedural | Lab complex illuminated, 12/31/1879 |
| menlo_park_lamps_path.jpg | photo | procedural | Lamp-lit walkway to lab |
| crowd_at_menlo_park.jpg | photo | procedural | 3,000 visitors, NYT sketch |
| edison_at_demo.jpg | photo | procedural | Edison demonstrating bulb |
| lamp_closeup_glowing.jpg | photo | procedural | Carbon filament at full brightness |
| menlo_park_lab_interior.jpg | photo | procedural | Workbench, vacuum pumps, glassblowing |
| electric_lamp_vs_gas_lamp.jpg | photo | procedural | Side-by-side comparison |
| victorian_house_electric.jpg | photo | procedural | First residential installation |
| merchants_safe_deposit.jpg | photo | procedural | First commercial customer |
| early_electric_wiring.jpg | photo | procedural | Cleat wiring, cotton insulation |
| edison_socket.jpg | photo | procedural | Edison screw base patent drawing |
| electric_meter_early.jpg | photo | procedural | Chemical meter, billing basis |
| edison_electric_light_co.jpg | photo | procedural | Pearl St. headquarters façade |
| pearl_street_station_exterior.jpg | photo | procedural | 255–257 Pearl St., 1882 |
| jumbo_generator.jpg | photo | procedural | 125kW "Jumbo" dynamo ×6 |
| underground_conduits.jpg | photo | procedural | Trenching Broadway, 1882 |
| nyt_building_lit.jpg | photo | procedural | "New York Times" building, first lit |
| drexel_morgan_office.jpg | photo | procedural | J.P. Morgan's office, electric light |
| nyse_trading_floor.jpg | photo | procedural | Stock exchange under arc/incandescent |
| manhattan_electrified_map.jpg | photo | procedural | Electrified district expansion map |
| pearl_street_district.jpg | photo | procedural | Aerial view of lit district |
| telephone_exchange.jpg | photo | procedural | Switchboard operators, c.1900 |
| early_automobile_gas_station.jpg | photo | procedural | Curbside pump, 1910s |
| early_personal_computer.jpg | photo | procedural | Altair 8800 / Apple I |
| ev_charging_station.jpg | photo | procedural | Modern DC fast charger |
| modern_data_center.jpg | photo | procedural | Server hall, fiber bundles |
| smartphone_ecosystem.jpg | photo | procedural | App store / device cloud |
| cloud_infrastructure.jpg | photo | procedural | Subsea cable / data center |
| filament_glow.jpg | photo | procedural | Closeup filament, amber |
| edison_portrait_final.jpg | photo | procedural | Mature Edison, thoughtful |
| modern_city_night.jpg | photo | procedural | Manhattan nightscape, 2020s |

**Animations / Graphics (code-generated, not file-based):**
- `filament_draw` — SVG filament coil growth (TitleScene)
- `system_diagram` + subviews — React component (S3_ChallengeScene)
- `blueprint_to_reality` — Animated transition (S3)
- `newspaper_anim` — Headline reveal (S4)
- `orders_coming_in` — Telegram animation (S4)
- `city_network` + subviews — Network graph (S5)
- `infrastructure_iceberg` — Tip/iceberg visual (S5)
- `pearl_street_network` + subviews — Generator/wires/buildings (S6)
- `city_electrifies_timelapse` — Map progression (S6)
- `historical_to_modern_bridge` — Morph timeline (S7)

---

## 4. Music & SFX List

| Asset | File | Role | Volume | Timing |
|-------|------|------|--------|--------|
| Background music | `public/edison/music/background.mp3` | Continuous bed | 0.16 | 0:00–5:06 (fade-in 2.5s, fade-out 3s) |
| Whoosh SFX | `public/edison/sfx/whoosh.wav` | Chapter transitions | 0.35 | 7 boundaries (see timeline) |

**Chapter-boundary whoosh times (ms from 0:00):**
1. 4,000 — title → act1
2. 40,200 — act1 → act2
3. 97,800 — act2 → act3a
4. 142,320 — act3a → act3b
5. 190,000 — act3b → act4
6. 243,560 — act4 → act5
7. 287,800 — act5 → act6 (end card)

**Music credit (placeholder — replace with licensed track):**
> "Lightless Dawn" by Kevin MacLeod (incompetech.com)
> Licensed under Creative Commons: By Attribution 4.0
> **Replace with a properly licensed cinematic amber/orchestral track for commercial release.**

---

## 5. Credits & Source Information

### Production
- **Concept / Direction / Edit:** Automated Remotion pipeline (documentary-factory)
- **Script & Research:** AI-assisted (Claude + Wikipedia + historical sources)
- **Narration:** edge-tts `en-US-ChristopherNeural` at -8% rate
- **Visuals:** Hybrid — procedural archival plates (FNV-1a deterministic) + swap-in historical photographs
- **Animations:** Code-generated (React + Remotion springs/beziers)
- **Color Grade:** Edison-amber palette (ink #1A130B, parchment #F5E6CC, filament #FFB347, brass #B8860B, amber #8B5E3C)
- **Texture:** Animated film grain + vignette overlay
- **Render:** Remotion v4, 25fps, 1280×720, H.264 High Profile, --concurrency=2

### Historical Sources
- **Wikipedia:** Thomas Edison, War of Currents, Pearl Street Station, Incandescent light bulb, Edison Electric Light Company
- **Edison Papers (Rutgers):** Menlo Park notebooks, Pearl Street reports
- **IEEE Global History Network:** "Edison's Electric Lighting System"
- **Library of Congress:** Edison Manufacturing Co. catalogs, 1880s promotional photos
- **New York Times Archive:** "A New Light" (Sep 5, 1882), "Edison's Electric Light" (Dec 31, 1879)

### Technical Stack
- **Remotion** v4.0.507 — programmatic video
- **React** 19 — component composition
- **TypeScript** 5.5 — type-safe timeline
- **FFmpeg** — frame-extract QC, loudnorm mix
- **edge-tts** — narration synthesis
- **rclone** — Google Drive mirror (optional)

### License
- **Code:** MIT (this repository)
- **Music:** Replace placeholder with licensed track before publication
- **Historical images:** Public domain (pre-1929) or CC-BY where noted — verify each swap-in
- **Narration (TTS):** Microsoft edge-tts terms apply

---

## 6. Final Outputs (Generated)

| File | Description | Size (est.) |
|------|-------------|-------------|
| `output/edison.mp4` | Master render (video + baked audio) | ~300–500 MB |
| `output/edison_youtube.mp4` | YouTube-loudness mix (-14 LUFS, AAC 192k, faststart) | ~200–400 MB |
| `output/qc/*.png` | Frame-extract QC frames (37 frames + contact sheet) | ~20 MB |
| `output/edison-frame.png` | Still at frame 100 (title card) | ~500 KB |
| `src/data/edison-asset-manifest.ts` | Auto-generated asset manifest (Set of filenames) | ~2 KB |

---

## 7. Re-Render / Swap Workflow

```bash
# 1. Drop real images into public/edison/ (matching filenames above)
# 2. Refresh manifest
npm run edison:manifest

# 3. Preview render (fast, half-res)
npm run build:edison:preview

# 4. Full master render
npm run build:edison

# 5. QC frame extract
npm run qc:edison

# 6. YouTube loudness mix
npm run mix:edison

# 7. Deliverables in output/ + docs/EDISON_DELIVERABLES.md
```

---

*Generated: 2026-08-14 | Pipeline v1.0 | Remotion 4.0.507*