#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkpipelinesDemoStack } from '../lib/cdkpipelines-demo-stack';

const app = new cdk.App();
const MyCodePipeline = new CdkpipelinesDemoStack(app, 'CdkpipelinesDemoStack',{
    env:{
        account: "881385135648",
        region: "us-east-1"
    }
});

cdk.Tags.of(MyCodePipeline).add('Team', 'DSS-DM-Skynet');
cdk.Tags.of(MyCodePipeline).add('App', 'SkynetLambdaCodPipeline');
cdk.Tags.of(MyCodePipeline).add('Environment', 'Lab');

app.synth();