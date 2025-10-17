# PassCore Deployment Examples
# This file shows common usage patterns for the Deploy-PassCore.ps1 script

# Example 1: Deploy from downloaded release (recommended for production)
# This downloads the latest release and deploys it
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -CreateBackup -StopService -StartService

# Example 2: Deploy from local build
# This uses a locally built version
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -LocalPath ".\build\PassCore" -CreateBackup -StopService -StartService

# Example 3: Dry run to see what would happen
# This shows what the script would do without actually doing it
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -WhatIf

# Example 4: Deploy without stopping/starting services (for manual control)
# This just copies files without touching IIS
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -CreateBackup

# Example 5: Custom website and app pool names
# This uses custom names for the IIS website and application pool
.\Deploy-PassCore.ps1 -ServerPath "C:\inetpub\wwwroot\PassCore" -ReleaseUrl "latest" -WebsiteName "MyPassCore" -AppPoolName "MyPassCore" -CreateBackup -StopService -StartService

# Example 6: Deploy to a different server path
# This deploys to a custom location
.\Deploy-PassCore.ps1 -ServerPath "D:\Applications\PassCore" -ReleaseUrl "latest" -CreateBackup -StopService -StartService
