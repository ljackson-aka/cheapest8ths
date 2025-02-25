import { useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./CognitoConfig";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();

    const user = new CognitoUser({ Username: email, Pool: UserPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("Login Success:", data);
        alert("Login successful!");
      },
      onFailure: (err) => {
        alert(err.message);
      },
    });
  };

  return (
    <form onSubmit={handleSignIn}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
