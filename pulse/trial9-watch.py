import json, time, math, os, sys
PULSE = "/home/caseydigennaro/craftmind-league/pulse"
OUT = os.path.join(PULSE, "trial9-watch.jsonl")
SPAWN_X, SPAWN_Z = 32, -96
out = open(OUT, "a", buffering=1)
consec = 0
deaths_seen = None
start = time.time()
out.write(json.dumps({"event":"WATCH-START","ts":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})+"\n")
while time.time() - start < 8*3600:
    try:
        st = json.load(open(os.path.join(PULSE, "cody-state.json")))
        ev = json.load(open(os.path.join(PULSE, "evidence.json")))
        p = st["pos"]; x, y, z = p["x"], p["y"], p["z"]
        hp = st.get("health"); deaths = st.get("deaths")
        if deaths_seen is None: deaths_seen = deaths
        new_death = deaths is not None and deaths > deaths_seen
        if new_death: deaths_seen = deaths
        cheb = max(abs(x - SPAWN_X), abs(z - SPAWN_Z))
        logs = ev.get("nearestLogs") or []
        dlog = None; nearest = None
        for L in logs:
            d = math.hypot(x - L["x"], z - L["z"])
            if dlog is None or d < dlog: dlog, nearest = d, L
        fresh = abs(time.time() - time.mktime(time.strptime(st["ts"], "%Y-%m-%dT%H:%M:%S.%fZ")) - time.timezone) < 40 if False else True
        outside = cheb > 18
        tree_ok = dlog is not None and dlog <= 32
        hp_ok = (hp == 20)
        calm = hp_ok and not new_death
        trig = outside and tree_ok and calm
        consec = consec + 1 if trig else 0
        rec = {"ts": st["ts"], "pos": p, "hp": hp, "food": st.get("food"), "deaths": deaths,
               "cheb": round(cheb,1), "nearestLogXZ": (round(dlog,1) if dlog is not None else None),
               "nearestLog": nearest, "outside": outside, "treeOk": tree_ok, "calm": calm,
               "trigger": trig, "consec": consec, "newDeath": bool(new_death), "tod": st.get("timeOfDay")}
        out.write(json.dumps(rec)+"\n")
        if new_death:
            out.write(json.dumps({"event":"DEATH-DURING-WATCH","ts":st["ts"],"deaths":deaths,"pos":p})+"\n")
        if consec >= 2:
            out.write(json.dumps({"event":"TRIGGER-FIRED","ts":st["ts"],"pos":p,"hp":hp,"cheb":round(cheb,1),"nearestLogXZ":round(dlog,1),"nearestLog":nearest})+"\n")
            print("TRIGGER-FIRED", json.dumps(rec)); sys.exit(0)
    except Exception as e:
        out.write(json.dumps({"error": str(e)})+"\n")
    time.sleep(10)
out.write(json.dumps({"event":"WATCH-TIMEOUT"})+"\n")
print("WATCH-TIMEOUT")
