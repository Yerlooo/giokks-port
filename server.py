"""Small local server for the portfolio and its shared CMS content."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import sqlite3

ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "portfolio-content.sqlite3"


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?", 1)[0] == "/portfolio-content.sqlite3":
            self.send_error(404)
            return
        if self.path.split("?", 1)[0] == "/api/content":
            with sqlite3.connect(DATABASE) as db:
                row = db.execute("SELECT content FROM site_content WHERE id = 1").fetchone()
            payload = json.loads(row[0]) if row else None
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/content":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 15_000_000:
                self.send_error(413, "Content payload must be under 15 MB")
                return
            content = json.loads(self.rfile.read(length))
            if not isinstance(content, dict):
                raise ValueError("Expected a content object")
            serialized = json.dumps(content, ensure_ascii=False)
            with sqlite3.connect(DATABASE) as db:
                db.execute("CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY CHECK (id = 1), content TEXT NOT NULL)")
                db.execute("INSERT INTO site_content (id, content) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content", (serialized,))
            body = b'{"saved":true}'
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (ValueError, json.JSONDecodeError):
            self.send_error(400, "Invalid content")


if __name__ == "__main__":
    with sqlite3.connect(DATABASE) as db:
        db.execute("CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY CHECK (id = 1), content TEXT NOT NULL)")
    port = int(os.environ.get("PORT", "5500"))
    server = ThreadingHTTPServer(("0.0.0.0", port), PortfolioHandler)
    print(f"Portfolio running on http://localhost:{port} (forward this port in VS Code)")
    server.serve_forever()
