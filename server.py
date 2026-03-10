#!/usr/bin/env python3
"""Simple HTTP server for Caerus AI website."""

import http.server
import socketserver
import os

PORT = 8081
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add cache control headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"Serving Caerus AI at http://0.0.0.0:{PORT}")
        httpd.serve_forever()
