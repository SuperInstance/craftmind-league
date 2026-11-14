#!/usr/bin/env python3
"""codyctl — process-level control of the resident Cody (pulse scaffold).
Usage: codyctl.py status | stop | start [skillsCsv] [stage]
Matches processes whose argv[1] ends with resident-cody.js exactly —
immune to the wrapper-matching footgun of pgrep -f."""
import os, signal, subprocess, sys, time

NODE = "/home/caseydigennaro/.nvm/versions/node/v22.23.4/bin/node"
RES_DIR = "/home/caseydigennaro/craftmind-league/bots/runs/cody"
LOG = "/home/caseydigennaro/craftmind-league/logs/resident-cody.log"

def cody_pids():
    out = []
    for pid in os.listdir("/proc"):
        if not pid.isdigit():
            continue
        try:
            with open(f"/proc/{pid}/cmdline", "rb") as f:
                parts = f.read().split(b"\0")
            args = [p.decode("utf-8", "replace") for p in parts if p]
            if len(args) >= 2 and args[1].endswith("resident-cody.js"):
                out.append(int(pid))
        except OSError:
            pass
    return out

def status():
    pids = cody_pids()
    print("cody pids:", pids)
    return pids

def stop():
    for pid in cody_pids():
        os.kill(pid, signal.SIGTERM)
        print("SIGTERM ->", pid)
    for _ in range(20):
        if not cody_pids():
            print("stopped")
            return
        time.sleep(0.5)
    print("still alive:", cody_pids())

def start(skills="", stage=""):
    env = dict(os.environ)
    if skills:
        env["PULSE_SKILLS"] = skills
    if stage:
        env["PULSE_STAGE"] = stage
    logf = open(LOG, "ab")
    p = subprocess.Popen([NODE, "resident-cody.js"], cwd=RES_DIR, env=env,
                         stdout=logf, stderr=subprocess.STDOUT,
                         stdin=subprocess.DEVNULL, start_new_session=True)
    print("launched pid", p.pid)

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    if cmd == "status":
        status()
    elif cmd == "stop":
        stop()
    elif cmd == "start":
        start(sys.argv[2] if len(sys.argv) > 2 else "", sys.argv[3] if len(sys.argv) > 3 else "")
