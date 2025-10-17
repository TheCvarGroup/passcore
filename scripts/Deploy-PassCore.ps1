# PassCore Deployment Script
# This script helps deploy PassCore to a Windows server with IIS
#
# This script supports both:
# 1. Pre-built releases (downloaded ZIP files from GitHub releases)
# 2. Local builds (from source code)
#
# Parameters:
#   -ServerPath: Target server path where the application will be deployed
#   -WebsiteName: Name of the IIS website (default: "PassCore")
#   -AppPoolName: Name of the IIS application pool (default: "PassCore")
#   -LocalPath: Local path to the built application or extracted release
#   -BackupPath: Path where backups will be stored (default: ".\backups")
#   -CreateBackup: Create a backup before deploying
#   -StopService: Stop the website and app pool before deploying
#   -StartService: Start the website and app pool after deploying
#   -WhatIf: Show what would be done without actually doing it
#   -ReleaseUrl: Download and extract a specific release (e.g., "v1.0.1")
#   -DownloadPath: Path to download releases to (default: ".\downloads")

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerPath,
    
    [Parameter(Mandatory=$false)]
    [string]$LocalPath,
    
    [Parameter(Mandatory=$false)]
    [string]$BackupPath = ".\backups",
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateBackup,
    
    [Parameter(Mandatory=$false)]
    [switch]$StopService,
    
    [Parameter(Mandatory=$false)]
    [string]$WebsiteName = "PassCore",
    
    [Parameter(Mandatory=$false)]
    [string]$AppPoolName = "PassCore",
    
    [Parameter(Mandatory=$false)]
    [switch]$StartService,
    
    [Parameter(Mandatory=$false)]
    [switch]$WhatIf,
    
    [Parameter(Mandatory=$false)]
    [string]$ReleaseUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$DownloadPath = ".\downloads"
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Get-LatestRelease {
    Write-ColorOutput "Fetching latest release information..." $Blue
    
    try {
        $releases = Invoke-RestMethod -Uri "https://api.github.com/repos/TheCvarGroup/passcore/releases/latest"
        return $releases
    }
    catch {
        Write-ColorOutput "ERROR: Could not fetch release information: $($_.Exception.Message)" $Red
        Write-ColorOutput "Please check your internet connection and try again." $Yellow
        exit 1
    }
}

function Download-Release {
    param([string]$ReleaseUrl, [string]$DownloadPath)
    
    Write-ColorOutput "Downloading release from: $ReleaseUrl" $Blue
    
    if (-not (Test-Path $DownloadPath)) {
        New-Item -ItemType Directory -Path $DownloadPath -Force | Out-Null
    }
    
    $zipPath = Join-Path $DownloadPath "passcore-release.zip"
    
    if ($WhatIf) {
        Write-ColorOutput "WOULD DOWNLOAD: $ReleaseUrl -> $zipPath" $Yellow
        return $zipPath
    }
    
    try {
        Invoke-WebRequest -Uri $ReleaseUrl -OutFile $zipPath -UseBasicParsing
        Write-ColorOutput "Release downloaded successfully" $Green
        return $zipPath
    }
    catch {
        Write-ColorOutput "ERROR: Could not download release: $($_.Exception.Message)" $Red
        exit 1
    }
}

function Expand-Release {
    param([string]$ZipPath, [string]$ExtractPath)
    
    Write-ColorOutput "Extracting release files..." $Blue
    
    if ($WhatIf) {
        Write-ColorOutput "WOULD EXTRACT: $ZipPath -> $ExtractPath" $Yellow
        return $ExtractPath
    }
    
    if (-not (Test-Path $ExtractPath)) {
        New-Item -ItemType Directory -Path $ExtractPath -Force | Out-Null
    }
    
    try {
        Expand-Archive -Path $ZipPath -DestinationPath $ExtractPath -Force
        Write-ColorOutput "Release extracted successfully" $Green
        return $ExtractPath
    }
    catch {
        Write-ColorOutput "ERROR: Could not extract release: $($_.Exception.Message)" $Red
        exit 1
    }
}

function Test-LocalDeployment {
    param([string]$LocalPath)
    
    Write-ColorOutput "Checking deployment files..." $Blue
    
    if (-not (Test-Path $LocalPath)) {
        Write-ColorOutput "ERROR: Local deployment path not found: $LocalPath" $Red
        Write-ColorOutput "Please ensure the path is correct or use -ReleaseUrl to download a release." $Yellow
        exit 1
    }
    
    # Check for required files
    $requiredFiles = @(
        "Unosquare.PassCore.Web.dll",
        "appsettings.json"
    )
    
    foreach ($file in $requiredFiles) {
        $filePath = Join-Path $LocalPath $file
        if (-not (Test-Path $filePath)) {
            Write-ColorOutput "ERROR: Required file not found: $file" $Red
            Write-ColorOutput "Please ensure you have a complete PassCore deployment." $Yellow
            exit 1
        }
    }
    
    Write-ColorOutput "Deployment files verified" $Green
}

