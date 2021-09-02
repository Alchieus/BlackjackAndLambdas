#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
//import { CdkpipelinesDemoStack } from '../lib/cdkpipelines-demo-stack';

import { CdkpipelinesDemoPipelineStack } from '../lib/cdkpipelines-demo-pipeline-stack';

import { Version2PipelineStack } from '../lib/version2PipelineStack';

const app = new cdk.App();
const aws_account:string|undefined = process.env.AWS_AccountNumber;
console.log(`process.env.AWS_AccountNumber set to: ${aws_account}`);
if(aws_account === undefined){
  console.error(`Please set your AWS_AccountNumber environment variable`);
  process.exit(1);
}

const aws_region: string|undefined = process.env.AWS_Region;
console.log(`process.env.AWS_Region set to: ${aws_region}`)
if(aws_region===undefined){
  console.error(`Please set your AWS_Region environment variable`);
  process.exit(1);
}

// const MyCodePipeline = new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
//     env:{
//         account: aws_account,
//         region: aws_region
//     }
//   });

const MyCodePipeline = new Version2PipelineStack(app, 'Version2PipelineStack', {
  env:{
      account: aws_account,
      region: aws_region
  }
});

cdk.Tags.of(MyCodePipeline).add('App', 'LambdaCodPipeline');
cdk.Tags.of(MyCodePipeline).add('Environment', 'Development');

app.synth();