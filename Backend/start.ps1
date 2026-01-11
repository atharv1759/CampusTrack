# Campus Track Backend Startup Script
Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan

# Load .env file and store in hashtable
$envVars = @{}
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            $envVars[$key] = $value
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  Loaded: $key" -ForegroundColor Green
        }
    }
} else {
    Write-Host "Warning: .env file not found!" -ForegroundColor Red
    exit 1
}

# Set environment variables for child process
$env:MONGO_URI = $envVars['MONGO_URI']
$env:JWT_SECRET = $envVars['JWT_SECRET']
$env:ADMIN_PASSWORD = $envVars['ADMIN_PASSWORD']
$env:CLOUDINARY_CLOUD_NAME = $envVars['CLOUDINARY_CLOUD_NAME']
$env:CLOUDINARY_API_KEY = $envVars['CLOUDINARY_API_KEY']
$env:CLOUDINARY_API_SECRET = $envVars['CLOUDINARY_API_SECRET']
$env:EMAIL_USER = $envVars['EMAIL_USER']
$env:EMAIL_PASS = $envVars['EMAIL_PASS']
$env:PORT = $envVars['PORT']
$env:FRONTEND_URL = $envVars['FRONTEND_URL']

Write-Host "Starting Campus Track Backend..." -ForegroundColor Green
.\mvnw.cmd spring-boot:run