function Backup-CurrentDeployment {
    if (-not $CreateBackup) {
        return
    }
    
    Write-ColorOutput "Creating backup of current deployment..." $Blue
    
    if (-not (Test-Path $BackupPath)) {
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    }
    
    $backupName = "PassCore-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    $backupFullPath = Join-Path $BackupPath $backupName
    
    if ($WhatIf) {
        Write-ColorOutput "WOULD CREATE: Backup at $backupFullPath" $Yellow
        return
    }
    
    # Check if server path exists
    if (-not (Test-Path $ServerPath)) {
        Write-ColorOutput "No existing deployment found to backup" $Yellow
        return
    }
    
    try {
        # Try to create backup
        Compress-Archive -Path "$ServerPath\*" -DestinationPath "$backupFullPath.zip" -Force
        Write-ColorOutput "Backup created: $backupName.zip" $Green
    }
    catch {
        Write-ColorOutput "WARNING: Could not create backup due to locked files. This usually means the application is running." $Yellow
        Write-ColorOutput "Continuing with deployment without backup..." $Yellow
    }
}

function Stop-ApplicationService {
    if (-not $StopService) {
        return
    }
    
    Write-ColorOutput "Stopping IIS application..." $Blue
    
    if ($WhatIf) {
        Write-ColorOutput "WOULD STOP: IIS Website '$WebsiteName' and Application Pool '$AppPoolName'" $Yellow
        return
    }
    
    try {
        # Import WebAdministration module
        Import-Module WebAdministration -ErrorAction SilentlyContinue
        
        # Stop the website
        $website = Get-Website -Name $WebsiteName -ErrorAction SilentlyContinue
        if ($website -and $website.State -eq "Started") {
            Write-ColorOutput "Stopping website '$WebsiteName'..." $Yellow
            Stop-Website -Name $WebsiteName
            Write-ColorOutput "Website '$WebsiteName' stopped" $Green
        } else {
            Write-ColorOutput "Website '$WebsiteName' not running or not found" $Yellow
        }
        
        # Stop the application pool
        $appPool = Get-IISAppPool -Name $AppPoolName -ErrorAction SilentlyContinue
        if ($appPool -and $appPool.State -eq "Started") {
            Write-ColorOutput "Stopping application pool '$AppPoolName'..." $Yellow
            Stop-WebAppPool -Name $AppPoolName
            
            # Wait for app pool to stop
            $timeout = 30
            $elapsed = 0
            do {
                Start-Sleep -Seconds 1
                $elapsed++
                $appPool = Get-IISAppPool -Name $AppPoolName -ErrorAction SilentlyContinue
            } while ($appPool -and $appPool.State -eq "Started" -and $elapsed -lt $timeout)
            
            if ($appPool -and $appPool.State -eq "Started") {
                Write-ColorOutput "WARNING: Application pool did not stop within $timeout seconds" $Yellow
            } else {
                Write-ColorOutput "Application pool '$AppPoolName' stopped successfully" $Green
            }
        } else {
            Write-ColorOutput "Application pool '$AppPoolName' not running or not found" $Yellow
        }
        
        # Give IIS time to fully release file locks
        Write-ColorOutput "Waiting for IIS to fully release file locks..." $Yellow
        Start-Sleep -Seconds 10
        Write-ColorOutput "IIS shutdown complete" $Green
    }
    catch {
        Write-ColorOutput "WARNING: Could not stop IIS application: $($_.Exception.Message)" $Yellow
        Write-ColorOutput "You may need to manually stop the website and application pool in IIS Manager" $Yellow
    }
}

function Deploy-Files {
    param([string]$LocalPath)
    
    Write-ColorOutput "Deploying files to server..." $Blue
    
    if ($WhatIf) {
        Write-ColorOutput "WOULD DEPLOY: $LocalPath -> $ServerPath" $Yellow
        return
    }
    
    # Create server directory if it doesn't exist
    if (-not (Test-Path $ServerPath)) {
        New-Item -ItemType Directory -Path $ServerPath -Force | Out-Null
        Write-ColorOutput "Created server directory: $ServerPath" $Green
    }
    
    # Copy files
    Write-ColorOutput "Copying files..." $Yellow
    Copy-Item -Path "$LocalPath\*" -Destination $ServerPath -Recurse -Force
    
    Write-ColorOutput "Files deployed successfully" $Green
}

