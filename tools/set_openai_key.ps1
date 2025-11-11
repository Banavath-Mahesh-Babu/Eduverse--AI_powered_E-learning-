# set_openai_key.ps1
# Usage: run this in PowerShell from the repo root to securely set OPENAI_API_KEY in backend/.env
# It reads a secure input (masked) and writes/updates the OPENAI_API_KEY line in backend/.env, making a backup first.

$envPath = Join-Path -Path (Get-Location) -ChildPath "backend\.env"
if (-not (Test-Path $envPath)) {
  Write-Error "backend/.env not found at $envPath"
  exit 1
}

Write-Host "This will update the OPENAI_API_KEY value in backend/.env"
$secure = Read-Host "Paste your OpenAI secret key (it will be hidden)" -AsSecureString
# Convert SecureString to plain text for writing (local only)
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

if (-not $key.StartsWith('sk-')) {
  Write-Warning "The key does not look like a valid OpenAI key (does not start with 'sk-'). Continue? (y/N)"
  $c = Read-Host
  if ($c -ne 'y' -and $c -ne 'Y') { Write-Host 'Aborted.'; exit 1 }
}

# Backup
$bak = "$envPath.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
Copy-Item -Path $envPath -Destination $bak -Force
Write-Host "Backed up existing .env to $bak"

# Replace or add line
(Get-Content $envPath) | ForEach-Object {
  if ($_ -match '^OPENAI_API_KEY=') { "OPENAI_API_KEY=$key" } else { $_ }
} | Set-Content $envPath -Encoding UTF8

Write-Host "Updated backend/.env with new OPENAI_API_KEY (not committed)."
Write-Host "Now restart your backend (from project root):"
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host "After restart, run the ai-health probe:"
Write-Host "  Invoke-RestMethod -Uri \"http://localhost:5000/api/ai-health?probe=1\" -Method GET | ConvertTo-Json -Depth 5" -ForegroundColor Cyan
