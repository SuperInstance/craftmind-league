import sys

# ---- Fix 1: governor.py ----
p = "proxy/governor.py"
s = open(p).read()

old_read = """        body = b""
        length = int(self.headers.get("Content-Length") or 0)
        if length:
            body = self.rfile.read(length)
"""
new_read = """        body = b""
        te = (self.headers.get("Transfer-Encoding") or "").lower()
        if "chunked" in te:
            body = self._read_chunked()
        else:
            length = int(self.headers.get("Content-Length") or 0)
            if length:
                body = self.rfile.read(length)
"""
assert old_read in s, "governor body-read block not found"
s = s.replace(old_read, new_read, 1)

old_skip = """            if k.lower() in ("host", "content-length", "authorization", "connection"):
"""
new_skip = """            if k.lower() in ("host", "content-length", "authorization", "connection", "transfer-encoding"):
"""
assert old_skip in s, "governor header skip list not found"
s = s.replace(old_skip, new_skip, 1)

helper = '''    # -- chunked request bodies --------------------------------------
    def _read_chunked(self):
        """De-chunk a Transfer-Encoding: chunked request body.

        http.server never de-chunks for us, and some clients (raw
        Node http.request without an explicit Content-Length) send
        nothing else.  Before 2026-11-07 the body was silently read
        as empty AND the chunked header was forwarded upstream with
        Content-Length: 0, so the upstream waited forever for chunk
        frames that never came (the resident mind-link 300 s hangs).
        """
        out = bytearray()
        while True:
            line = self.rfile.readline(65536).strip()
            if not line:
                break
            try:
                size = int(line.split(b";", 1)[0], 16)
            except ValueError:
                break
            if size == 0:
                # consume any trailers up to the blank line
                while True:
                    t = self.rfile.readline(65536)
                    if t in (b"\\r\\n", b"\\n", b""):
                        break
                break
            out.extend(self.rfile.read(size))
            self.rfile.readline(65536)  # trailing CRLF after the chunk
        return bytes(out)

'''
old_verbs = "    def do_GET(self):"
assert old_verbs in s, "do_GET marker not found"
s = s.replace(old_verbs, helper + old_verbs, 1)
open(p, "w").write(s)
print("governor.py patched")

# ---- Fix 2: brain.js ----
p2 = "bots/craftmind/src/brain.js"
s2 = open(p2).read()
old_h = """        headers: {
          'Content-Type': 'application/json',
"""
new_h = """        headers: {
          'Content-Type': 'application/json',
          // Send a fixed-length body: without Content-Length, Node
          // falls back to chunked transfer encoding, which naive
          // proxies may mis-frame (league governor, 2026-11-07).
          'Content-Length': Buffer.byteLength(body),
"""
assert old_h in s2, "brain.js headers block not found"
s2 = s2.replace(old_h, new_h, 1)
open(p2, "w").write(s2)
print("brain.js patched")
