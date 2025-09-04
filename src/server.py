#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parsear la URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Remover / inicial si existe
        if path.startswith('/'):
            path = path[1:]
        
        # Si la ruta está vacía, servir index.html
        if not path or path == '/':
            path = 'index.html'
        
        # Si no tiene extensión, intentar agregar .html
        if not os.path.splitext(path)[1]:
            html_path = f"{path}.html"
            print(f"Intentando servir {html_path}")
            if os.path.exists(html_path):
                path = html_path
            elif os.path.exists(path + '/index.html'):
                path = path + '/index.html'
        
        # Actualizar self.path con la nueva ruta
        self.path = '/' + path
        
        # Llamar al método padre
        return super().do_GET()
    
    def end_headers(self):
        # Agregar headers para evitar problemas de CORS en desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def run_server(port=8000):
    handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Servidor ejecutándose en http://localhost:{port}")
        print("URLs disponibles:")
        print(f"  http://localhost:{port}/")
        print(f"  http://localhost:{port}/cursos")
        print(f"  http://localhost:{port}/contacto")
        print(f"  http://localhost:{port}/microtik")
        print("\nPresiona Ctrl+C para detener el servidor")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido")
            httpd.server_close()

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)
