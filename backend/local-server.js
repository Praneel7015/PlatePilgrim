// Local dev server for PlatePilgrim backend — mirrors Lambda routing without AWS.
// Requires: express, cors (installed as devDependencies)
// Usage: node local-server.js
// Set environment variables in a .env file or export them before running.

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Inject a fake JWT sub for local dev
app.use((req, _res, next) => {
  req.localSub = "local-dev-user";
  next();
});

function mockEvent(req) {
  return {
    requestContext: {
      http: { method: req.method },
      authorizer: { jwt: { claims: { sub: req.localSub } } },
    },
    rawPath: req.path,
    pathParameters: req.params,
    queryStringParameters: req.query,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body) : null,
  };
}

async function mountLambda(app, methods, path, lambdaPath) {
  const mod = await import(lambdaPath);
  for (const method of methods) {
    app[method](path, async (req, res) => {
      const result = await mod.handler(mockEvent(req));
      res.status(result.statusCode).set(result.headers).send(result.body);
    });
  }
}

async function boot() {
  await mountLambda(app, ["get", "post"], "/meals", "./lambdas/mealsApi/index.mjs");
  await mountLambda(app, ["delete"], "/meals/:mealId", "./lambdas/mealsApi/index.mjs");
  await mountLambda(app, ["get"], "/stamps", "./lambdas/mealsApi/index.mjs");
  await mountLambda(app, ["get"], "/dare", "./lambdas/dareApi/index.mjs");

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`PlatePilgrim local API: http://localhost:${PORT}`));
}

boot().catch(console.error);
