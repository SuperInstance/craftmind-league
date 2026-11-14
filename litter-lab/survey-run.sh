#!/bin/bash
# Supervisor for survey.js: relaunch under a fresh probe name whenever
# the probe wedges (exit 5) or dies out, until >=24 cells are measured
# or the launch budget (8) is spent. Progress persists in
# results/survey.jsonl across launches.
cd "$(dirname "$0")"
NODE=/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node
for i in 1 2 3 4 5 6 7 8; do
  n=$(grep -c '"passOutcome"' results/survey.jsonl 2>/dev/null || echo 0)
  if [ "$n" -ge 20 ]; then echo "supervisor: $n cells measured — done"; exit 0; fi
  name="LitterLab$((1000 + RANDOM % 9000))"
  echo "supervisor: launch $i as $name (measured so far: $n)"
  LITTER_USER=$name $NODE survey.js >> results/survey.log 2>&1
  echo "supervisor: $name exited code $?"
  sleep 3
done
n=$(grep -c '"passOutcome"' results/survey.jsonl 2>/dev/null || echo 0)
echo "supervisor: launch budget spent, measured=$n"
