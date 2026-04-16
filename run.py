import subprocess
import sys
import os
import webbrowser
import time

# --- Configuration ---
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
REQUIRED_FILES = [
    os.path.join("src", "App.jsx"),
    os.path.join("src", "index.css"),
    os.path.join("src", "context", "StateContext.jsx"),
    os.path.join("src", "lib", "blockchain.js")
]
PORT = 5173
URL = f"http://localhost:{PORT}"

def print_step(msg):
    print(f"\n>> {msg}")

def run_command(command, shell=True, wait=False):
    """Executes a command."""
    if wait:
        return subprocess.run(command, shell=shell, cwd=PROJECT_DIR)
    else:
        return subprocess.Popen(command, shell=shell, cwd=PROJECT_DIR)

def open_editor_files():
    """Attempts to open required files in VS Code."""
    print_step("Opening core project files in editor...")
    try:
        # Check if 'code' command is available
        subprocess.run(["code", "--version"], shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        files_args = " ".join([f'"{f}"' for f in REQUIRED_FILES])
        os.system(f"code {files_args}")
        print("Required files opened in VS Code.")
    except Exception:
        print("VS Code 'code' command not found. Skipping file opening.")

def main():
    print("="*60)
    print(" FRACTXON_ MVP - PROJECT RUNNER ")
    print("="*60)

    # 1. Open Files
    open_editor_files()

    # 2. Dependency Check
    print_step("Checking Node.js dependencies...")
    if not os.path.exists(os.path.join(PROJECT_DIR, "node_modules")):
        print("Installing dependencies via npm...")
        run_command("npm install", wait=True)
    else:
        print("Dependencies already installed.")

    # 3. Launch Dev Server
    print_step(f"Launching Vite Dev Server on port {PORT}...")
    server_proc = run_command("npm run dev")

    # 4. Open Browser
    print_step(f"Launching web-page: {URL}")
    # Give it a second to start
    time.sleep(2)
    webbrowser.open(URL)

    print("\n" + "-"*60)
    print("FRACTXON_ is now running.")
    print("Press Ctrl+C to stop the server.")
    print("-"*60 + "\n")

    try:
        server_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down FRACTXON_...")
        server_proc.terminate()
        print("Goodbye!")

if __name__ == "__main__":
    main()
