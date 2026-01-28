@echo off
REM Local Development & Testing Script for Windows

echo ==================================
echo Kanespace Development Setup
echo ==================================
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo X Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo OK Node.js: %NODE_VERSION%
echo OK NPM: %NPM_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm ci || call npm install

echo.
echo ==================================
echo Development Commands
echo ==================================
echo.
echo Start development server:
echo    npm run dev
echo.
echo Build for production:
echo    npm run build
echo.
echo Preview production build:
echo    npm run preview
echo.
echo ==================================
echo Deployment
echo ==================================
echo.
echo Push to GitHub (auto-deploys to Cloudflare):
echo    git add .
echo    git commit -m "Your message"
echo    git push origin main
echo.
echo Check deployment status:
echo    - GitHub Actions: https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/actions
echo    - Cloudflare Pages: https://dash.cloudflare.com/pages
echo.
echo Setup complete! Run 'npm run dev' to start.
pause
