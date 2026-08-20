# PlatePilgrim — Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  User Browser                                                   │
│  React SPA (Vite + TypeScript + Tailwind)                       │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  Amazon CloudFront Distribution                                 │
│  • Default behaviour → S3 (SPA assets)                         │
│  • /api/* behaviour → API Gateway (APIGW origin)               │
│  • OAC on S3 (no public bucket)                                 │
└───────┬─────────────────────────────┬───────────────────────────┘
        │                             │
        ▼                             ▼
┌───────────────┐       ┌─────────────────────────────────────────┐
│ Amazon S3     │       │ Amazon API Gateway (HTTP API)           │
│ (static SPA)  │       │ JWT Authorizer → Cognito User Pool      │
└───────────────┘       └────────────────┬────────────────────────┘
                                         │
                    ┌────────────────────┼─────────────────────┐
                    │                    │                       │
                    ▼                    ▼                       │
         ┌──────────────────┐  ┌──────────────────┐            │
         │ Lambda: mealsApi │  │ Lambda: dareApi   │            │
         │ POST /meals      │  │ GET  /dare        │            │
         │ GET  /meals      │  └────────┬──────────┘            │
         │ DELETE /meals/:id│           │                        │
         │ GET  /stamps     │           │                        │
         └──────┬───────────┘           │                        │
                │                       │                        │
                ▼                       ▼                        │
         ┌──────────────┐     ┌─────────────────────┐           │
         │ DynamoDB     │     │ Amazon Bedrock       │           │
         │ Single Table │     │ Nova Lite (APAC)     │           │
         │              │◄────│ - Fun facts          │           │
         │ PK: USER#sub │     │ - Beginner recipes   │           │
         │ SK: MEAL#... │     └─────────────────────┘           │
         │ SK: STAMP#.. │                                        │
         └──────────────┘                                        │
                                                                 │
┌────────────────────────────────────────────────────────────────┘
│  Amazon Cognito
│  User Pool + Hosted UI
│  Authorization Code Grant (SPA, no secret)
│  JWT issued → API Gateway validates on every request
└─────────────────────────────────────────────────────────────────

CI/CD: GitHub Actions
  push to main → cdk deploy (infra) → npm build → s3 sync → CF invalidation
```

## DynamoDB Single-Table Design

| Access Pattern | PK | SK |
|---|---|---|
| Get all meals for user | `USER#<sub>` | `begins_with(MEAL#)` |
| Get all stamps for user | `USER#<sub>` | `begins_with(STAMP#)` |
| Check if stamp earned | `USER#<sub>` | `STAMP#<CC>` |
| Single meal entry | `USER#<sub>` | `MEAL#<isoTs>#<uuid>` |

## IAM Surface (minimal)

| Lambda | Permissions |
|---|---|
| `mealsApi` | `dynamodb:GetItem Query PutItem DeleteItem` on table + `bedrock:InvokeModel` |
| `dareApi` | `dynamodb:Query` on table (stamps only) + `bedrock:InvokeModel` |

## CDK Outputs Used in CI/CD

| Output | Used by |
|---|---|
| `FrontendBucketName` | `aws s3 sync` in GitHub Actions |
| `CloudFrontDistributionId` | `aws cloudfront create-invalidation` |
| `ApiEndpoint` | Baked into `VITE_API_URL` for local dev |
| `UserPoolId` / `UserPoolClientId` | Cognito Hosted UI config |
| `CognitoHostedUiDomain` | `VITE_COGNITO_DOMAIN` env var |
