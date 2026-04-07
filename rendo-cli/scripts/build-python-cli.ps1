param(
  [string]$OutputDir = "dist\\release"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$pythonCliRoot = Join-Path $repoRoot "cli\\python"
$outputRoot = Join-Path $repoRoot $OutputDir
$stagingRoot = Join-Path $outputRoot "asset-staging"
$distRoot = Join-Path $outputRoot "dist"
$workRoot = Join-Path $outputRoot "build"

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  throw "python is required to build the release CLI"
}

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Command
  )

  & $Command[0] $Command[1..($Command.Length - 1)]
  if ($LASTEXITCODE -ne 0) {
    throw "command failed: $($Command -join ' ')"
  }
}

& python -m PyInstaller --version | Out-Null
if ($LASTEXITCODE -ne 0) {
  Invoke-Checked @("python", "-m", "pip", "install", "pyinstaller")
  Invoke-Checked @("python", "-m", "PyInstaller", "--version")
}

Remove-Item -Recurse -Force $stagingRoot,$distRoot,$workRoot -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $stagingRoot,$distRoot,$workRoot | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stagingRoot "rendo_assets\\contracts") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stagingRoot "rendo_assets\\registry") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $stagingRoot "rendo_assets\\templates") | Out-Null

Copy-Item -Recurse -Force (Join-Path $repoRoot "shared\\contracts\\*") (Join-Path $stagingRoot "rendo_assets\\contracts")
Copy-Item -Recurse -Force (Join-Path $repoRoot "shared\\registry\\*") (Join-Path $stagingRoot "rendo_assets\\registry")
Copy-Item -Recurse -Force (Join-Path $repoRoot "shared\\templates\\*") (Join-Path $stagingRoot "rendo_assets\\templates")

Invoke-Checked @(
  "python",
  "-m",
  "PyInstaller",
  "--noconfirm",
  "--clean",
  "--onefile",
  "--name",
  "rendo",
  "--distpath",
  $distRoot,
  "--workpath",
  $workRoot,
  "--specpath",
  $workRoot,
  "--add-data",
  "$($stagingRoot)\\rendo_assets;rendo_assets",
  (Join-Path $pythonCliRoot "rendo.py")
)

if (-not (Test-Path (Join-Path $distRoot "rendo.exe"))) {
  throw "expected release executable was not produced"
}

Write-Output "Built release executable: $(Join-Path $distRoot 'rendo.exe')"
