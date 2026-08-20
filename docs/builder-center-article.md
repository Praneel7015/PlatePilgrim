# Full Stack Challenge: PlatePilgrim

**Turn every meal into a passport stamp.**

PlatePilgrim is a full-stack AWS application built for The Full Stack Challenge — a 48-hour sprint to build and ship a real web app on AWS. My random word was **Journey**, and this is my interpretation: a culinary world tour you take one dish at a time.

---

## Vision and What It Does

Most of us eat the same five cuisines on rotation. PlatePilgrim asks a simple question: *what if every meal was a step toward exploring the world?*

The app turns food logging into a passport system. Log a dish from a new country and that country lights up on an interactive world map. Log three dishes from the same country and you earn a passport stamp — a hand-press SVG badge that says you've genuinely explored that cuisine. A **Dare Me a Dish** button spins the globe and challenges you with a random unexplored country, complete with an AI-generated beginner recipe from Amazon Bedrock.

**Who is it for?** Anyone curious about food, people learning to cook, and anyone who wants a playful way to track their culinary adventurousness.

**The problem it solves:** Food apps are either calorie trackers (clinical) or recipe platforms (passive). PlatePilgrim is neither — it's a *game layer on top of eating*, designed to spark curiosity and make trying new cuisines feel like a genuine achievement. The world map is the progress bar. The passport stamp is the trophy.

---

## Full Stack Breakdown

This project maps directly to what I absorbed across The Full Stack series:

- **Pitch:** The "Journey" prompt immediately suggested travel, and food is the most accessible form of travel. The culinary passport metaphor locked in within the first five minutes — clear hook, clear user, clear feedback loop. I wrote the idea down before I touched a keyboard.

- **Prototype:** I started with the world map alone. Getting `react-simple-maps` to color countries based on meal data proved the core mechanic worked visually before I wrote a single Lambda. Seeing Thailand go red after typing "Pad Thai" was the moment I knew the concept held.

- **MVP:** Three Lambda functions (meal CRUD + stamp logic, dare generator, Bedrock fun facts), one DynamoDB table, Cognito auth, and a working map. No frills — just the loop that matters: log a dish → watch the map update → earn a stamp.

- **UX:** The design system uses a cool off-white background (`#F7F7F5`), punchy coral-red (`#DC3220`), and muted map colors so explored/stamped countries read as clear signal against noise. Every color is a CSS custom property — the entire theme (including full dark mode) flips by toggling one class on the `<html>` element. The SVG passport stamp animates in with a `stamp-press` keyframe that mimics the physical feeling of ink hitting paper.

- **Launch:** A GitHub Actions CI/CD pipeline deploys infra via CDK and the frontend via S3 sync on every push to `main`. The whole deploy — infra diff check, frontend build, S3 sync, CloudFront invalidation — runs in under three minutes.

---

## How I Built It

**Development process:** I built in parallel tracks rather than sequentially. The CDK infra skeleton, backend Lambdas, and React frontend scaffold all went up at the same time. DynamoDB's single-table design was decided early, because it keeps Lambda code minimal and access patterns predictable from day one.

**Key technical decisions:**

- *Single-table DynamoDB over multiple tables* — All user data lives under `PK: USER#<sub>` with sort keys like `MEAL#<timestamp>` and `STAMP#<countryCode>`. Keeps costs near zero, IAM grants minimal, and query logic in one place.
- *Cognito Hosted UI over custom auth* — Saves days of auth plumbing. The SPA redirects to Cognito's Hosted UI, exchanges an authorization code for tokens, and stores the access token in `sessionStorage`. MFA and account recovery come free.
- *CloudFront as the single entry point* — The `/api/*` behavior proxies to API Gateway. The frontend uses relative paths (`/api/meals`) in production — no hard-coded endpoints, no CORS headaches, no env var gymnastics. The API Gateway URL can change without touching a line of frontend code.
- *Amazon Bedrock for generative content* — Instead of a static recipe database, Bedrock Nova Lite generates contextual, beginner-friendly recipes on demand. Each logged meal also gets a Bedrock-generated fun fact. Adding Bedrock to the meal-logging flow took about 20 lines of code and makes the UX feel meaningfully richer.

**Challenges and how I overcame them:**

