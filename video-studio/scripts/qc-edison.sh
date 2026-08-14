#!/usr/bin/env bash
# qc-edison.sh — frame-extract QC for the Edison master render
# Mirrors the mandatory pipeline: Render → ffmpeg frame-extract QC → fix → re-render
#
# Pulls representative frames from each segment + chapter boundaries,
# then mosaics a contact sheet so we can eyeball the whole 305s film at once.
set -euo pipefail

INPUT="${1:-output/edison.mp4}"
OUTDIR="${2:-output/qc}"
FPS=25

mkdir -p "$OUTDIR"

if [[ ! -f "$INPUT" ]]; then
  echo "✗ Master not found: $INPUT"
  exit 1
fi

echo "▸ Probing $INPUT ..."
ffprobe -v error -show_entries format=duration,bit_rate -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,channels -of default=noprint_wrappers=1 "$INPUT"

# Segment frame boundaries (from edison-script.ts)
# id            startFrame  endFrame
# s1_title      0           100
# s2_problem     120         985
# s3_challenge   1005        2425
# s4_demo        2445        3538
# s5_system      3558        4730
# s6_pearl      4750         6069
# s7_lesson     6089         7175
# s8_ending     7195         7648
#
# Chapter (whoosh) boundaries: 100, 985, 2425, 3538, 4730, 6069, 7175

# Sample one frame near the START and one near the END of each segment.
# Using +5 / -5 to dodge exact cut boundaries.
declare -a SAMPLES=(
  "s1_start=5"       "s1_mid=50"      "s1_end=95"
  "s2_start=125"    "s2_mid=550"     "s2_end=980"
  "s3_start=1010"   "s3_mid=1700"    "s3_end=2420"
  "s4_start=2450"   "s4_mid=2990"    "s4_end=3533"
  "s5_start=3563"   "s5_mid=4140"    "s5_end=4725"
  "s6_start=4755"   "s6_mid=5400"    "s6_end=6064"
  "s7_start=6094"   "s7_mid=6630"    "s7_end=7170"
  "s8_start=7200"   "s8_mid=7420"    "s8_end=7643"
)

echo "▸ Extracting per-segment QC frames ..."
for entry in "${SAMPLES[@]}"; do
  name="${entry%%=*}"
  frame="${entry##*=}"
  ts=$(awk "BEGIN{printf \"%.3f\", ${frame}/${FPS}}")
  ffmpeg -v error -y -ss "$ts" -i "$INPUT" -frames:v 1 \
    "$OUTDIR/qc-${name}-f${frame}.png"
  echo "  ✓ $name (f$frame, ${ts}s)"
done

# Chapter-boundary frames (the whoosh transitions) — extract just before the cut
echo "▸ Extracting chapter-boundary frames ..."
declare -a BOUNDS=(100 985 2425 3538 4730 6069 7175)
for i in "${!BOUNDS[@]}"; do
  b="${BOUNDS[$i]}"
  frame=$((b - 3))
  ts=$(awk "BEGIN{printf \"%.3f\", ${frame}/${FPS}}")
  ffmpeg -v error -y -ss "$ts" -i "$INPUT" -frames:v 1 \
    "$OUTDIR/qc-boundary${i}_f${frame}.png"
  echo "  ✓ boundary${i} (f$frame, ${ts}s)"
done

# Contact sheet: montage all extracted frames into a single grid if imagemagick exists
if command -v montage >/dev/null 2>&1; then
  echo "▸ Building contact sheet ..."
  montage "$OUTDIR"/qc-*.png -tile 5x5 -geometry 320x180+4+4 -background "#1A130B" \
    -label '%t' -fill "#F5E6CC" -pointsize 9 "$OUTDIR/qc-contact-sheet.jpg"
  echo "  ✓ $OUTDIR/qc-contact-sheet.jpg"
else
  echo "  (imagemagick 'montage' not installed — skipping contact sheet)"
fi

echo "▸ QC complete. $(ls -1 "$OUTDIR" | wc -l) files in $OUTDIR"
