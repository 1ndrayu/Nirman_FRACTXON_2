@echo off
echo ========================================
echo FRACTXON_ MVP - WINDOWS RUNNER
echo ========================================

:: Open required files in VS Code
echo [1/4] Opening core project files...
start /b code src\App.jsx src\index.css src\context\StateContext.jsx src\lib\blockchain.js

:: Install dependencies if node_modules is missing
if not exist node_modules (
    echo [2/4] Installing dependencies...
    call npm install
) else (
    echo [2/4] Dependencies already installed.
)

:: Run dev server
echo [3/4] Launching Vite Dev Server...
echo [4/4] Opening browser at http://localhost:5173/...
start http://localhost:5173/
npm run dev
