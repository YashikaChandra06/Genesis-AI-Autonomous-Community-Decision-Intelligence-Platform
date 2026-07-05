# PowerShell script to commit each file with different comments and push

$commitMessages = @{
    "README.md" = "docs: update documentation and project overview in README"
    ".gitignore" = "chore: add gitignore configuration"
    "eslint.config.mjs" = "chore: configure ESLint rules for code quality"
    "next.config.ts" = "chore: configure Next.js project settings"
    "package-lock.json" = "chore: lock project dependencies"
    "package.json" = "chore: update project dependencies and metadata"
    "postcss.config.mjs" = "chore: configure PostCSS for styling"
    "public/file.svg" = "assets: add file icon asset"
    "public/globe.svg" = "assets: add globe icon asset"
    "public/next.svg" = "assets: add next.js framework icon asset"
    "public/vercel.svg" = "assets: add vercel deployment icon asset"
    "public/window.svg" = "assets: add window icon asset"
    "render.yaml" = "chore: add Render deployment infrastructure blueprint"
    "src/app/api/chat/route.ts" = "feat: add route handler for Gemini chatbot integrations"
    "src/app/dashboard/admin/page.tsx" = "feat: add System Administration dashboard page for role and DB management"
    "src/app/dashboard/alerts/page.tsx" = "feat: add incident alerts feed interface with clearance filters"
    "src/app/dashboard/assistant/page.tsx" = "feat: add AI Assistant dashboard panel for telemetry queries"
    "src/app/dashboard/layout.tsx" = "feat: add core responsive layout structure for dashboard views"
    "src/app/dashboard/map/page.tsx" = "feat: add smart city sensing dashboard view with routing options"
    "src/app/dashboard/page.tsx" = "feat: add dashboard overview telemetry grid and incident lists"
    "src/app/dashboard/reports/page.tsx" = "feat: add PDF reports generation engine for city metrics"
    "src/app/dashboard/settings/page.tsx" = "feat: add user profile settings console with API key management"
    "src/app/dashboard/simulator/page.tsx" = "feat: add scenario simulator engine for crisis impact forecasting"
    "src/app/favicon.ico" = "assets: add page favicon"
    "src/app/globals.css" = "style: add global style sheets with glassmorphism utility classes"
    "src/app/layout.tsx" = "style: add root HTML wrapper and Outfit typography font provider"
    "src/app/login/page.tsx" = "feat: add custom theme login window with quick bypass shortcuts"
    "src/app/page.tsx" = "feat: add responsive glassmorphic landing page with interactive highlights"
    "src/app/register/page.tsx" = "feat: add security profile registration dashboard"
    "src/components/map/LiveMap.tsx" = "feat: add Leaflet live smart map component with geospatial sensing layers"
    "src/components/ui/GlassCard.tsx" = "feat: add reusable glassmorphism layout card component with border glow"
    "src/components/ui/MetricCard.tsx" = "feat: add reusable telemetry metric card component with micro-animations"
    "src/services/firebase.ts" = "feat: add unified mock/real Firebase database and authentication facades"
    "src/services/gemini.ts" = "feat: add Gemini SDK API service integration layer"
    "src/utils/cn.ts" = "chore: add tailwind class merger utility"
    "tsconfig.json" = "chore: configure TypeScript compiler targets"
}

# Run git status to find modified and untracked files
$status = git status --porcelain -u

foreach ($line in $status) {
    if ($line -match '^.[M?]\s+(.*)$') {
        $file = $Matches[1].Trim()
        # Normalize backslashes to forward slashes for cross-platform compatibility
        $fileNormalized = $file.Replace('\', '/')
        
        $msg = $commitMessages[$fileNormalized]
        if (-not $msg) {
            $msg = "feat: update $fileNormalized"
        }
        
        Write-Host "Staging and committing $fileNormalized..."
        git add $file
        git commit -m "$msg"
    }
}

Write-Host "Pushing all commits to remote..."
git push origin main
