# CAMERAMAN FIXTARGET LANE — NEGATIVE FILING (2026-11-09, Orin)

Charter: one mechanism — window targeting by client identity — to restore the
cameraman's typed channel after the day-9 rejoin. RESULT: NEGATIVE. The
mechanism was applied, tested live, failed, and has been fully reverted.
Cameraman remains PARKED (STOP present, no process), running the ORIGINAL
cameraman.py (md5 27aaa066d5549c7390a0ffc4c39a3d93, byte-identical to the
pre-lane backup cameraman.py.pre-fixtarget-20261109, which is retained on the
Orin in ~/cameraman/). Daylight hold remains with the op-channel hold-keeper
(last Gallery landing 19:47:55Z at filing). MagnusandMouse never left the
world (joined 19:35:06Z, still in at filing). No citizen woken, no saves
touched, no client relaunch.

## 1. Two-window hypothesis: CONFIRMED as geometry, REFUTED as mechanism

Window enumeration (DISPLAY :0, 2026-11-09 ~19:47Z):
- win 46137351: WM_CLASS "Minecraft 26.1.2", _NET_WM_PID 839877 (the client
  java; /proc cmdline contains minecraft-26.1.2-client.jar), 1920x1080 @0,0,
  _NET_WM_STATE FULLSCREEN+FOCUSED. THE CLIENT.
- win 8388705: WM_CLASS "mutter-x11-frames", _NET_WM_PID 3925
  (/usr/libexec/mutter-x11-frames), title "Minecraft 26.1.2 - Multiplayer
  (3rd-party Server)", 1920x1080 @0,0, FULLSCREEN+FOCUSED. THE FRAME.
- xdotool search --name "Minecraft" returns BOTH (8388705 first);
  search --class "Minecraft" returns ONLY 46137351. The old
  mc_candidates() area sort ties at 2,073,600 px and tuple order put the
  FRAME first; active_is_mc() accepted any active window whose NAME
  contains "Minecraft" — the frame passes. All as hypothesised.
- getactivewindow returned the CLIENT (46137351) at every check in this lane.

## 2. The failure the hypothesis cannot explain (found by screenshot)

The client's chat input was CLOSED at rest with an unsent leftover line
"/time set 1000" (+stray chars) and red chat text: "Chat is restricted.
Click this message for details." + "Sending commands is not allowed".
The cameraman's keystrokes were arriving as TEXT into a chat box whose
Return never submitted. Live probes (active window = client throughout):
- Escape with chat closed OPENS THE GAME MENU (shot fixtarget-03):
  Escape is not being swallowed; it toggles the pause menu.
- Two Escapes clear the leftover line and the menu (focus grab on release
  restores pointer lock); fixtarget-05 shows a clean in-game screen.
- A full manual send from the clean state DID land: the hold-guard's
  landing pattern matched "MagnusandMouse issued server command: /time
  set 1000" at 19:49:12Z — but that timestamp PRECEDES the probe (VM-clock
  exec timestamps lag the Orin clock by ~10 min; the Orin server log is
  authoritative). A hold-keeper Gallery landing inside the same window
  means the manual landing is corroborative, not solely attributable.

## 3. The patched run (pid 847302, 19:50:39Z) — what actually happened

Patch: new _is_client_window(wid) (WM_CLASS via xdotool --class search +
window pid's /proc cmdline contains java/minecraft/client.jar);
mc_candidates() returns identified clients first; active_is_mc() requires
identity instead of a title match. Offline test against the live desktop:
client True, frame False, candidates [46137351, 8388705], guard True.
Startup sequence then failed differently from any previous run:
- 19:50:48 start /time set 1000 did NOT land (consecutive failures=1).
- 19:50:51 /weather clear sent 3 s after the refresh — the main loop did
  NOT wait out the ~8.5 s landing-verify window before typing again.
- Screenshot (fixtarget-06): the two commands CONCATENATED in one chat
  line: "...27.9/tp MagnusandMouse 24.3 70.4 -92.1 -96.6 -3.9" plus a
  fragment "...0/weather" — i.e. the second command's slash-Return typed
  INTO the still-open first chat box; Return is not submitting the line.
- Conclusion: with correct window identity, rapid successive sends corrupt
  each other inside the chat box. The binding defect is the unsent-line /
  Return-not-submitting behaviour under the cameraman's cadence, NOT
  which window holds focus. One plausible contributor, unproven: the
  client-side "Chat is restricted / Sending commands is not allowed"
  state (chat settings) blocks submission of command lines while still
  accepting typed text.

Lane stopped cameraman via STOP at 19:51 (clean exit logged 19:51:47Z),
then reverted cameraman.py from the backup (md5s equal, py_compile OK).

Screenshots: Orin /tmp/fixtarget-00..08*.png (VM copies /tmp same names).
Diff applied-then-reverted is summarised in the ledger entry
cameraman-fixtarget-20261109; the backup file preserves the pre-fix source.

## 4. Suggested next questions (NOT attempted — one-mechanism charter)

(a) Why does Return not submit? Reproduce a single send at cameraman
    cadence from a clean chat, screenshot before/after Return; check
    chat settings (chatVisibility / chat mode) on this client profile.
(b) Why did the main loop type /weather 3 s after an unverified refresh
    instead of waiting for the landing verdict? Read the startup path.
(c) Is "Sending commands is not allowed" a client chat-mode setting on
    the MagnusandMouse profile that the day-9 --offline Gallery relaunch
    introduced? It appears in NO pre-day-9 record this lane saw.
