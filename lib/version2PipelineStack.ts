import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CodePipeline, CodePipelineSource, ShellStep } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from "./cdkpipelines-demo-stage"

export class Version2PipelineStack extends Stack {
    constructor( scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Version2Pipeline', {
            pipelineName: 'BlackJackAndLambdasPipeline',
            synth: new ShellStep( 'Synth', {
                input: CodePipelineSource.gitHub(
                    'Alchieus/BlackjackAndLambdas', 
                    'main'
                ),
                commands: [
                    'npm install',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        });

        
    }
}