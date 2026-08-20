import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaBase from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import * as apigwIntegrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as apigwAuthorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";

export class PlatePilgrimStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---------- Cognito User Pool ----------
    const userPool = new cognito.UserPool(this, "PlatePilgrimUserPool", {
      userPoolName: "platepilgrim-users",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "PlatePilgrimWebClient",
      {
        userPool,
        userPoolClientName: "platepilgrim-web",
        generateSecret: false,
        authFlows: {
          userSrp: true,
          userPassword: false,
        },
        oAuth: {
          flows: { authorizationCodeGrant: true },
          scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
          // callbackUrls updated after first deploy when CloudFront domain is known
          callbackUrls: ["http://localhost:5173/callback"],
          logoutUrls: ["http://localhost:5173"],
        },
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.COGNITO,
        ],
      }
    );

    const hostedUiDomain = new cognito.UserPoolDomain(
      this,
      "PlatePilgrimDomain",
      {
        userPool,
        cognitoDomain: {
          // Must be globally unique — change if taken
          domainPrefix: "platepilgrim",
        },
      }
    );

    // ---------- DynamoDB (single-table) ----------
    const table = new dynamodb.Table(this, "PlatePilgrimTable", {
      tableName: "PlatePilgrimData",
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: false,
    });

    // ---------- Shared Lambda env ----------
    const sharedEnv = {
      TABLE_NAME: table.tableName,
      BEDROCK_MODEL_ID: "apac.amazon.nova-lite-v1:0",
      BEDROCK_REGION: "ap-south-1",
    };

    const commonFnProps: Partial<lambda.NodejsFunctionProps> = {
      runtime: lambdaBase.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      depsLockFilePath: path.join(__dirname, "../../backend/package-lock.json"),
      projectRoot: path.join(__dirname, "../../backend"),
      bundling: {
        format: lambda.OutputFormat.ESM,
        target: "node20",
        externalModules: [],
      },
    };

    // ---------- mealsApi Lambda ----------
    const mealsApiFn = new lambda.NodejsFunction(this, "MealsApiFn", {
      functionName: "platepilgrim-mealsApi",
      entry: path.join(__dirname, "../../backend/lambdas/mealsApi/index.mjs"),
      handler: "handler",
      ...commonFnProps,
      environment: sharedEnv,
    });
    table.grantReadWriteData(mealsApiFn);
    mealsApiFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: ["*"],
      })
    );

    // ---------- dareApi Lambda ----------
    const dareApiFn = new lambda.NodejsFunction(this, "DareApiFn", {
      functionName: "platepilgrim-dareApi",
      entry: path.join(__dirname, "../../backend/lambdas/dareApi/index.mjs"),
      handler: "handler",
      ...commonFnProps,
      environment: sharedEnv,
    });
    table.grantReadData(dareApiFn);
    dareApiFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: ["*"],
      })
    );

    // ---------- API Gateway (HTTP API + JWT Authorizer) ----------
    const authorizer = new apigwAuthorizers.HttpJwtAuthorizer(
      "CognitoJwtAuthorizer",
      `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
      }
    );

    const httpApi = new apigw.HttpApi(this, "PlatePilgrimApi", {
      apiName: "platepilgrim-api",
      corsPreflight: {
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: [
          apigw.CorsHttpMethod.GET,
          apigw.CorsHttpMethod.POST,
          apigw.CorsHttpMethod.DELETE,
          apigw.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ["*"],
      },
    });

    const mealsIntegration = new apigwIntegrations.HttpLambdaIntegration(
      "MealsIntegration",
      mealsApiFn
    );
    const dareIntegration = new apigwIntegrations.HttpLambdaIntegration(
      "DareIntegration",
      dareApiFn
    );

    // Protected routes — require Cognito JWT
    const jwtRouteOptions: apigw.AddRoutesOptions = {
      authorizer,
      authorizationScopes: [],
      integration: mealsIntegration, // overridden per-route below
    };

    httpApi.addRoutes({
      path: "/meals",
      methods: [apigw.HttpMethod.GET],
      authorizer,
      integration: mealsIntegration,
    });
    httpApi.addRoutes({
      path: "/meals",
      methods: [apigw.HttpMethod.POST],
      authorizer,
      integration: mealsIntegration,
    });
    httpApi.addRoutes({
      path: "/meals/{mealId}",
      methods: [apigw.HttpMethod.DELETE],
      authorizer,
      integration: mealsIntegration,
    });
    httpApi.addRoutes({
      path: "/stamps",
      methods: [apigw.HttpMethod.GET],
      authorizer,
      integration: mealsIntegration,
    });
    httpApi.addRoutes({
      path: "/dare",
      methods: [apigw.HttpMethod.GET],
      authorizer,
      integration: dareIntegration,
    });

    // ---------- S3 + CloudFront ----------
    const siteBucket = new s3.Bucket(this, "PlatePilgrimFrontend", {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const distribution = new cloudfront.Distribution(
      this,
      "PlatePilgrimDistribution",
      {
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        // /api/* proxied to API Gateway
        additionalBehaviors: {
          "/api/*": {
            origin: new origins.HttpOrigin(
              `${httpApi.httpApiId}.execute-api.${this.region}.amazonaws.com`
            ),
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
            allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
            originRequestPolicy:
              cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          },
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    // ---------- Outputs ----------
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: httpApi.apiEndpoint,
      description: "API Gateway endpoint — use /api/* prefix via CloudFront",
    });
    new cdk.CfnOutput(this, "CloudFrontDomain", {
      value: `https://${distribution.distributionDomainName}`,
    });
    new cdk.CfnOutput(this, "CloudFrontDistributionId", {
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: siteBucket.bucketName,
    });
    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "CognitoHostedUiDomain", {
      value: `https://${hostedUiDomain.domainName}.auth.${this.region}.amazoncognito.com`,
    });
    new cdk.CfnOutput(this, "TableName", {
      value: table.tableName,
    });
  }
}
