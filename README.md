
# Example AWS Lambda function in Go

This repo was created exclusively to answer a specific [stackoverflow question](https://stackoverflow.com/questions/75930682/expected-aws-lambda-environment-variables-lambda-server-port-aws-lambda-runtim  )

It copies the question's Go code, and shows how to troubleshoot things locally, and how to deploy a function version of the same code in AWS.

## Pre-requisites

To run the code in this repo make sure you set up the following dependencies on your machine:
- [Go installed](https://go.dev/)
- [AWS CDK getting started requisites](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_prerequisites)

## Project genesis

For the sake of clarity, here is how this project was bootstrapped by setting up a go environment, and then an AWS CDK project to deploy things in AWS.

### Go environment

```shell
# setup go code:
mkdir -p lambda && cd lambda
go mod init mklabs.io/golambda
# install dependencies
go get github.com/aws/aws-lambda-go/lambda
touch main.go
```

.. and copy-pasting the code from [this stackoverflow post into main.go file](https://stackoverflow.com/questions/75930682/expected-aws-lambda-environment-variables-lambda-server-port-aws-lambda-runtim).

Then [download locally AWS lambda runtime environment as provided by AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/go-image.html)

```shell
mkdir -p ~/.aws-lambda-rie && curl -Lo ~/.aws-lambda-rie/aws-lambda-rie \
  https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie \
  && chmod +x ~/.aws-lambda-rie/aws-lambda-rie               
```


### CDK environment

```shell
mkdir -p cdk && cd cdk
cdk init sample-app --language typescript
```

And adjusted the code to create a lambda function and an AWS API Gateway.


## Running locally

To test the lambda function locally run:

```shell
cd lambda
~/.aws-lambda-rie/aws-lambda-rie go run main.go
```

This will start a server listening on port 8080. To actually trigger the lambda function, run on a new shell session:

```shell
curl -XPOST "http://localhost:8080/2015-03-31/functions/function/invocations" -d '{"Name": "World"}'
```

On this second shell session you should see the following output as a result:
```shell
{"statusCode":200,"headers":null,"multiValueHeaders":null,"body":"hello world"}%                     
```

Likewise, on the first shell session you should see an output similar to the following:

```shell
06 May 2023 18:38:31,456 [INFO] (rapid) exec 'go' (cwd=/home/johndoe/development/go-lambda/lambda, handler=main.go)
06 May 2023 18:38:38,086 [INFO] (rapid) extensionsDisabledByLayer(/opt/disable-extensions-jwigqn8j) -> stat /opt/disable-extensions-jwigqn8j: no such file or directory
START RequestId: 340cd023-ea7f-440d-b0f5-7ad36dd10ba2 Version: $LATEST
06 May 2023 18:38:38,086 [INFO] (rapid) Configuring and starting Operator Domain
06 May 2023 18:38:38,086 [INFO] (rapid) Starting runtime domain
06 May 2023 18:38:38,086 [WARNING] (rapid) Cannot list external agents error=open /opt/extensions: no such file or directory
06 May 2023 18:38:38,087 [INFO] (rapid) Starting runtime without AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN , Expected?: false
2023/05/06 18:38:38 hello world
END RequestId: bbe82927-68af-45f2-b83f-c14cd79f2eea
REPORT RequestId: bbe82927-68af-45f2-b83f-c14cd79f2eea	Init Duration: 0.08 ms	Duration: 356.12 ms	Billed Duration: 357 ms	Memory Size: 3008 MB	Max Memory Used: 3008 MB
```

## Build a binary

If you need to build a binary:
```shell
GOOS=linux GOARCH=amd64 go build -o main .
```

To execute the binary:
```shell
~/.aws-lambda-rie/aws-lambda-rie ./main
```

## Deploying on AWS

We will use AWS CDK for deploying the Lambda function and API Gateway.

If it is the first time running this repo's cdk code, make sure you install all dependencies:
```shell
npm install
```

Before deploying, you can view the generated CloudFormation code by running:
```shell
cdk synth
```

To deploy the assets:

```shell
# to view the generated CloudFormation code
cdk deploy
```

CDK will still provide a list of all resources and prompt for confirmation.

After confirming, you should see at the end of all outputs something similar to the following:

```shell
✅  LambdaApiCdkStack

✨  Deployment time: 75.99s

Outputs:
LambdaApiCdkStack.GoLambdaApiEndpoint5E710713 = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/

✨  Total time: 81.1s
```

You can now curl this endpoint, and should see `hello world` as an output:
```shell
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/
```

## Tests

To run unit tests for CDK run:

```shell
npm test
```
