import socket, sys, time
port = int(sys.argv[1]); outfile = sys.argv[2]
srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
srv.bind(("127.0.0.1", port)); srv.listen(1); srv.settimeout(30)
conn, _ = srv.accept(); conn.settimeout(3)
data = b""
try:
    while True:
        chunk = conn.recv(65536)
        if not chunk: break
        data += chunk
        # stop once we likely have headers + full body (chunked terminator or CL satisfied)
        if b"\r\n0\r\n\r\n" in data: break
        head, _, rest = data.partition(b"\r\n\r\n")
        if head and rest:
            import re
            m = re.search(rb"Content-Length:\s*(\d+)", head, re.I)
            if m and len(rest) >= int(m.group(1)): break
except socket.timeout:
    pass
with open(outfile, "wb") as f: f.write(data)
resp = b"{\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":\"echo-ok\"}}],\"usage\":{\"prompt_tokens\":1,\"completion_tokens\":1,\"total_tokens\":2}}"
conn.sendall(b"HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: " + str(len(resp)).encode() + b"\r\nConnection: close\r\n\r\n" + resp)
conn.close(); srv.close()
print("captured", len(data), "bytes")
