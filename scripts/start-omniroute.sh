#!/usr/bin/env bash
set -euo pipefail

# Safe wrapper to start omniroute only when port 20128 is free.
# If an old omniroute process remains, it is stopped before restart.
PORT=20128
GRACE_PERIOD=5

find_owner_pid() {
  ss -ltnp 2>/dev/null | awk -v port=":${PORT}" '$4 ~ port && $0 ~ /omniroute/ { for (i=1;i<=NF;i++) if ($i ~ /pid=/) { gsub(/pid=|,/,"",$i); print $i; exit } }'
}

stop_process() {
  local pid="$1"
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping stale omniroute process: PID=$pid"
    kill "$pid" 2>/dev/null || true

    for i in $(seq 1 "$GRACE_PERIOD"); do
      if ! kill -0 "$pid" 2>/dev/null; then
        return 0
      fi
      sleep 1
    done

    echo "PID=$pid did not exit after SIGTERM, sending SIGKILL"
    kill -9 "$pid" 2>/dev/null || true
  fi
}

OWNER_PID=$(find_owner_pid)
if [[ -n "$OWNER_PID" ]]; then
  echo "Found existing omniroute process on port ${PORT}: PID=$OWNER_PID"
  stop_process "$OWNER_PID"
fi

# double-check no one else is bound to the port
PORT_OWNER=$(ss -ltnp 2>/dev/null | awk -v port=":${PORT}" '$4 ~ port { print $0 }')
if [[ -n "$PORT_OWNER" ]]; then
  echo "ERROR: port ${PORT} is still in use after stopping stale process:"
  echo "$PORT_OWNER"
  exit 1
fi

cleanup() {
  if [[ -n "${OMNI_PID:-}" ]]; then
    echo "Shutting down omniroute (PID=${OMNI_PID})..."
    kill -TERM "$OMNI_PID" 2>/dev/null || true
    wait "$OMNI_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT SIGINT SIGTERM

echo "Starting omniroute on port ${PORT}..."
omniroute --log &
OMNI_PID=$!
wait "$OMNI_PID"
exit $?
