#!/bin/bash
cd /home/caseydigennaro/craftmind-league/pulse || exit 1
NM=/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node
$NM map-standin.js > dbg-standin.log 2>&1 &
SPID=$!
sleep 9
$NM map-opbot-fell.js > dbg-opbot.log 2>&1 &
OPID=$!
sleep 9
$NM debug-fell.js > dbg-test.log 2>&1
wait $OPID
wait $SPID
echo "debug sequence done"
