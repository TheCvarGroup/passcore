[![Github All Releases](https://img.shields.io/github/downloads/unosquare/passcore/total.svg)](https://github.com/unosquare/passcore/releases)
![Buils status](https://github.com/unosquare/passcore/workflows/ASP.NET%20Core%20CI/badge.svg)

![Passcore Logo](https://github.com/unosquare/passcore/raw/master/src/Unosquare.PassCore.Web/ClientApp/assets/images/passcore-logo.png)
# PassCore: A self-service password change utility for Active Directory

*:star: Please star this project if you find it useful!*

## 📋 Project Status & History

**Important Note**: The original PassCore project was **archived by Unosquare in 2022** and is no longer actively maintained. This repository represents a **community-driven modernization effort** to bring PassCore up to current 2025 standards.

### What This Fork Provides:
- ✅ **Complete modernization** to current technology standards
- ✅ **Security updates** and vulnerability patches
- ✅ **Performance improvements** with modern tooling
- ✅ **Continued support** for a valuable open-source tool
- ✅ **MIT License maintained** - free for commercial and personal use

This fork ensures that PassCore remains viable and secure for organizations that depend on it for self-service password management.

- [📋 Project Status & History](#-project-status--history)
- [Overview](#overview)
  - [🚀 2025 Modernization](#-2025-modernization)
  - [Features](#features)
- [Installation on IIS](#installation-on-iis)
- [Docker](#docker)
- [Linux](#linux)
- [LDAP Provider](#ldap-provider)
- [Pwned Password Support](#pwned-password-support)
- [Password Disallowed Words](#password-disallowed-words)
- [Customization and Configuration](#customization-and-configuration)
  - [Running as a sub application](#running-as-a-sub-application)
- [Troubleshooting](#troubleshooting)
  - [LDAP Support](#ldap-support)
- [License](#license)

## Overview

PassCore is a very simple 1-page web application written in [C#](https://docs.microsoft.com/en-us/dotnet/csharp/), using [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/getting-started/), [MUI (Material-UI React Components)](https://mui.com/), and [Microsoft Directory Services](https://docs.microsoft.com/en-us/dotnet/api/system.directoryservices) (Default provider). 

It allows users to change their Active Directory/LDAP password on their own, provided the user is not disabled.

PassCore does not require any configuration, as it obtains the principal context from the current domain. The original version of this tool was downloaded around 8000 times in 2.5 years and was widely used in enterprise environments.

**Note**: After Unosquare archived the project in 2022, this fork was created to modernize PassCore and ensure it remains viable for organizations that depend on it. The modernization effort brings the project up to current 2025 standards while maintaining full compatibility with existing deployments.

## 🚀 2025 Modernization

**PassCore v5.0.0** has been completely modernized for 2025 standards:

### Backend Modernization
- ✅ **.NET 8 LTS** - Upgraded from .NET 6 to the latest LTS version
- ✅ **Updated NuGet packages** - All dependencies updated to latest versions
- ✅ **Modern C# features** - Using collection expressions and latest syntax
- ✅ **Security audit** - No vulnerabilities found in any packages

### Frontend Modernization  
- ✅ **React 18** - Upgraded from React 16.14.0
- ✅ **MUI v6** - Replaced deprecated Material-UI v4 with modern MUI
- ✅ **TypeScript 5.6** - Updated from TypeScript 4.2
- ✅ **Vite bundler** - Replaced deprecated Parcel with modern Vite
- ✅ **Modern build system** - Faster builds and better development experience



### Features

PassCore has the following features:

- Easily localizable (i.e. you can customize all of the strings in the UI -- see the section on Customization)
- Supports [reCAPTCHA](https://www.google.com/recaptcha/intro/index.html)
- Has a built-in password meter
- Has a password generator
- Has a server-side password entropy meter
- **🆕 Show/Hide Password Toggle** - Toggle visibility for all password fields to verify correct typing
- **🆕 Password Disallowed Words** - Configurable list of words that cannot be used in passwords
- **🆕 Modern UI Components** - Updated to MUI v6 with improved accessibility and design
- **🆕 Enhanced Security** - Latest .NET 8 LTS with updated dependencies and security patches

- Responsive design that works on mobiles, tablets, and desktops.
- Works with Windows/Linux servers.

<img align="center" src="https://user-images.githubusercontent.com/25519413/63782596-39713d80-c8b1-11e9-84f0-eef7a06b447b.png"></img>

## Installation on IIS

### Prerequisites

1. Ensure the server running IIS is domain-joined. To determine if the computer is domain-joined:
    - Go to the *Start* menu, right-click on *Computer*, then select *Properties*
    - Make sure the *Domain* field contains the correct setting.

### Building from Source

1. Clone this repository to your server:
   ```bash
   git clone https://github.com/stevecvar/passcore.git
   cd passcore
   ```

2. Build and publish the application:
   ```bash
   dotnet publish --configuration Release --runtime win-x64 --output "<path>"
   ```
   - The `<path>` is the directory where you will be serving the website from.
   - Make sure you run this command with Administrator privileges.
   - **Note**: Node.js and npm are required during the build process to compile the frontend assets, but can be removed from the server after deployment.
1. Install the [.NET 8.0 Windows Server Hosting bundle](https://dotnet.microsoft.com/download/dotnet/8.0).
1. Go to your *IIS Manager*, Right-click on *Application Pools* and select *Add Application Pool*.
1. A dialog appears. Under Name enter **PassCore Application Pool**, Under .NET CLR Version select **No Managed Code** and finally, under Managed pipeline mode select **Integrated**. Click OK after all fields have been set.
1. Now, right-click on the application pool you just created in the previous step and select *Advanced Settings ...*. Change the *Start Mode* to **AlwaysRunning**, and the *Idle Time-out (minutes)* to **0**. Click on *OK*. This will ensure PassCore stays responsive even after long periods of inactivity.
1. Back on your *IIS Manager*, right-click on *Sites* and select *Add Website*
1. A dialog appears. Under *Site name*, enter **PassCore Website**. Under *Application pool* click on *Select* and ensure you select **PassCore Application Pool**. Under *Physical path*, click on the ellipsis *(...)*, navigate to the folder where you extracted PassCore.
    - **Important:** Make sure the Physical path points to the *parent* folder which is the one containing the files, *logs* and *wwwroot* folders.
    - **NOTE:** If the folder `logs` is not there you can created. To enable the logs you need to change `stdoutLogEnabled` to `true` in the `web.config` file. You need to add *Full Control* permissions to your IIS Application Pool account (see Troubleshooting).
1. Under the *Binding section* of the same dialog, configure the *Type* to be **https**, set *IP Address* to **All Unassigned**, the *Port* to **443** and the *Hostname* to something like **password.yourdomain.com**. Under *SSL Certificate* select a certificate that matches the Hostname you provided above. If you don't know how to install a certificate, please refer to [SSL Certificate Install on IIS 8](https://www.digicert.com/ssl-certificate-installation-microsoft-iis-8.htm) or [SSL Certificate Install on IIS 10](https://www.digicert.com/csr-creation-ssl-installation-iis-10.htm) , in order to install a proper certificate.
    - **Important:** Do not serve this website without an SSL certificate because requests and responses will be transmitted in cleartext and an attacker could easily retrieve these messages and collect usernames and passwords.
1. Click *OK* and navigate to `https://password.yourdomain.com` (the hostname you previously set). If all is set then you should be able to see the PassCore tool show up in your browser.

**NOTE:** If you have a previous version, you **can not** use the same `appsettings.json` file. Please update your settings manually editing the new file.


## Linux
We recommend using the docker image and redirecting the traffic to nginx.

## Docker

You can use the Alpine Docker Builder image and then copy the assets over to an Alpine container. You can pass environment attributes directly into docker without modifying the appsettings.json

```
docker build --rm -t passcore .
docker run \
-e AppSettings__LdapHostnames__0='ad001.example.com' \
-e AppSettings__LdapHostnames__1='ad002.example.com' \
-e AppSettings__LdapPort='636' \
-e AppSettings__LdapUsername='CN=First Last,OU=Users,DC=example,DC=com' \
-it \
-p 80:80 \
passcore:latest
```

**NOTE:** Docker image contains a build using the LDAP Provider (see below).

## LDAP Provider

PassCore was created to use the Microsoft Active Directory Services provided by .NET Framework, but a new Provider using [Novell LDAP Client](https://github.com/dsbenghe/Novell.Directory.Ldap.NETStandard) can be used instead. This provider is the default when PassCore is running at Linux or macOS since Microsoft AD Services are NOT available.

The configuration of the LDAP Provider is slightly different. for example, the AutomaticContext is not available and you need to supply credentials.

*WIP*

## Pwned Password Support
Sometimes a simple set of checks and some custom logic is enough to rule out non-secure trivial passwords. Those checks are always performed locally. There are, however, many more unsafe passwords that cannot be ruled out programatically. For those cases there are no simple set of rules that could be used to check those passwords that should never be used: You either need a local DB with a list of banned passwords or use an external API service.

Here is where Pwned Password API comes into play. Pwned Passwords are more than half a billion passwords which have previously been exposed in different data breaches along the years. The use of this service is free and secure. You can read more about this service in [Pwned Passwords overview](https://haveibeenpwned.com/API/v2#PwnedPasswords)

## Password Disallowed Words

PassCore includes a configurable password disallowed words feature that prevents users from using common, weak, or organization-specific words in their passwords.

### Configuration

The password disallowed words feature is configured in the `appsettings.json` file under the `ClientSettings.PasswordDisallowed` section:

```json
{
  "ClientSettings": {
    "PasswordDisallowed": {
      "Enabled": true,
      "CaseSensitive": false,
      "DisallowedWords": [
        "password",
        "123456",
        "qwerty",
        "admin",
        "letmein",
        "welcome",
        "monkey",
        "dragon",
        "master",
        "hello",
        "login",
        "abc123",
        "password123",
        "admin123",
        "root",
        "toor",
        "pass",
        "test",
        "user",
        "guest"
      ]
    }
  }
}
```

### Configuration Options

- **`Enabled`**: Set to `true` to enable password disallowed words validation, `false` to disable
- **`CaseSensitive`**: Set to `true` for case-sensitive matching, `false` for case-insensitive (recommended)
- **`DisallowedWords`**: Array of words/phrases that cannot be contained in passwords

### How It Works

- The disallowed words validation occurs during password change attempts
- If a password contains any disallowed word (as a substring), the change will be rejected
- The validation is case-insensitive by default for better security
- Users receive a clear error message when their password is rejected due to disallowed content


## Customization and Configuration

All server-side settings and client-side settings are stored in the `/appsettings.json` file.
The most relevant configuration entries are shown below. Make sure you make your changes to the `appsettings.json` file using a regular text editor like [Visual Studio Code](https://code.visualstudio.com)

- To enable reCAPTCHA
  1. Find the `PrivateKey` entry and enter your private key within double quotes (`"`)
  2. Find the `SiteKey` entry and enter your Site Key within double quotes (`"`)
- To change the language of the reCAPTCHA widget
  - Find the `LanguageCode` entry and enter [one of the options listed here](https://developers.google.com/recaptcha/docs/language). By default this is set to `en`
- To enable/disable the password meter
  - Find the `ShowPasswordMeter` entry and set it to `true` or `false` (without quotes)
- To enable enable/disable the password generator
  - Find the `UsePasswordGeneration` entry and set it to `true` or `false` (without quotes)
  - Find the `PasswordEntropy` entry and set it to a numeric value (without quotes) to set the entropy of the generated password
- To enable server-side password entropy meter
  - Find the `MinimumScore` entry and set it to a numeric value (without quotes) between 1 and 4, where 1 is a bit secure and 4 is the most secure. Set to 0, for deactivate the validation.
- To enable restricted group checking
  1. Find the `RestrictedADGroups` entry and add any groups that are sensitive.  Accounts in these groups (directly or inherited) will not be able to change their password.
- Find the `DefaultDomain` entry and set it to your default Active Directory domain. This should eliminate confusion about using e-mail domains / internal domain names. **NOTE:** if you are using a subdomain, and you have errors, please try using your top-level domain. 
- To provide an optional parameter to the URL to set the username text box automatically
  1. `http://mypasscore.com/?userName=someusername`
  2. This helps the user in case they forgot their username and, also comes in handy when sending a link to the application or having it embedded into another application where the user is already signed in.
- To specify which (DC) attribute is used to search for the specific user.
  - With the `IdTypeForUser` it is possible to select one of six Attributes that will be used to search for the specifiv user.
  - The possible values are:
    - `DistinguishedName` or `DN`
    - `GloballyUniqueIdentifier` or `GUID`
    - `Name`
    - `SamAccountName` or `SAM`
    - `SecurityIdentifier` or `SID`
    - `UserPrincipalName` or `UPN`
- The rest of the configuration entries are all pretty much all UI strings. Change them to localize, or to brand this utility, to meet your needs.

### Running as a sub-application

To run as a sub-application you need to modify the `base href="/"` value in the `wwwroot/index.html` file to be the base URL for PassCore. For example you might have PassCore setup at /PassCore so you would put

```html
<base href="/PassCore/" />
```

## Troubleshooting

- At first run if you find an error (e.g. **HTTP Error 502.5**) first ensure you have installed [.NET 8.0 Windows Server Hosting bundle](https://dotnet.microsoft.com/download/dotnet/8.0), or better.
- If you find an [HTTP Error 500](https://stackoverflow.com/questions/45415832/http-error-500-19-in-iis-10-and-visual-studio-2017) you can try
  1. Press Win Key+R to Open Run Window
  1. in the Run Window, enter "OptionalFeatures.exe"
  1. in the features window, Click: "Internet Information Services"
  1. Click: "World Wide Web Services"
  1. Click: "Application Development Features"
  1. Check the features.
- If you / your user's current password never seems to be accepted for reset; the affected person may need to use a domain-connected PC to log in and reset their password on it first. Updated group policy settings could be blocking user changes, until a local login is completed.
- You can add permissions to your log folder using [icacls](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/icacls)
```
icacls "<logfolder>/" /grant "IIS AppPool\<passcoreAppPoolAccount>:M" /t
```
- If you find [Exception from HRESULT: 0x800708C5 .The password does not meet the password policy requirements](http://blog.cionsystems.com/?p=907) trying to change a password. Set 'Minimum password age' to 0 at 'Default Domain Policy'.

### LDAP Support

- If your users are having trouble changing passwords as in issues #8 or #9 : try configuring the section `PasswordChangeOptions` in the `/appsettings.json` file. Here are some guidelines:
  1. Ensure `UseAutomaticContext` is set to `false`
  1. Ensure `LdapUsername` is set to an AD user with enough permissions to reset user passwords
  1. Ensure `LdapPassword` is set to the correct password for the admin user mentioned above
  1. User @gadams65 suggests the following: Use the FQDN of your LDAP host. Enter the LDAP username without any other prefix or suffix such as `domain\\` or `@domain`. Only the username.
- You can also opt to use the Linux or macOS version of PassCore. This version includes a LDAP Provider based on Novell. The same provider can be used with Windows, you must build it by yourself.

## License

PassCore is open source software and MIT licensed. Please star this project if you like it.

