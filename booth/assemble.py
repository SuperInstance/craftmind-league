#!/usr/bin/env python3
"""THE BOOTH — sample episode assembly (day 11).
Scenes are timed from the measured narrator wavs. The citizen's subtitle
cues come from script-day11.json (already byte-verified against the trace).
Footage: Orin capture segments for the played window 00:59:36Z-01:07:04Z,
sped to fit; the window stretch carrying an open chat panel (sampled at
~01:03:01Z) is cut out of the source. Title/credits are black cards.
"""
import json, math, os, subprocess, sys, wave

WORK = os.path.expanduser('~/booth-work')
BOOTH = os.path.expanduser('~/craftmind-league/booth')
FF = '/home/caseydigennaro/sitka-distill/gen3d/.venv/lib/python3.12/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-aarch64-v7.0.2'
SR = 24000

script = json.load(open(os.path.join(BOOTH, 'script-day11.json')))
narr = script['channels']['narrator']
subs = script['channels']['subtitles']
screen = {s['scene']: s['text'] for s in script['channels']['screen']}

WAV = {  # scene -> rendered file (jobs order == narrator order)
}
jobs_order = ['00-S1-PBP','01-S2-COUCH','02-S3-PBP','03-S4-PBP','04-S4D-COUCH','05-S5-PBP',
              '06-S6-PBP','07-S7-PBP','08-S8-COUCH','09-S9-PBP','10-S10-COUCH','11-S11-PBP']
def dur(p):
    w = wave.open(p); d = w.getnframes() / w.getframerate(); w.close(); return d
for n, job in zip(narr, jobs_order):
    WAV[n['scene']] = (os.path.join(WORK, 'wavs', job + '.wav'), dur(os.path.join(WORK, 'wavs', job + '.wav')))

# ---- scene timeline
TITLE_D, CREDITS_D, TAIL = 4.0, 8.0, 1.2
scenes = [{'scene': 'title', 'start': 0.0, 'dur': TITLE_D}]
t = TITLE_D
for n in narr:
    d = (n.get('narr_delay_s') or 0) + WAV[n['scene']][1] + TAIL
    scenes.append({'scene': n['scene'], 'start': t, 'dur': d, 'narr': n})
    t += d
footage_d = t - TITLE_D
scenes.append({'scene': 'credits', 'start': t, 'dur': CREDITS_D})
TOTAL = t + CREDITS_D
by_scene = {s['scene']: s for s in scenes}

# ---- audio track: silence + wavs at scene offsets
track = bytearray(int(TOTAL * SR) * 2)
for n in narr:
    s = by_scene[n['scene']]
    path, d = WAV[n['scene']]
    w = wave.open(path); frames = w.readframes(w.getnframes()); w.close()
    off = int((s['start'] + (n.get('narr_delay_s') or 0) + 0.25) * SR) * 2
    track[off:off + len(frames)] = frames
aw = wave.open(os.path.join(WORK, 'narration.wav'), 'wb')
aw.setnchannels(1); aw.setsampwidth(2); aw.setframerate(SR)
aw.writeframes(bytes(track)); aw.close()

