# CAMERAMAN CHATFIX LANE — POSITIVE FILING (2026-11-09, Orin)

Charter: second mechanism — chat-state + submission diagnosis and repair of
the cameraman's typed channel (window targeting was mechanism one, NEGATIVE,
filed in CAMERAMAN-FIXTARGET-20261109.md, ledger line 315).
RESULT: POSITIVE. The channel is restored and the cameraman is RUNNING on
its ORIGINAL, unmodified code. No code patch was needed or made: the defect
was a client chat setting, not the send path.

## 1. Diagnosis — settings verdict (the binding cause)

The headed client's chat visibility was set to HIDDEN (chatVisibility:2)
by the clean-frame work (~/capture-clean/cleanframe-toggle.sh writes
chatVisibility:2; the pre-clean-frame backup
~/capture-clean/options.txt.pre-cleanframe reads chatVisibility:0). Per the
toggle script's own discipline, options.txt applies at client start — so
Hidden took effect at the day-9 client restart and has governed every
session since, including the MSA MagnusandMouse session relaunched by the
recovery lane at 19:35Z. The Chat Settings GUI on the live client read
"Chat: Hidden" (screenshot chatfix-08).

What Hidden does in 26.1.2 (measured, not assumed): the slash key still
opens the chat input and typed text is accepted, but pressing Return makes
the client refuse the submission LOCALLY — it prints "Chat is restricted.
Click this message for details." and "Sending commands is not allowed"
into the chat history and sends no packet. Evidence:
- Baseline probe (exact cameraman send sequence: slash, type at 13 ms/char,
  Return) at chatVisibility:2 — the input line was unchanged by Return and
  the two refusal lines appeared as a result of the probe's own Return
  (screenshots chatfix-01/02/04).
- Orin server log: ZERO "MagnusandMouse issued server command" lines after
  19:09:52Z until this lane's fix — the block was total, not
  cadence-dependent.
- After cycling the setting to Commands Only, the byte-identical probe
  landed: server log 20:00:50Z "MagnusandMouse issued server command:
  /time set 1000".

CORRECTION to the fixtarget filing: its "one slow manual send DID land at
19:49:12Z" did not happen. No 19:49 line of any kind exists in the server
log; the only time-sets in that window are Gallery's (19:47:55Z, 19:52:50Z).
The match was the daylight guard's landing pattern, "Set minecraft:
overworld to 1000", which is ISSUER-BLIND — it matches the feedback line of
any /time set, including the hold-keeper's Gallery sets. FLAGGED WEAKNESS
(observed, deliberately NOT fixed under this charter): while an op-channel
hold-keeper shares the world, the cameraman's internal VERIFIED LANDED
check can be satisfied by someone else's refresh. Charter-grade landing
evidence is the "MagnusandMouse issued server command" line, which is what
this filing's proof uses.

## 2. Diagnosis — submission mechanics verdict

The cameraman's send path is NOT defective. send_command (cameraman.py,
unchanged) does: focus guard, slash key, xdotool type at 10-16 ms/char,
Return — and Return WAS processed on every failed attempt; the refusal
messages are the processing. The concatenation the fixtarget lane observed
(/tp ...27.9/tp MagnusandMouse ...) is a downstream symptom: a refused line
stays open in the chat input, so the next send's leading slash types a
literal "/" and its body appends to the still-open line (fixtarget-06).
The loop typing /weather ~3 s after an unverified refresh is real but
secondary — with submission working, every send closes its own line.
No Escape discipline, no submit-key change, no verify-wait change was
needed; none was made.

## 3. The repair (settings change, in the client's own GUI)

Chat: Hidden (2) -> Commands Only (1), cycled in the live client's Chat
Settings screen (screenshots chatfix-08 Hidden, chatfix-09 Shown en route,
chatfix-10 Commands Only). The client persisted it: options.txt now reads
chatVisibility:1, so the repair survives client restarts.
Why Commands Only rather than Shown: it is the smallest step from Hidden
that re-enables command submission, and it keeps player chat text (citizen
narration, op chatter) off the camera frame; only command/system feedback
renders.
STANDING CONFLICT, filed plainly: the clean-frame toggle's ON state
(chatVisibility:2) is incompatible with the cameraman typed channel. Do not
re-apply it while the cameraman is the daylight/camera channel — the
channel dies again at the next client restart after the toggle.
cameraman.py: byte-identical to the pre-fixtarget original, md5
27aaa066d5549c7390a0ffc4c39a3d93 (py_compile clean per fixtarget). A copy
was placed at ~/cameraman/cameraman.py.pre-chatfix-20261109 for the record;
it was never a patch base because no patch exists.

## 4. Proof (Orin server log, MagnusandMouse-issued lines — unambiguous)

- Probe (post-setting, pre-cameraman): 20:00:50Z /time set 1000 LANDED.
- Cameraman relaunched 20:01:27Z, pid 855297, original code, STOP removed
  at launch. Nominal cap 2026-11-10T04:01:27Z (MAX_RUNTIME_S = 8 h).
- Refresh 1 (startup): 20:01:28Z /time set 1000 — cameraman log
  "DAYLIGHT /time set 1000 (start) -- VERIFIED LANDED" 20:01:29Z.
- /weather clear: 20:01:31Z LANDED. /tp: 20:01:46Z and 20:01:58Z LANDED.
- Refresh 2 (scheduled, +305 s at the cameraman's own 300 s cadence):
  20:06:33Z /time set 1000 — cameraman log "DAYLIGHT /time set 1000
  (refresh) -- VERIFIED LANDED" 20:06:33Z.
TWO CONSECUTIVE LANDED REFRESHES: criterion met. Cameraman left RUNNING
(no STOP; pid 855297 alive at filing).

## 5. Scope honoured

MagnusandMouse in-world continuously since 19:35:06Z (no leave line);
never relaunched; no --offline Gallery anything; op channel untouched
(hold-keeper landings continued throughout and were never mistaken for
proof); no citizen woken; no saves touched. Screenshots: Orin
/tmp/chatfix-00..15*.png (rest state, baseline probe, refusal lines,
settings screens, post-fix probe, final state).
