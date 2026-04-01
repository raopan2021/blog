#!/usr/bin/env python3
"""
显卡行情中心 - 一键启动脚本
运行: python3 serve.py
然后浏览器打开: http://localhost:8080
"""
import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

if __name__ == '__main__':
    print('=' * 50)
    print('  🎮 显卡行情中心')
    print(f'  📂 目录: {DIRECTORY}')
    print(f'  🌐 访问: http://localhost:{PORT}')
    print('=' * 50)
    threading.Timer(1, open_browser).start()
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print('  按 Ctrl+C 停止服务')
        httpd.serve_forever()
