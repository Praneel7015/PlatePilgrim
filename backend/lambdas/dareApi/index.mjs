// dareApi — PlatePilgrim
// GET /dare  → picks a random unexplored country for the user and returns a Bedrock-generated
//              beginner recipe + 3 tips for a signature dish from that country.
// Auth: API Gateway JWT authorizer (Cognito) injects $context.authorizer.claims.sub

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { COUNTRIES, pickRandomUnexplored } from "../../shared/countries.mjs";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
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

/** Fetch country codes the user has already stamped. */
async function getStampedCodes(sub) {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      ProjectionExpression: "countryCode",
      ExpressionAttributeValues: { ":pk": userPK(sub), ":prefix": "STAMP#" },
    })
  );
  return (res.Items ?? []).map((i) => i.countryCode);
}

/** Build a Bedrock prompt for a beginner-friendly dish challenge. */
function buildRecipePrompt(country) {
  return `You are a friendly world-cuisine guide helping someone explore ${country.cuisine} food for the first time.

Pick ONE iconic, beginner-friendly dish from ${country.name} and provide:
1. Dish name (bold it)
2. A 2-sentence description of what it tastes like
3. A simple ingredient list (5–8 items, home-pantry friendly)
4. 3 numbered cooking tips for a beginner

Keep the whole response under 220 words. Be warm and encouraging — this person is on a culinary journey!`;
}

async function callBedrock(prompt) {
  const body = {
    messages: [{ role: "user", content: [{ text: prompt }] }],
    inferenceConfig: { maxTokens: 400, temperature: 0.75 },
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
  return (
    decoded?.output?.message?.content?.map((c) => c.text).join("") ?? ""
  ).trim();
}

/** Fallback recipe used when Bedrock is unavailable. */
function fallbackRecipe(country) {
  return `Try cooking a traditional dish from ${country.name}! Search for "${country.cuisine} beginner recipe" to get started. ${country.emoji} You've got this!`;
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return json(200, {});
  }

  const sub = event.requestContext?.authorizer?.jwt?.claims?.sub;
  if (!sub) return json(401, { error: "Unauthorized" });

  try {
    const stampedCodes = await getStampedCodes(sub);
    const country = pickRandomUnexplored(stampedCodes);

    if (!country) {
      return json(200, {
        allExplored: true,
        message: "You've stamped every cuisine! You are a true PlatePilgrim. 🌍",
      });
    }

    let recipe;
    try {
      recipe = await callBedrock(buildRecipePrompt(country));
      if (!recipe) throw new Error("empty response");
    } catch (err) {
      console.warn("Bedrock unavailable, using fallback:", err.message);
      recipe = fallbackRecipe(country);
    }

    return json(200, {
      country: {
        code: country.code,
        name: country.name,
        cuisine: country.cuisine,
        continent: country.continent,
        difficulty: country.difficulty,
        emoji: country.emoji,
      },
      recipe,
      allExplored: false,
    });
  } catch (err) {
    console.error("dareApi error:", err);
    return json(500, { error: "Internal server error" });
  }
};
