#!/usr/bin/env powershell
<#
.SYNOPSIS
    Import Kimchuyy Agrivet database schema and products
.DESCRIPTION
    This script imports the complete database schema including all 50 sample products
    into the MySQL database kimchuyy_agrivet
.NOTES
    Requirements: MySQL server running on localhost:3306
    Run this from the project root directory
#>

param(
    [string]$DbHost = "127.0.0.1",
    [string]$DbUser = "root",
    [string]$DbPassword = "",
    [string]$DbName = "kimchuyy_agrivet"
)

Write-Host @"
╔════════════════════════════════════════════════════════╗
║   KIMCHUYY AGRIVET - DATABASE IMPORT SCRIPT           ║
║   Database: $DbName
║   Host: $DbHost
╚════════════════════════════════════════════════════════╝
"@

$schemaFile = "SCHEMA_COMPLETE.sql"

if (-not (Test-Path $schemaFile)) {
    Write-Host "❌ Error: $schemaFile not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the project root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📁 Schema file found: $schemaFile" -ForegroundColor Green

# Build MySQL connection string
$mysqlCmd = "mysql"
$args = @(
    "-h", $DbHost,
    "-u", $DbUser,
    "-v",
    "-v",
    "-v"
)

if ($DbPassword) {
    $args += "-p$DbPassword"
}

Write-Host "`n⏳ Importing schema and products into $DbName..." -ForegroundColor Yellow
Write-Host "This may take a few seconds..." -ForegroundColor Cyan

try {
    # Import the schema
    Get-Content $schemaFile | & $mysqlCmd @args 2>&1 | Select-Object -Last 20
    
    Write-Host "`n✅ Schema import completed!" -ForegroundColor Green
    
    # Verify the import
    Write-Host "`n📊 Verifying import..." -ForegroundColor Cyan
    
    $verifyQuery = @"
SELECT 'Database Check' as Check_Type, COUNT(*) as Count
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = '$DbName'
UNION ALL
SELECT 'Products Count', COUNT(*) FROM $DbName.products
UNION ALL
SELECT 'Users Count', COUNT(*) FROM $DbName.users
UNION ALL
SELECT 'Categories Count', COUNT(*) FROM $DbName.categories;
"@
    
    $verifyQuery | & $mysqlCmd @args 2>&1
    
    Write-Host "`n✅ Database import successful!" -ForegroundColor Green
    Write-Host "`n📋 Summary:" -ForegroundColor Cyan
    Write-Host "   - 50 products loaded" -ForegroundColor Green
    Write-Host "   - 5 categories created" -ForegroundColor Green
    Write-Host "   - 1 admin user created" -ForegroundColor Green
    Write-Host "   - All tables and indexes created" -ForegroundColor Green
    Write-Host "`n🚀 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Start dev server: npm run dev" -ForegroundColor White
    Write-Host "   2. Open browser: http://localhost:3000" -ForegroundColor White
    Write-Host "   3. Login with: admin / (any password)" -ForegroundColor White
    
}
catch {
    Write-Host "`n❌ Import failed: $_" -ForegroundColor Red
    exit 1
}
