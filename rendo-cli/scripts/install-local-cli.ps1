param(
  [string]$SourceExe = "",
  [string]$InstallRoot = "",
  [switch]$SkipPathUpdate
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$defaultSourceExe = Join-Path $repoRoot "dist\release\dist\rendo.exe"

if ([string]::IsNullOrWhiteSpace($SourceExe)) {
  $SourceExe = $defaultSourceExe
}

if ([string]::IsNullOrWhiteSpace($InstallRoot)) {
  $localAppData = [Environment]::GetFolderPath("LocalApplicationData")
  if ([string]::IsNullOrWhiteSpace($localAppData)) {
    throw "LocalApplicationData is not available"
  }
  $InstallRoot = Join-Path $localAppData "Programs\Rendo"
}

if (-not (Test-Path $SourceExe)) {
  if ($SourceExe -eq $defaultSourceExe) {
    & powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "build-python-cli.ps1")
    if ($LASTEXITCODE -ne 0) {
      throw "failed to build local rendo executable"
    }
  }
}

if (-not (Test-Path $SourceExe)) {
  throw "rendo executable not found: $SourceExe"
}

$binDir = Join-Path $InstallRoot "bin"
$targetExe = Join-Path $binDir "rendo.exe"
New-Item -ItemType Directory -Path $binDir -Force | Out-Null
Copy-Item -Force $SourceExe $targetExe

$pathUpdated = $false
$pathAlreadyContained = $false

if (-not $SkipPathUpdate) {
  $currentUserPath = [Environment]::GetEnvironmentVariable("Path", "User") ?? ""
  $segments = $currentUserPath.Split(';', [System.StringSplitOptions]::RemoveEmptyEntries)
  $normalizedSegments = $segments | ForEach-Object { $_.Trim() } | Where-Object { $_ }
  if ($normalizedSegments -contains $binDir) {
    $pathAlreadyContained = $true
  } else {
    $nextPath = if ([string]::IsNullOrWhiteSpace($currentUserPath)) { $binDir } else { "$currentUserPath;$binDir" }
    [Environment]::SetEnvironmentVariable("Path", $nextPath, "User")
    $pathUpdated = $true
  }
}

$payload = [ordered]@{
  installRoot = $InstallRoot
  binDir = $binDir
  executable = $targetExe
  sourceExe = $SourceExe
  pathUpdated = $pathUpdated
  pathAlreadyContained = $pathAlreadyContained
  nextCommand = "rendo --help"
}

Write-Output "Installed rendo CLI to $targetExe"
if ($SkipPathUpdate) {
  Write-Output "User PATH update skipped. Add this directory manually if needed: $binDir"
} elseif ($pathUpdated) {
  Write-Output "Updated user PATH with: $binDir"
  Write-Output "Open a new shell before running: rendo --help"
} elseif ($pathAlreadyContained) {
  Write-Output "User PATH already contains: $binDir"
}
Write-Output ($payload | ConvertTo-Json -Compress)