- *ISO code mismatch:* `react-simple-maps` uses ISO numeric codes from the world-atlas TopoJSON, but my data layer uses ISO alpha-2 codes (`IN`, `JP`). I read the alpha-2 from a secondary property (`ISO_A2_EH`) that the world-atlas GeoJSON exposes, which resolved the mapping cleanly.
- *Bedrock region:* The APAC cross-region inference profile (`apac.amazon.nova-lite-v1:0`) requires the Lambda to run in `ap-south-1`. Invoking it from the wrong region returns a silent `ValidationException`. Documenting this upfront would have saved 30 minutes.
- *CloudFront SPA routing:* S3 with Origin Access Control returns a `403` (not `404`) for missing paths, so the standard CloudFront 404→`index.html` redirect didn't catch `/callback`. I added a second error response handler for `403` errors to also serve `index.html` — critical for the Cognito redirect flow to work.
- *Cognito callback URL:* The Cognito app client's allowed callback URLs must include the CloudFront domain, which is only known after the first `cdk deploy`. I left a documented placeholder and updated the CDK stack on the second deploy.

---

## AWS Services / Architecture

```
Browser
  └── CloudFront (CDN + unified entry point)
        ├── /api/*  →  API Gateway HTTP API  →  AWS Lambda
        │                 (JWT authorizer)       ├── mealsApi  →  DynamoDB
        │                                        └── dareApi   →  Amazon Bedrock
        └── /*      →  S3 (React SPA, OAC)

Auth:  Amazon Cognito User Pool + Hosted UI (Authorization Code + PKCE)
IaC:   AWS CDK (TypeScript)
CI/CD: GitHub Actions
```

| Service | Role |
|---|---|
| **Amazon CloudFront** | CDN + single entry point; routes `/api/*` to API Gateway, `/*` to S3 |
| **Amazon S3** | Hosts the compiled React/Vite SPA; access via CloudFront OAC only (no public bucket) |
| **Amazon API Gateway (HTTP)** | Exposes Lambda routes; JWT authorizer validates Cognito access tokens on every request |
| **AWS Lambda × 2** | `mealsApi` — meal CRUD, stamp awarding, Bedrock fun facts; `dareApi` — random country pick + Bedrock recipe |
| **Amazon DynamoDB** | Single-table design; on-demand billing; stores meals and stamps per user |
| **Amazon Cognito** | User Pool + Hosted UI; Authorization Code grant; handles sign-up, sign-in, and token refresh |
| **Amazon Bedrock (Nova Lite)** | Generates a fun fact per logged dish and a full beginner recipe + tips for each dare |
| **AWS CDK (TypeScript)** | Infrastructure as code — one `cdk deploy` provisions and wires all resources |
| **GitHub Actions** | CI/CD: CDK deploy → `npm run build` → S3 sync → CloudFront invalidation on every `main` push |

---

## What I Learned

**Amazon Bedrock is surprisingly ergonomic as a microservice.** The `InvokeModelCommand` with Nova Lite's message format is concise, the latency is under two seconds, and the output quality for beginner recipe generation is genuinely good. I initially planned to use Bedrock only for the dare feature; adding it to meal logging for fun facts took 20 lines and meaningfully elevated the experience.

**Single-table DynamoDB design pays off immediately.** Choosing the access patterns first (`get all meals for user`, `check if stamp exists`, `award stamp`) and working backward to the key design meant I never wrote a join, never hit a cross-table transaction, and the Lambda IAM policy is one table ARN. The mental overhead is upfront; the operational overhead stays near zero.

**CloudFront as a unified API proxy is underrated for SPAs.** Routing `/api/*` through a CloudFront behavior to API Gateway turns the entire backend into a single relative URL. No CORS configuration, no environment variable management, no hard-coded URLs. The frontend works identically in development (pointing at a local Express server) and in production (pointing at the CloudFront domain).

**The Cognito Hosted UI is the right trade for solo projects.** I've built custom auth flows before. The Hosted UI trades some design control for zero auth bugs, built-in MFA support, account recovery, and no token management code. For a 48-hour sprint, that trade is obviously correct.

**Parallel development with CDK outputs requires discipline.** Because the CloudFront domain and Cognito callback URL are circular (each depends on the other being deployed first), I had to do a two-pass deploy: skeleton stack → get CloudFront domain → update Cognito allowed URLs → redeploy. Documenting this in the README before forgetting it was one of the better decisions I made.

---

## Link to App / Repo

- **Live app:** https://d216erfdefvgq6.cloudfront.net
- **GitHub:** https://github.com/Praneel7015/PlatePilgrim

---

*Built for The Full Stack Challenge — August 2026. Random word: Journey.*
