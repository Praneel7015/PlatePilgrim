#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PlatePilgrimStack } from "../lib/plate-pilgrim-stack";

const app = new cdk.App();

new PlatePilgrimStack(app, "PlatePilgrimStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || "ap-south-1",
  },
});
