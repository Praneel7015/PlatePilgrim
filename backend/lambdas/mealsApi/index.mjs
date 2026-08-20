// mealsApi — PlatePilgrim
// POST   /meals                → log a new meal, auto-award stamp at 3 dishes per country
// GET    /meals                → list all meal logs for the authenticated user
// DELETE /meals/{mealId}       → delete a meal log entry
// Auth: API Gateway JWT authorizer (Cognito) injects $context.authorizer.claims.sub

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { randomUUID } from "node:crypto";

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});
const bedrock = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || "ap-south-1",
});

const TABLE = process.env.TABLE_NAME;
const BEDROCK_MODEL = process.env.BEDROCK_MODEL_ID || "apac.amazon.nova-lite-v1:0";

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
    body: JSON.stringify(body),
  };
}

function userPK(sub) {
  return `USER#${sub}`;
}

/** Ask Bedrock for a one-line fun fact about the dish/country. Falls back silently. */
async function getFunFact(dish, countryName) {
  try {
    const prompt = `Give me exactly one short, delightful fun fact (max 20 words) about ${dish} from ${countryName} cuisine. No preamble, just the fact.`;
    const body = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 80, temperature: 0.8 },
    };
    const res = await bedrock.send(
      new InvokeModelCommand({
        modelId: BEDROCK_MODEL,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(body),
      })
    );
    const decoded = JSON.parse(new TextDecoder().decode(res.body));
    const text =
      decoded?.output?.message?.content?.map((c) => c.text).join("") ?? "";
    return text.trim() || null;
  } catch {
    return null;
  }
}

/** Count how many meals this user has logged for a specific country. */
async function countMealsForCountry(sub, countryCode) {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      FilterExpression: "countryCode = :cc",
      ExpressionAttributeValues: {
        ":pk": userPK(sub),
        ":prefix": "MEAL#",
        ":cc": countryCode.toUpperCase(),
      },
    })
  );
  return res.Count ?? 0;
}

/** Award a passport stamp if the user just hit the 3-meal threshold. */
async function maybeAwardStamp(sub, countryCode, countryName) {
  const stampSK = `STAMP#${countryCode.toUpperCase()}`;
  const existing = await ddb.send(
    new GetCommand({ TableName: TABLE, Key: { pk: userPK(sub), sk: stampSK } })
  );
  if (existing.Item) return false; // already stamped

  const count = await countMealsForCountry(sub, countryCode);
  if (count >= 3) {
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          pk: userPK(sub),
          sk: stampSK,
          countryCode: countryCode.toUpperCase(),
          countryName,
          earnedAt: new Date().toISOString(),
        },
      })
    );
    return true;
  }
  return false;
}

async function logMeal(sub, body) {
  const { dish, countryCode, countryName, notes = "", photoUrl = null } = body;
  if (!dish || !countryCode || !countryName) {
    return json(400, { error: "dish, countryCode, and countryName are required" });
  }

  const mealId = randomUUID();
  const now = new Date().toISOString();
  const sk = `MEAL#${now}#${mealId}`;

  const funFact = await getFunFact(dish, countryName);

  const item = {
    pk: userPK(sub),
    sk,
    mealId,
    dish,
    countryCode: countryCode.toUpperCase(),
    countryName,
    notes,
    photoUrl,
    funFact,
    loggedAt: now,
  };

  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));

  const stampAwarded = await maybeAwardStamp(sub, countryCode, countryName);

  return json(201, { meal: item, stampAwarded });
}

async function listMeals(sub) {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      ExpressionAttributeValues: { ":pk": userPK(sub), ":prefix": "MEAL#" },
      ScanIndexForward: false, // newest first
    })
  );
  return json(200, { meals: res.Items ?? [] });
}

async function getStamps(sub) {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      ExpressionAttributeValues: { ":pk": userPK(sub), ":prefix": "STAMP#" },
    })
  );
  return json(200, { stamps: res.Items ?? [] });
}

async function deleteMeal(sub, mealId) {
  // We need to find the full SK (includes timestamp prefix) by scanning user's meals
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      FilterExpression: "mealId = :mid",
      ExpressionAttributeValues: {
        ":pk": userPK(sub),
        ":prefix": "MEAL#",
        ":mid": mealId,
      },
    })
  );
  const item = res.Items?.[0];
  if (!item) return json(404, { error: "Meal not found" });

  await ddb.send(
    new DeleteCommand({ TableName: TABLE, Key: { pk: userPK(sub), sk: item.sk } })
  );
  return json(200, { deleted: true, mealId });
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return json(200, {});
  }

  const sub = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (!sub) return json(401, { error: "Unauthorized" });

  const method = event.requestContext?.http?.method;
  const rawPath = (event.rawPath || "").replace(/^\/api/, "") || "/";
  const mealId = event.pathParameters?.mealId;

  try {
    if (method === "GET" && rawPath === "/meals") return await listMeals(sub);
    if (method === "GET" && rawPath === "/stamps") return await getStamps(sub);
    if (method === "POST" && rawPath === "/meals") {
      const body = JSON.parse(event.body || "{}");
      return await logMeal(sub, body);
    }
    if (method === "DELETE" && mealId) return await deleteMeal(sub, mealId);
    return json(404, { error: "Route not found" });
  } catch (err) {
    console.error("mealsApi error:", err);
    return json(500, { error: "Internal server error" });
  }
};
