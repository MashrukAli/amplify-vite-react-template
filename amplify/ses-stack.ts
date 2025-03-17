import { aws_iam, Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';

class SesStackImpl extends Stack {
  public resources = {};
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // SES Email Identity (verified domain/email)
    const emailIdentity = new ses.EmailIdentity(this, 'EmailIdentity', {
      identity: ses.Identity.email('syedmashrukali@gmail.com'),
    });
    // IAM policy for sending emails via SES
    const sesPolicy = new aws_iam.PolicyStatement({
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
    });
    // Export email identity ARN if needed elsewhere
    new CfnOutput(this, 'SESIdentityArn', { value: emailIdentity.emailIdentityName });
  }
}

export const SesStack = {
  getInstance: () => new SesStackImpl(undefined as unknown as Construct, 'SesStack')
};
