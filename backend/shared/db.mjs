// Shared DynamoDB DocumentClient helpers for PlatePilgrim Lambdas.
// Single-table design — PK/SK access patterns:
//   PK: USER#<cognitoSub>  SK: MEAL#<isoTimestamp>#<uuid>  → meal log entry
//   PK: USER#<cognitoSub>  SK: STAMP#<countryCode>         → earned passport stamp
//   PK: USER#<cognitoSub>  SK: META                        → profile / streak info

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE = process.env.TABLE_NAME;

/** Build a USER# partition key. */
export const userPK = (sub) => `USER#${sub}`;

/** Query all items for a user with an optional SK prefix filter. */
export async function queryUser(sub, skPrefix = null) {
  const params = {
    TableName: TABLE,
    KeyConditionExpression: skPrefix
      ? "pk = :pk AND begins_with(sk, :prefix)"
      : "pk = :pk",
    ExpressionAttributeValues: skPrefix
      ? { ":pk": userPK(sub), ":prefix": skPrefix }
      : { ":pk": userPK(sub) },
  };
  const res = await ddb.send(new QueryCommand(params));
  return res.Items ?? [];
}

/** Count items for a user with a given SK prefix. */
export async function countByPrefix(sub, skPrefix) {
  const params = {
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    ExpressionAttributeValues: { ":pk": userPK(sub), ":prefix": skPrefix },
    Select: "COUNT",
  };
  const res = await ddb.send(new QueryCommand(params));
  return res.Count ?? 0;
}

/** Put a single item. */
export async function putItem(item) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
}

/** Get a single item by PK + SK. */
export async function getItem(pk, sk) {
  const res = await ddb.send(new GetCommand({ TableName: TABLE, Key: { pk, sk } }));
  return res.Item ?? null;
}

/** Delete a single item by PK + SK. */
export async function deleteItem(pk, sk) {
  await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk, sk } }));
}

/** Update specific attributes on an item. */
export async function updateItem(pk, sk, updates) {
  const sets = [];
  const names = {};
  const values = {};

  for (const [key, val] of Object.entries(updates)) {
    sets.push(`#${key} = :${key}`);
    names[`#${key}`] = key;
    values[`:${key}`] = val;
  }

  if (!sets.length) return;

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { pk, sk },
      UpdateExpression: `SET ${sets.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

/** Standard JSON HTTP response helper (used by all Lambdas). */
export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}
