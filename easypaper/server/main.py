import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess
import signal
import sys

from api import paper_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(paper_routes.router, prefix="/papers", tags=["papers"])

def run_dev_server():
    return subprocess.Popen(
        ["npm", "run", "dev"],
        cwd="easypaper/client",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )

def signal_handler(sig, frame):
    print("Shutting down...")
    if vite_process:
        vite_process.terminate()
    sys.exit(0)

if __name__ == "__main__":
    is_dev = os.getenv("ENV", "development") == "development"
    
    if is_dev:
        vite_process = run_dev_server()
        signal.signal(signal.SIGINT, signal_handler)
        
        def log_vite_output():
            for line in vite_process.stdout:
                print("Vite:", line, end="")
            for line in vite_process.stderr:
                print("Vite Error:", line, end="")
        
        import threading
        threading.Thread(target=log_vite_output, daemon=True).start()
    else:
        app.mount("/", StaticFiles(directory="easypaper/client/dist", html=True))

    uvicorn.run(app, host="0.0.0.0", port=8000)