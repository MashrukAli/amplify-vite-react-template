import { defineFunction } from '@aws-amplify/backend';
import { aws_lambda as lambda, aws_apigateway as apigateway, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// Create a function that returns a Lambda function with API Gateway
const createSendEmailFunction = (scope: Construct) => {
  // Create the Lambda function
  const fn = new lambda.Function(scope, 'SendEmailFunction', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset('./amplify/functions/sendEmail'),
    environment: {
      SENDER_EMAIL: 'syedmashrukali@gmail.com'
    }
  });
  
  // Add SES permissions to the Lambda function
  fn.addToRolePolicy(new iam.PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*']
  }));
  
  // Create API Gateway
  const api = new apigateway.LambdaRestApi(scope, 'SendEmailApi', {
    handler: fn,
    proxy: true,
    defaultCorsPreflightOptions: {
      allowOrigins: ['*'],
      allowMethods: ['POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization']
    }
  });
  
  return fn;
};

