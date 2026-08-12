#!/usr/bin/env bash
#
# Phase 3 — YouTube-ready audio mix for a Remotion-rendered documentary.
#
# Takes the Remotion master render (video + voiceover), adds a background music
# bed ducked under the voiceover, places whoosh SFX at segment transitions,
# applies YouTube loudness (-14 LUFS, linear two-pass loudnorm), and re-encodes
# audio as AAC 48kHz stereo while COPYING the video stream (no generational loss).
#
# Usage:
#   ./mix_youtube.sh <master.mp4> <music.mp3> <whoosh.wav> <out.mp4> [workdir]
#
# Transition timestamps (seconds) default to the Steve Jobs layout
# (30fps, 90-frame title + end cards); override via SFX_TIMES env var.
#
# Music: "Lightless Dawn" by Kevin MacLeod (incompetech.com)
#        Licensed under Creative Commons: By Attribution 4.0
set -euo pipefail

MASTER="${1:?master.mp4 required}"
MUSIC="${2:?music.mp3 required}"
WHOOSH="${3:?whoosh.wav required}"
OUT="${4:?out.mp4 required}"
WORK="${5:-$(mktemp -d)}"

# Segment boundaries in the 30fps timeline: 8 transitions (title->seg1, seg1->seg2 ... seg7->end)
SFX_TIMES="${SFX_TIMES:-3000 15900 30633 58433 86433 111900 136533 161933}"  # ms
DURATION="${DURATION:-164.9}"  # video length in seconds

mkdir -p "$WORK"

echo "▶ Building SFX track ($(echo $SFX_TIMES | wc -w) whooshes)..."
SPLIT_IN="[0:a]aformat=channel_layouts=stereo,asplit=$(echo $SFX_TIMES | wc -w)"
ADELAY=""
AMIX_IN=""
i=0
for t in $SFX_TIMES; do
  SPLIT_IN+="[s$i]"
  ADELAY+="[s$i]adelay=${t}|${t}[d$i];"
  AMIX_IN+="[d$i]"
  i=$((i+1))
done
ffmpeg -y -i "$WHOOSH" -filter_complex \
  "${SPLIT_IN};${ADELAY}${AMIX_IN}amix=inputs=${i}:normalize=0:dropout_transition=0,atrim=0:${DURATION}[aout]" \
  -map "[aout]" -c:a pcm_s16le "$WORK/sfx_mix.wav"

echo "▶ Mixing music (ducked) + SFX + voiceover, copying video stream..."
ffmpeg -y -i "$MASTER" -i "$MUSIC" -i "$WORK/sfx_mix.wav" -filter_complex \
  "[1:a]atrim=0:${DURATION},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=2.5,afade=t=out:st=$(( ${DURATION%.*} - 3 )):d=3,volume=0.35[mus];[2:a]volume=1.6[sfx];[mus][0:a]sidechaincompress=threshold=0.02:ratio=12:attack=20:release=300:makeup=1.6[duck];[duck][sfx][0:a]amix=inputs=3:duration=first:dropout_transition=0:normalize=0[mix]" \
  -map 0:v -map "[mix]" -c:v copy -c:a pcm_s16le "$WORK/mixed.mp4"

echo "▶ Measuring loudness..."
MEASURE=$(ffmpeg -i "$WORK/mixed.mp4" -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 \
  | grep -oE '"input_[itlr][a-z]*" *: *"[^"]+"' || true)
I_I=$(echo "$MEASURE" | grep input_i   | grep -oE '\-[0-9.]+')
I_TP=$(echo "$MEASURE" | grep input_tp  | grep -oE '\-[0-9.]+')
I_LRA=$(echo "$MEASURE" | grep input_lra | grep -oE '[0-9.]+')
I_TH=$(echo "$MEASURE" | grep input_thresh | grep -oE '\-[0-9.]+')
echo "   measured: I=$I_I TP=$I_TP LRA=$I_LRA thresh=$I_TH"

echo "▶ Applying linear loudnorm (-14 LUFS) + AAC 48k, copying video..."
# Render to a LOCAL temp file first — `-movflags +faststart` needs to seek back
# in the output, which rclone/gdrive FUSE mounts don't support ("Illegal seek").
ffmpeg -y -i "$WORK/mixed.mp4" -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=${I_I}:measured_TP=${I_TP}:measured_LRA=${I_LRA}:measured_thresh=${I_TH}:offset=0" \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$WORK/final.mp4"

echo "▶ Publishing to: $OUT"
if command -v rclone >/dev/null 2>&1 && [[ "$OUT" == "$HOME/gdrive/"* ]]; then
  # Prefer rclone copyto for FUSE-mount reliability, deriving gdrive: from the path
  rclone copyto "$WORK/final.mp4" "gdrive:${OUT#$HOME/gdrive/}" -v 2>/dev/null || cp "$WORK/final.mp4" "$OUT"
else
  cp "$WORK/final.mp4" "$OUT"
fi

echo "▶ Done: $OUT"
# Verify the LOCAL final — byte-identical to what was published; the FUSE mount
# may lag behind a direct rclone write, so don't probe the mount path.
ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$WORK/final.mp4"