# ---- ASS (three channels: Title / Sub screens; Subtitle = his words only)
def ass_t(x):
    h = int(x // 3600); m = int((x % 3600) // 60); s = x % 60
    return f"{h}:{m:02d}:{s:05.2f}"
def esc(txt):
    return txt.replace('\n', '\\N')
lines = [
    '[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1280', 'PlayResY: 720', '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    'Style: Title,DejaVu Sans,46,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,0,5,40,40,0,1',
    'Style: Credit,DejaVu Sans,21,&H00DDDDDD,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,5,60,60,0,1',
    'Style: Sub,DejaVu Sans,25,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,2,50,50,34,1',
    '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
]
title_txt = screen['title']
lines.append(f"Dialogue: 0,{ass_t(0.3)},{ass_t(TITLE_D - 0.3)},Title,,0,0,0,,{esc(title_txt)}")
for cue in subs:
    s = by_scene[cue['scene']]
    if cue.get('at_s') is not None:
        start = s['start'] + cue['at_s']; show = 3.6
    elif cue['scene'] == 'S9':
        sibs = [c for c in subs if c['scene'] == 'S9']
        half = s['dur'] / len(sibs); idx = sibs.index(cue)
        start = s['start'] + idx * half + 0.2; show = half - 0.4
    else:
        start = s['start'] + 0.8
        show = min(max(4.0, 2.0 + 0.075 * len(cue['text'])), s['dur'] - 1.2)
    lines.append(f"Dialogue: 0,{ass_t(start)},{ass_t(start + show)},Sub,,0,0,0,,{esc(cue['text'])}")
cred = screen['credits'].split('\n')
half = CREDITS_D / 2
cs = by_scene['credits']['start']
lines.append(f"Dialogue: 0,{ass_t(cs + 0.2)},{ass_t(cs + half)},Credit,,0,0,0,,{esc(chr(10).join(cred[:2]))}")
lines.append(f"Dialogue: 0,{ass_t(cs + half)},{ass_t(cs + CREDITS_D - 0.2)},Credit,,0,0,0,,{esc(chr(10).join(cred[2:]))}")
ass_path = os.path.join(WORK, 'episode.ass')
open(ass_path, 'w').write('\n'.join(lines) + '\n')

# ---- video: window footage, chat-panel stretch (window t 195..230) removed, sped to footage_d
SEG = os.path.join(WORK, 'segments')
W = 114.38 + 119 + 119 + 94 - 35  # window seconds minus the cut stretch
factor = W / footage_d
fc = (
    '[0:v]trim=start=5:end=119.38,setpts=PTS-STARTPTS[v0];'
    '[1:v]trim=end=119,setpts=PTS-STARTPTS[v1];'
    '[2:v]trim=end=119,setpts=PTS-STARTPTS[v2];'
    '[3:v]trim=end=94,setpts=PTS-STARTPTS[v3];'
    '[v0][v1][v2][v3]concat=n=4:v=1:a=0[src];'
    '[src]split=2[sa][sb];'
    '[sa]trim=end=195,setpts=PTS-STARTPTS[ca];'
    '[sb]trim=start=230,setpts=PTS-STARTPTS[cb];'
    f'[ca][cb]concat=n=2:v=1:a=0,setpts=PTS/{factor:.5f},fps=fps=24,trim=end={footage_d:.3f},setpts=PTS-STARTPTS[foot];'
    f'color=c=black:s=1280x720:r=24:d={TITLE_D}[tcard];'
    f'color=c=black:s=1280x720:r=24:d={CREDITS_D}[ccard];'
    '[tcard][foot][ccard]concat=n=3:v=1:a=0[pre];'
    f'[pre]ass={ass_path}[out]'
)
out = os.path.join(WORK, 'episode-day11.mp4')
cmd = [FF, '-v', 'error', '-y',
       '-i', f'{SEG}/seg-1794272371.mp4', '-i', f'{SEG}/seg-1794272491.mp4',
       '-i', f'{SEG}/seg-1794272610.mp4', '-i', f'{SEG}/seg-1794272730.mp4',
       '-i', os.path.join(WORK, 'narration.wav'),
       '-filter_complex', fc, '-map', '[out]', '-map', '4:a',
       '-c:v', 'libx264', '-crf', '25', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '128k', '-t', f'{TOTAL:.3f}', out]
r = subprocess.run(cmd, capture_output=True, text=True)
print(r.returncode, r.stderr[-2000:] if r.returncode else '')
print(json.dumps({'episode': out, 'total_s': round(TOTAL, 2), 'footage_s': round(footage_d, 2),
                  'speed_factor': round(factor, 3),
                  'scenes': [(s['scene'], round(s['start'], 1), round(s['dur'], 1)) for s in scenes]}))
sys.exit(r.returncode)
