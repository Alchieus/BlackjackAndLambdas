import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from "./cdkpipelines-demo-stage"

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // sourceArtifact holds the source code from the repo
    const sourceArtifact = new codepipeline.Artifact();

    // cloudAssemblyArtifact holds the result of the build pipeline, the built code, the cloudformation template, etc
    const cloudAssemblyArtifact = new codepipeline.Artifact();
 
    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyDemoLambdaServicePipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('AlchieusBlackJackAndLambdasAwsLabAccessToken'),
        owner: 'Alchieus',
        repo: 'BlackjackAndLambdas',
        branch: "main"
      }),

       // How it will be built and synthesized
       synthAction: SimpleSynthAction.standardNpmSynth({
         sourceArtifact,
         cloudAssemblyArtifact,        
         // We need a build step to compile the TypeScript Lambda
         buildCommand: 'npm run build'
       }),
    });

    // This is where we add the application stages
    // ...
    pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, "Pre-Prod", {
      env:{
        account: "881385135648",
        region: "us-east-1"
      }
    }));
  }
}