function Start-ApplicationService {
    if (-not $StartService) {
        return
    }
    
    Write-ColorOutput "Starting IIS application..." $Blue
    
    if ($WhatIf) {
        Write-ColorOutput "WOULD START: IIS Website '$WebsiteName' and Application Pool '$AppPoolName'" $Yellow
        return
    }
    
    try {
        # Import WebAdministration module
        Import-Module WebAdministration -ErrorAction SilentlyContinue
        
        # Start the application pool first
        $appPool = Get-IISAppPool -Name $AppPoolName -ErrorAction SilentlyContinue
        if ($appPool -and $appPool.State -ne "Started") {
            Write-ColorOutput "Starting application pool '$AppPoolName'..." $Yellow
            Start-WebAppPool -Name $AppPoolName
            
            # Wait for app pool to start
            $timeout = 30
            $elapsed = 0
            do {
                Start-Sleep -Seconds 1
                $elapsed++
                $appPool = Get-IISAppPool -Name $AppPoolName -ErrorAction SilentlyContinue
            } while ($appPool -and $appPool.State -ne "Started" -and $elapsed -lt $timeout)
            
            if ($appPool -and $appPool.State -eq "Started") {
                Write-ColorOutput "Application pool '$AppPoolName' started successfully" $Green
            } else {
                Write-ColorOutput "WARNING: Application pool did not start within $timeout seconds" $Yellow
            }
        } else {
            Write-ColorOutput "Application pool '$AppPoolName' already running or not found" $Yellow
        }
        
        # Start the website
        $website = Get-Website -Name $WebsiteName -ErrorAction SilentlyContinue
        if ($website -and $website.State -ne "Started") {
            Write-ColorOutput "Starting website '$WebsiteName'..." $Yellow
            Start-Website -Name $WebsiteName
            Write-ColorOutput "Website '$WebsiteName' started" $Green
        } else {
            Write-ColorOutput "Website '$WebsiteName' already running or not found" $Yellow
        }
    }
    catch {
        Write-ColorOutput "WARNING: Could not start IIS application: $($_.Exception.Message)" $Yellow
        Write-ColorOutput "You may need to manually start the website and application pool in IIS Manager" $Yellow
    }
}

function Show-DeploymentSummary {
    param([string]$LocalPath)
    
    Write-ColorOutput "`n=== DEPLOYMENT SUMMARY ===" $Blue
    Write-ColorOutput "Local Path: $LocalPath" $Green
    Write-ColorOutput "Server Path: $ServerPath" $Green
    
    if ($CreateBackup) {
        Write-ColorOutput "Backup Created: Yes" $Green
    }
    
    if ($StopService) {
        Write-ColorOutput "Service Stopped: Yes (Website: $WebsiteName, AppPool: $AppPoolName)" $Green
    }
    
    if ($StartService) {
        Write-ColorOutput "Service Started: Yes (Website: $WebsiteName, AppPool: $AppPoolName)" $Green
    }
    
    if ($WhatIf) {
        Write-ColorOutput "`nThis was a dry run. No actual changes were made." $Yellow
    } else {
        Write-ColorOutput "`nDeployment completed successfully!" $Green
        Write-ColorOutput "`nNext steps:" $Blue
        Write-ColorOutput "1. Configure your appsettings.json file" $Yellow
        Write-ColorOutput "2. Set up SSL certificate in IIS Manager" $Yellow
        Write-ColorOutput "3. Configure your domain and DNS settings" $Yellow
        Write-ColorOutput "4. Test the application" $Yellow
    }
}

# Main execution
try {
    Write-ColorOutput "=== PassCore Deployment Script ===" $Blue
    Write-ColorOutput "Starting deployment process..." $Blue
    
    # Determine deployment source
    if ($ReleaseUrl) {
        # Download and extract release
        $release = Get-LatestRelease
        $downloadUrl = $release.assets | Where-Object { $_.name -like "passcore-*-windows.zip" } | Select-Object -First 1 -ExpandProperty browser_download_url
        
        if (-not $downloadUrl) {
            Write-ColorOutput "ERROR: Could not find Windows release in latest version" $Red
            exit 1
        }
        
        $zipPath = Download-Release -ReleaseUrl $downloadUrl -DownloadPath $DownloadPath
        $extractPath = Join-Path $DownloadPath "passcore-extracted"
        $LocalPath = Expand-Release -ZipPath $zipPath -ExtractPath $extractPath
    }
    elseif (-not $LocalPath) {
        Write-ColorOutput "ERROR: Either -LocalPath or -ReleaseUrl must be specified" $Red
        Write-ColorOutput "Use -ReleaseUrl to download the latest release, or -LocalPath to use local files" $Yellow
        exit 1
    }
    
    Test-LocalDeployment -LocalPath $LocalPath
    Stop-ApplicationService
    Backup-CurrentDeployment
    Deploy-Files -LocalPath $LocalPath
    Start-ApplicationService
    Show-DeploymentSummary -LocalPath $LocalPath
}
catch {
    Write-ColorOutput "`nERROR: Deployment failed!" $Red
    Write-ColorOutput $_.Exception.Message $Red
    exit 1
}
