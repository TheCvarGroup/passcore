# PassCore Deployment Scripts

This directory contains PowerShell scripts to help deploy PassCore to Windows servers with IIS.

## Scripts

### `Deploy-PassCore.ps1`
The main deployment script that handles:
- Downloading releases from GitHub
- Extracting and deploying files
- Managing IIS websites and application pools
- Creating backups
- Service management (start/stop)

### `Deploy-Example.ps1`
Example usage patterns showing common deployment scenarios.

## Quick Start

### Deploy Latest Release (Recommended)
```powershell
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -CreateBackup -StopService -StartService
```

### Deploy from Local Build
```powershell
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -LocalPath ".\build\PassCore" -CreateBackup -StopService -StartService
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-ServerPath` | Yes | Target server path where PassCore will be deployed |
| `-LocalPath` | No* | Local path to built application (if not using -ReleaseUrl) |
| `-ReleaseUrl` | No* | Download latest release ("latest") or specific version |
| `-WebsiteName` | No | IIS website name (default: "PassCore") |
| `-AppPoolName` | No | IIS application pool name (default: "PassCore") |
| `-BackupPath` | No | Path for backups (default: ".\backups") |
| `-CreateBackup` | No | Create backup before deploying |
| `-StopService` | No | Stop IIS services before deploying |
| `-StartService` | No | Start IIS services after deploying |
| `-WhatIf` | No | Show what would be done without doing it |

*Either `-LocalPath` or `-ReleaseUrl` must be specified.

## Examples

### Production Deployment
```powershell
# Download latest release, create backup, stop/start services
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -CreateBackup -StopService -StartService
```

### Development Deployment
```powershell
# Deploy from local build without service management
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -LocalPath ".\build\PassCore" -CreateBackup
```

### Dry Run
```powershell
# See what would happen without making changes
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -WhatIf
```

### Custom Configuration
```powershell
# Use custom website/app pool names
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -WebsiteName "MyPassCore" -AppPoolName "MyPassCore" -CreateBackup -StopService -StartService
```

## Prerequisites

- Windows Server with IIS
- PowerShell 5.1 or later
- WebAdministration module (usually installed with IIS)
- .NET 8.0 Runtime (for running PassCore)
- Internet connection (if using -ReleaseUrl)

## Security Notes

- Always use HTTPS in production
- Configure SSL certificates in IIS Manager
- Review and customize appsettings.json
- Set appropriate file permissions
- Consider using a dedicated service account

## Troubleshooting

### Common Issues

1. **"Could not stop IIS application"**
   - Manually stop the website and application pool in IIS Manager
   - Check for running processes that might be locking files

2. **"Required file not found"**
   - Ensure you have a complete PassCore deployment
   - Check that the LocalPath contains all necessary files

3. **"Could not download release"**
   - Check internet connection
   - Verify GitHub API access
   - Try downloading manually from the releases page

### Manual Steps After Deployment

1. Configure `appsettings.json` with your domain settings
2. Set up SSL certificate in IIS Manager
3. Configure DNS to point to your server
4. Test the application in a browser
5. Set up monitoring and logging as needed

## Support

For issues with the deployment scripts, please:
1. Check the troubleshooting section above
2. Review the PowerShell error messages
3. Open an issue on the GitHub repository with:
   - Your PowerShell version
   - Windows version
   - Full error message
   - Steps to reproduce
