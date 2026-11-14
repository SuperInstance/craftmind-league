#!/bin/bash
# sequence: stand-in first (chunks), op bot 9 s later (ops + tps the
# test body), test body 18 s in — mirrors the fleet's join-throttle
# discipline (bodies join staggered, never same-second).
cd /home/caseydigennaro/craftmind-league/pulse || exit 1
NM=/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node
$NM map-standin.js > fell-standin.log 2>&1 &
SPID=$!
sleep 9
$NM map-opbot-fell.js > fell-opbot.log 2>&1 &
OPID=$!
sleep 9
$NM test-fell-day5.js > fell-test.log 2>&1
wait $OPID
wait $SPID
echo "fell sequence done"
