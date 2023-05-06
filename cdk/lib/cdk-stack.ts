/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CdkStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cdkAssetsPrefix = 'GoLambda'
    const functionName = `${cdkAssetsPrefix}Function`
    const ApiGwName = `${cdkAssetsPrefix}Api`
    const environment = 'dev'

    const lambdaFunction = new lambda.Function(this, functionName, {
      runtime: lambda.Runtime.GO_1_X,
      handler: 'main',
      timeout: Duration.seconds(30),
      code: lambda.Code.fromAsset('../lambda'),
      environment: {
        FUNCTION_NAME: functionName,
        ENVIRONMENT: environment,
      }
    });

    new apigw.LambdaRestApi(this, ApiGwName, {
          handler: lambdaFunction
    });

  }
}
