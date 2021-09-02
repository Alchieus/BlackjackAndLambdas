import { Artifact, IAction} from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction, ManualApprovalAction} from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction, ShellScriptAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from "./cdkpipelines-demo-stage"

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // sourceArtifact holds the source code from the repo
    const sourceArtifact = new Artifact();

    // cloudAssemblyArtifact holds the result of the build pipeline, the built code, the cloudformation template, etc
    const cloudAssemblyArtifact = new Artifact();
 
    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyDemoLambdaServicePipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('AlchieusBlackJackAndLambdas/githubToken'),
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
    const preprod = new CdkpipelinesDemoStage(this, "Pre-Prod", {
      env:props?.env,
    });
    const preprodStage = pipeline.addApplicationStage(preprod);

    const actions: IAction[] = [];
    actions.push(new ManualApprovalAction({
      actionName: "RequestLabDeployApproval",
      notifyEmails: ["James.Smith2@Coxautoinc.com"],
      runOrder: 1
    }));

    preprodStage.addActions(...actions);

    preprodStage.addActions(new ShellScriptAction({
      actionName:"RunTests",
      //runOrder: preprodStage.nextSequentialRunOrder(),
      useOutputs:{
        ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput)
      },
      commands: [
        'curl -Ssf $ENDPOINT_URL',
        'curl -Ssf $ENDPOINT_URL?redirect=https://imgur.com/gallery/ZkSBscv'
      ]
    }));
  }
}