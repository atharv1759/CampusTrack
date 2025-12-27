# Campus Track Backend Startup Script
Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan

# Load .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  Loaded: $key" -ForegroundColor Green
        }
    }
} else {
    Write-Host "Warning: .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Campus Track Backend..." -ForegroundColor Green
.\mvnw.cmd spring-boot:run
