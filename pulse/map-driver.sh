#!/bin/bash
# Run node scripts from Thor-side staged copies with Thor's node.
cd /home/caseydigennaro/craftmind-league/pulse || exit 1
exec /home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node map-driver.js
