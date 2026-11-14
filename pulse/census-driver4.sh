#!/bin/bash
cd ~/craftmind-league/pulse
export PATH=$HOME/.nvm/versions/node/v22.23.4/bin:$PATH
node map-driver4c.js > map-driver4-run.log 2>&1
echo driver-done
