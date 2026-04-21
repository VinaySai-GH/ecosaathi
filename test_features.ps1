# 🧪 EcoSaathi Feature Testing Script (PowerShell)
# Tests City Eco Score + WhatsApp Bot Integration
# Usage: .\test_features.ps1 -JwtToken "your_jwt_token"

param(
    [string]$JwtToken = "your_jwt_token_here"
)

$apiBase = "http://localhost:5000/api"

Write-Host "🌿 EcoSaathi Feature Test Suite" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Test 1: City Eco Score
Write-Host "Test 1: City Eco Score" -ForegroundColor Yellow
Write-Host "GET /api/spots/stats/eco-score" -ForegroundColor Cyan
Write-Host "---"

try {
    $score = Invoke-RestMethod -Uri "$apiBase/spots/stats/eco-score?city=Tirupati"
    Write-Host ($score | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ City Eco Score test complete" -ForegroundColor Green
Write-Host ""

# Test 2: Bot Registration
Write-Host "Test 2: Bot Registration" -ForegroundColor Yellow
Write-Host "POST /api/bot/register" -ForegroundColor Cyan
Write-Host "---"

try {
    $body = @{
        preferred_time = "21:00"
    } | ConvertTo-Json

    $botReg = Invoke-RestMethod -Uri "$apiBase/bot/register" `
        -Method Post `
        -Headers @{
            "Authorization" = "Bearer $JwtToken"
            "Content-Type" = "application/json"
        } `
        -Body $body

    Write-Host ($botReg | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Bot registration test complete" -ForegroundColor Green
Write-Host ""

# Test 3: Get Bot Status
Write-Host "Test 3: Get Bot Status" -ForegroundColor Yellow
Write-Host "GET /api/bot/status" -ForegroundColor Cyan
Write-Host "---"

try {
    $botStatus = Invoke-RestMethod -Uri "$apiBase/bot/status" `
        -Headers @{
            "Authorization" = "Bearer $JwtToken"
        }

    Write-Host ($botStatus | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Bot status test complete" -ForegroundColor Green
Write-Host ""

# Test 4: Simulate Webhook Message
Write-Host "Test 4: Webhook Message (Simulate WhatsApp)" -ForegroundColor Yellow
Write-Host "POST /api/bot/webhook" -ForegroundColor Cyan
Write-Host "---"

try {
    $webhookBody = @{
        entry = @(
            @{
                changes = @(
                    @{
                        value = @{
                            messages = @(
                                @{
                                    from = "919876543210"
                                    text = @{
                                        body = "Y"
                                    }
                                }
                            )
                        }
                    }
                )
            }
        )
    } | ConvertTo-Json -Depth 5

    $webhook = Invoke-RestMethod -Uri "$apiBase/bot/webhook" `
        -Method Post `
        -Headers @{
            "Content-Type" = "application/json"
        } `
        -Body $webhookBody

    Write-Host ($webhook | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Webhook test complete" -ForegroundColor Green
Write-Host ""

# Test 5: Get Insights
Write-Host "Test 5: Get Bot Insights" -ForegroundColor Yellow
Write-Host "GET /api/bot/insights" -ForegroundColor Cyan
Write-Host "---"

try {
    $insights = Invoke-RestMethod -Uri "$apiBase/bot/insights" `
        -Headers @{
            "Authorization" = "Bearer $JwtToken"
        }

    Write-Host ($insights | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Insights test complete" -ForegroundColor Green
Write-Host ""

# Test 6: Update Preferences
Write-Host "Test 6: Update Bot Preferences" -ForegroundColor Yellow
Write-Host "PATCH /api/bot/preferences" -ForegroundColor Cyan
Write-Host "---"

try {
    $prefsBody = @{
        preferred_time = "22:00"
    } | ConvertTo-Json

    $prefs = Invoke-RestMethod -Uri "$apiBase/bot/preferences" `
        -Method Patch `
        -Headers @{
            "Authorization" = "Bearer $JwtToken"
            "Content-Type" = "application/json"
        } `
        -Body $prefsBody

    Write-Host ($prefs | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Preferences update test complete" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  - Replace 'your_jwt_token_here' with actual JWT token"
Write-Host "  - Make sure backend is running on :5000"
Write-Host "  - Check MongoDB is connected"
Write-Host ""
