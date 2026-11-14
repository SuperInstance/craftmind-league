import json, time, math, os
PULSE = "/home/caseydigennaro/craftmind-league/pulse"
TRUNKS = [(60,-90),(61,-80),(62,-87),(64,-75),(66,-97),(68,-86),(68,-91),(69,-80),(71,-76),(73,-91),(73,-96),(76,-79),(77,-84),(79,-76),(80,-79),(80,-96),(84,-89)]
out = open(os.path.join(PULSE, "prep-watch.jsonl"), "a", buffering=1)
consec = 0
while True:
    try:
        st = json.load(open(os.path.join(PULSE, "cody-state.json")))
        p = st["pos"]; x, y, z = p["x"], p["y"], p["z"]
        outof = (x < 69) or (z < -90) or (y >= 67)
        dmin = min(math.hypot(x-tx, z-tz) for tx, tz in TRUNKS)
        trig = outof and dmin <= 32
        consec = consec + 1 if trig else 0
        out.write(json.dumps({"ts": st["ts"], "pos": p, "deaths": st.get("deaths"), "outOfHollow": outof, "nearestTree": round(dmin,1), "trigger": trig, "consec": consec}) + "\n")
        if consec >= 2:
            out.write(json.dumps({"event": "TRIGGER-FIRED", "pos": p}) + "\n")
            break
    except Exception as e:
        out.write(json.dumps({"error": str(e)}) + "\n")
    time.sleep(20)
