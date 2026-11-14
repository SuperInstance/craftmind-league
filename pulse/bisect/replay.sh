#!/bin/sh
# usage: replay.sh <identity-suffix> <mode> <max-time>
ID="league-$1"
BODY="{\"model\":\"confluence-presence-brain\",\"messages\":[{\"role\":\"user\",\"content\":\"Say: bisect ok\"}],\"max_tokens\":16,\"temperature\":0.8}"
if [ "$2" = "chunked" ]; then
  curl -s -m "$3" -w "\nHTTP %{http_code} in %{time_total}s\n" -X POST http://127.0.0.1:8642/v1/chat/completions \
    -H "Content-Type: application/json" -H "Authorization: Bearer $ID" -H "Transfer-Encoding: chunked" -d "$BODY"
else
  curl -s -m "$3" -w "\nHTTP %{http_code} in %{time_total}s\n" -X POST http://127.0.0.1:8642/v1/chat/completions \
    -H "Content-Type: application/json" -H "Authorization: Bearer $ID" -d "$BODY"
fi
echo "curl exit: $?"
