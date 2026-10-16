"""Local-only passive browser QA. No app data or production files are rewritten.

Run from repository root: python3 scripts/qa/server.py --port 8920
The dedicated origin keeps QA sessions separate from existing user storage.
"""
import argparse
import http.server
import io
from pathlib import Path


class Handler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        # The injected observer only measures browser events. UI remains manual.
        if self.path.split('?', 1)[0] in ('/', '/index.html'):
            data = Path('index.html').read_bytes().replace(
                b'</head>', b'<script src="scripts/qa/observe.js"></script></head>')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            return io.BytesIO(data)
        return super().send_head()

    def log_message(self, *unused):
        pass


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8920)
    args = parser.parse_args()
    print(f'Local QA: http://localhost:{args.port}', flush=True)
    http.server.ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
