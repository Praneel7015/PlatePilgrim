# Full Stack Challenge: PlatePilgrim

**Turn every meal into a passport stamp.**

PlatePilgrim is a full-stack AWS application built for The Full Stack Challenge — a 48-hour sprint to build and deploy a real web app on AWS. My random word was **Journey**, and this is my interpretation: a culinary world tour you take one dish at a time.

---

## Vision and What It Does

Most of us eat the same five cuisines on rotation. PlatePilgrim asks a simple question: *what if every meal was a step toward exploring the world?*

The app turns food logging into a passport system. Log a dish from a new country, and that country lights up on an interactive SVG world map. Log three dishes from the same country, and you earn a passport stamp — a little badge that says you've genuinely explored that cuisine. A "Dare Me a Dish" button spins the globe and challenges you with a random unexplored country, complete with an AI-generated beginner recipe from Amazon Bedrock.

**Who is it for?** Anyone curious about food, people learning to cook, or anyone who wants a playful way to track their culinary adventurousness.

**The problem it solves:** Food apps are either calorie trackers (clinical) or recipe platforms (passive). PlatePilgrim is neither — it's a *game layer* on top of eating, designed to spark curiosity and make trying new cuisines feel like an achievement.

---

## Full Stack Breakdown

This project maps directly to what I learned across The Full Stack series:

- **Pitch:** The "Journey" prompt immediately suggested travel, and food is the most accessible form of travel. The culinary passport metaphor came in the first five minutes — it has a clear hook, a clear user, and a clear loop.
- **Prototype:** I started with the world map alone. Getting `react-simple-maps` to color countries based on meal data proved the core mechanic worked visually before I wrote a single Lambda.
- **MVP:** Three Lambda functions (meals CRUD, dare generator, auth), one DynamoDB table, Cognito auth, and a working map. No frills — just the loop: log → see map update → earn stamp.
- **UX:** The vintage travel-poster aesthetic — parchment cream, chili red, saffron gold — was a deliberate choice to make it feel like a journal rather than an app. The passport drawer and stamp animations reinforce the physical metaphor.
- **Launch:** GitHub Actions CI/CD pipeline deploys infra via CDK and frontend via S3 sync on every push to `main`. One push = live in under three minutes.

---

## How I Built It

**Development process:** I built in parallel tracks rather than sequentially. The CDK infra skeleton, backend Lambdas, and frontend scaffold all went up simultaneously. DynamoDB's single-table design (PK: `USER#<sub>`, SK: `MEAL#<timestamp>` or `STAMP#<code>`) was decided early because it keeps the Lambda code simple and the access patterns predictable.

**Key decisions:**
- *Single-table DynamoDB over multiple tables* — Keeps costs near zero and the IAM grants minimal.
- *Cognito Hosted UI over custom auth* — Saves 2+ days of auth plumbing. The SPA just redirects to Cognito and exchanges a code for tokens.
- *CloudFront as the single entry point* — The `/api/*` behavior proxies to API Gateway, so the frontend never hard-codes an API URL in production.
- *Bedrock for fun facts and recipes* — Instead of a static database of recipes, Bedrock Nova Lite generates contextual, beginner-friendly recipes on demand. Each fun fact on a logged meal is also Bedrock-generated.

**Challenges:**
- `react-simple-maps` uses ISO numeric country codes (from the TopoJSON world atlas), but my data layer uses ISO alpha-2 codes (e.g., `IN`, `JP`). I built a manual mapping table for the ~60 countries in the cuisine list.
- The APAC Bedrock cross-region inference profile (`apac.amazon.nova-lite-v1:0`) requires the Lambda to be in `ap-south-1`. This is worth knowing upfront — invoking Bedrock from the wrong region just returns a `ValidationException`.
- Cognito Hosted UI callback URL must be updated after the first CloudFront deploy (since the domain is only known post-`cdk deploy`). I documented this in the README and left a placeholder in the CDK stack.

---

## AWS Services / Architecture

```
Browser → CloudFront (/api/* → API Gateway, /* → S3)
         ↓                          ↓
    S3 (React SPA)        API Gateway HTTP API (JWT auth via Cognito)
                               ↓           ↓
                         mealsApi λ    dareApi λ
                               ↓           ↓
                          DynamoDB    Amazon Bedrock
                                      (Nova Lite APAC)
    Auth: Cognito User Pool + Hosted UI (Authorization Code grant)
    IaC:  AWS CDK (TypeScript)
    CI/CD: GitHub Actions
```

| Service | Role |
|---|---|
| **Amazon CloudFront** | CDN + single entry point; routes `/api/*` to API Gateway |
| **Amazon S3** | Hosts the compiled React/Vite SPA with OAC (no public bucket) |
| **Amazon API Gateway (HTTP)** | REST-style routes; JWT authorizer validates Cognito tokens |
| **AWS Lambda (×2)** | `mealsApi` (CRUD + stamp logic), `dareApi` (Bedrock recipe gen) |
| **Amazon DynamoDB** | Single-table design; on-demand billing |
| **Amazon Cognito** | User Pool + Hosted UI; Authorization Code grant for SPA |
| **Amazon Bedrock (Nova Lite)** | Fun facts per logged dish + full beginner recipes for dares |
| **AWS CDK** | Infrastructure as code — one `cdk deploy` provisions everything |
| **GitHub Actions** | CI/CD: CDK deploy → `npm run build` → S3 sync → CF invalidation |

---

## What I Learned

**Amazon Bedrock is surprisingly usable as a microservice.** I initially planned to use Bedrock only for the dare recipes, but adding it to the meal-logging flow (for fun facts) took about 20 lines of code and makes the UX feel meaningfully richer. The `InvokeModelCommand` with Nova Lite's converse format is concise and the latency (under 2 seconds) is acceptable for a background enrichment call.

**Single-table DynamoDB design pays off fast.** Having all user data in one table with a `PK/SK` pattern means I never write a join and the access patterns are entirely predictable. The CDK stack grants one Lambda one table and that's the whole IAM story.

**CloudFront as a unified entry point is underrated.** Routing `/api/*` through a CloudFront behavior to API Gateway means the frontend just uses relative paths in production — no env var gymnastics, no CORS headaches, no hard-coded endpoints. It also means I can swap the API Gateway URL without touching the frontend at all.

**The Cognito Hosted UI is a great deal for solo projects.** I've built custom auth flows before. The Hosted UI trades some visual polish for zero auth bugs and full MFA/recovery support out of the box. For a challenge sprint, that's the right trade.

---

## Link to App / Repo

- **Live app:** https://[CloudFront domain after deploy]
- **GitHub:** https://github.com/[your-handle]/PlatePilgrim

---

*Built for The Full Stack Challenge — August 2026. Word: Journey.*
