import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_u2IwLjkdm", // Replace with your Cognito User Pool ID
  ClientId: "83r8dsr4fn4pk55fr48jr43ds", // Replace with your Cognito App Client ID
};

export default new CognitoUserPool(poolData);
