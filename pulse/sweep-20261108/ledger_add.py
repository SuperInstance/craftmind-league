#!/usr/bin/env python3
"""Append one entry to the pulse ledger. Args: kind id class whatfile"""
import sys, json, datetime
kind, eid, eclass, whatfile = sys.argv[1:5]
what = open(whatfile).read().strip()
entry = {'ts': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
         'kind': kind, 'id': eid, 'class': eclass, 'what': what}
with open('/home/caseydigennaro/craftmind-league/pulse/ledger.jsonl', 'a') as f:
    f.write(json.dumps(entry) + '\n')
print('appended', entry['ts'], eid)
