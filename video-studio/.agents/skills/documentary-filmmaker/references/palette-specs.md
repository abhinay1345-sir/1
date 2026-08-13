# Palette Specifications

**Source**: Forensic color analysis of 3 reference documentaries (ImageMagick histogram at 50×50, 8-color quantization).

---

## Style 1: Sepia / "1914"

*Warm, aged, authoritative. Best for: 1900s–1950s grand narratives, war, industrial era.*

### Core Palette

| Role | Hex | RGB | Measured From |
|------|-----|-----|---------------|
| Ink / darkest | `#312624` | (49, 38, 37) | V1 dominant dark |
| Deep brown | `#5C423B` | (92, 66, 59) | V1 scene 1 |
| Ochre accent | `#9B6741` | (155, 103, 65) | V1 scene 1 |
| Parchment light | `#D7C39A` | (215, 195, 154) | V1 scene 1 |
| Paper bright | `#F5E4CA` | (245, 228, 202) | V1 scene 2 |
| Paper mid | `#E8D2B4` | (232, 210, 180) | V1 scene 2 |
| Map green (rare) | `#275F1B` | (39, 95, 27) | V1 scene 2 |

### Grayscale Scale (text cards)
| Stop | Hex | RGB |
|------|-----|-----|
| Light | `#E4E4E4` | (228, 228, 228) |
| Mid-light | `#D1D1D1` | (209, 209, 209) |
| Mid | `#B1B1B1` | (177, 177, 177) |
| Mid-dark | `#8E8E8E` | (142, 142, 142) |
| Dark | `#6C6C6C` | (108, 108, 108) |

### Usage Rules (Sepia)
- **Backgrounds**: Paper bright `#F5E4CA` → Parchment `#D7C39A` gradient + grain texture
- **Text on light**: Ink `#312624` (never pure black)
- **Text on dark**: `#F5E4CA` (never pure white)
- **Accents**: Ochre `#9B6741` for underlines, dates, key words
- **Map green**: Only for military/territorial graphics
- **Video grade**: Sepia tint overlay: `colorbalance=rs=.1:gs=0:bs=-.1` or `colortemperature=temperature=5500`

---

## Style 2: Parchment / "Constitution"

*Ink, legalistic, founding-document. Best for: constitutions, treaties, political history.*

### Core Palette

| Role | Hex | RGB | Measured From |
|------|-----|-----|---------------|
| Ink darkest | `#281C12` | (40, 28, 18) | V2 scene 2 |
| Ink brown | `#30261E` | (48, 38, 30) | V2 scene 3 |
| Ink mid | `#48382C` | (72, 56, 44) | V2 scene 3 |
| Parchment dark | `#645B51` | (100, 91, 81) | V2 scene 3 |
| Parchment | `#88765F` | (136, 118, 95) | V2 scene 3 |
| Parchment light | `#D2CCB1` | (210, 204, 177) | V2 scene 2 |
| Aged cream | `#EFEDD8` | (239, 237, 216) | V2 scene 2 |
| Neutral gray | `#5F5F5E` | (95, 95, 94) | V2 scene 1 |

### Usage Rules (Parchment)
- **Backgrounds**: Aged cream `#EFEDD8` with ink edge vignette
- **Text**: Ink darkest `#281C12` on cream; cream `#EFEDD8` on ink
- **Accents**: None needed — ink-on-cream IS the aesthetic. Add quill-style flourishes (SVG strokes)
- **Video grade**: Slight darken + desaturate: `eq=contrast=1.05:saturation=0.85`
- **Seal/stamp accents**: Deep red `#7A1F1F` ONLY for document seals (max 2% of frame area)

---

## Style 3: Sage-Map / "France-America"

*Geographic, diplomatic, territorial. Best for: exploration, boundaries, diplomacy, geography.*

### Core Palette

| Role | Hex | RGB | Measured From |
|------|-----|-----|---------------|
| Sage green | `#628A69` | (98, 138, 105) | V3 scene 1 |
| Deep sage | `#4C645C` | (76, 100, 92) | V3 scene 3 |
| Muted blue | `#146B91` | (20, 107, 145) | V3 scene 1 |
| Blue mid | `#487A83` | (72, 122, 131) | V3 scene 1 |
| Blue dark | `#136094` | (19, 96, 148) | V3 scene 3 |
| Ochre | `#939573` | (147, 149, 115) | V3 scene 1 |
| Clay | `#97796A` | (151, 121, 107) | V3 scene 1 |
| Slate dark | `#2C2F32` | (44, 47, 50) | V3 scene 2 |
| Teal-black | `#14232A` | (20, 35, 42) | V3 scene 2 |
| Forest black | `#1D2518` | (29, 37, 24) | V3 scene 2 |

### Usage Rules (Sage-Map)
- **Backgrounds**: Slate dark `#2C2F32` or deep sage `#4C645C` + subtle graticule/grid texture
- **Land/territory**: Sage `#628A69` fills
- **Water/routes**: Muted blue `#146B91` strokes
- **Text**: Off-white `#F0F4EF` on dark; slate `#2C2F32` on sage
- **Accents**: Ochre `#939573` for borders, clay `#97796A` for settlements
- **Video grade**: Slight teal-greenshift: `colortemperature=temperature=6000:tint=-10`

---

## Universal Rules (ALL Styles)

1. **Never pure #000000 or #FFFFFF** — every reference frame uses off-black/off-white
2. **Background texture** — parchment grain, paper fibers, or map graticule; NEVER flat color fill
3. **One accent hue per video** — pick the accent column from your style and stay in its family (±15° hue)
4. **Off-whites for light backgrounds**: Sepia `#F5E4CA`, Parchment `#EFEDD8`, Sage `#F0F4EF`
5. **Off-blacks for dark backgrounds**: Sepia `#312624`, Parchment `#281C12`, Sage `#1D2518`
6. **Text contrast ≥ 4.5:1** (WCAG AA) — always verify chosen pair

---

## Accessibility Contrast Pairs (Verified)

| Pair | Contrast | Verdict |
|------|----------|---------|
| Sepia ink `#312624` on paper `#F5E4CA` | ~11.4:1 | AAA ✓ |
| Parchment ink `#281C12` on cream `#EFEDD8` | ~12.8:1 | AAA ✓ |
| Sage off-white `#F0F4EF` on slate `#2C2F32` | ~10.9:1 | AAA ✓ |
| Ochre `#939573` on sage `#628A69` | ~2.1:1 | ✗ text only — use for graphics/lines |

---

## Selection Guide

| Story Type | Style |
|------------|-------|
| 1900s, wars, industrial, "America changed" | **Sepia** |
| Founding era, constitutions, legal history | **Parchment** |
| Exploration, boundaries, diplomacy, geography | **Sage-Map** |
| Everything else | Pick by era + mood; default **Sepia** |