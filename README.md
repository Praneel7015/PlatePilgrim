# PlatePilgrim 🌍

> "Turn every meal into a passport stamp."

A full-stack AWS application built for The Full Stack Challenge (August 2026). Log dishes from around the world, unlock country stamps on an interactive world map, and dare yourself to cook something new every day — powered by Amazon Bedrock.

---

## Architecture

```
Browser → CloudFront → S3 (SPA) + API Gateway → Lambda → DynamoDB / Bedrock
Auth: Cognito Hosted UI (Authorization Code grant)
IaC:  AWS CDK (TypeScript)
CI/CD: GitHub Actions
```

## Quick Start

### Prerequisites
- AWS account + AWS CLI configured (`ap-south-1`)
- Node.js 20+
- AWS CDK v2 (`npm install -g aws-cdk`)

### 1. Deploy infrastructure

```bash
cd infra
npm install
npx cdk bootstrap   # first time only
npx cdk deploy
```

Note the outputs — you'll need:
- `UserPoolClientId`
- `CognitoHostedUiDomain`
- `CloudFrontDomain`
- `FrontendBucketName`
- `CloudFrontDistributionId`

### 2. Update Cognito callback URL

After the first deploy, add the CloudFront domain to the Cognito User Pool Client's allowed callback URLs:

```bash
aws cognito-idp update-user-pool-client \
  --user-pool-id <UserPoolId> \
  --client-id <UserPoolClientId> \
  --callback-urls "https://<CloudFrontDomain>/callback" "http://localhost:5173/callback" \
  --logout-urls "https://<CloudFrontDomain>" "http://localhost:5173" \
  --supported-identity-providers COGNITO \
  --allowed-o-auth-flows code \
  --allowed-o-auth-scopes openid email profile \
  --allowed-o-auth-flows-user-pool-client
```

### 3. Configure and run the frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in VITE_COGNITO_DOMAIN and VITE_COGNITO_CLIENT_ID from CDK outputs
# Set VITE_API_URL to your API Gateway endpoint for local dev
npm install --legacy-peer-deps
npm run dev
```

### 4. Deploy frontend

```bash
# From repo root
npm run build --prefix frontend
aws s3 sync frontend/dist s3://<FrontendBucketName> --delete
aws cloudfront create-invalidation --distribution-id <CloudFrontDistributionId> --paths "/*"
```

Or just push to `main` — GitHub Actions does it automatically.

## GitHub Actions Secrets

Set these in your repo → Settings → Secrets:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret |
| `VITE_COGNITO_DOMAIN` | e.g. `https://platepilgrim.auth.ap-south-1.amazoncognito.com` |
| `VITE_COGNITO_CLIENT_ID` | From CDK output `UserPoolClientId` |

## Project Structure

```
PlatePilgrim/
├── backend/
│   ├── lambdas/mealsApi/     # Meal CRUD + stamp logic + Bedrock fun facts
│   ├── lambdas/dareApi/      # Random country + Bedrock recipe generation
│   ├── shared/               # DynamoDB helpers + country data
│   └── local-server.js       # Express dev server
├── frontend/
│   └── src/
│       ├── components/       # WorldMap, PassportDrawer, MealLogger, DareCard, DarkModeToggle
│       ├── auth.ts           # Cognito Hosted UI helpers
│       └── api.ts            # Typed API client
├── infra/
│   └── lib/plate-pilgrim-stack.ts  # CDK stack (all AWS resources)
├── docs/
│   └── builder-center-article.md
└── .github/workflows/deploy.yml
```

## Dark Mode

Supported — toggle with the 🌚/🌞 button in the header. Preference is persisted in `localStorage`.
