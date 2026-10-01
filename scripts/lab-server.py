"""Static lab server: fixed response latency and aggregate body bandwidth.
Not a real mobile-network or CPU emulator. Run only against synthetic local data.
"""
import argparse, http.server, threading, time
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8782)
parser.add_argument('--latency-ms',type=float,default=100);parser.add_argument('--bytes-per-second',type=int,default=750000)
args=parser.parse_args();lock=threading.Lock();next_slot=0
class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store');time.sleep(args.latency_ms/1000);super().end_headers()
    def copyfile(self,source,outputfile):
        global next_slot
        while chunk:=source.read(8192):
            if args.bytes_per_second>0:
                with lock:
                    now=time.monotonic();start=max(now,next_slot);next_slot=start+len(chunk)/args.bytes_per_second
                time.sleep(max(0,start-time.monotonic()))
            outputfile.write(chunk)
    def log_message(self,*unused): pass
print(f'Local lab http://localhost:{args.port}; latency {args.latency_ms} ms; aggregate body limit {args.bytes_per_second} B/s; no CPU throttle',flush=True)
http.server.ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
