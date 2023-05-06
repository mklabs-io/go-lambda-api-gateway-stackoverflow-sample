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
import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as Cdk from '../lib/cdk-stack';

test('Lambda function and API Gateway created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Cdk.CdkStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  const lambdaFunctionResource = 'AWS::Lambda::Function';
  const apiGatewayResource = 'AWS::ApiGateway::RestApi';

  // lambda function checks
  template.hasResourceProperties(lambdaFunctionResource, {
    Timeout: 30,
    Runtime: 'go1.x',
  });
  template.resourceCountIs(lambdaFunctionResource, 1)


  // API Gateway checks
  template.resourceCountIs(apiGatewayResource, 1);
});
