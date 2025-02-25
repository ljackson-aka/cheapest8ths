import { useState } from "react";
import UserPool from "./CognitoConfig";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    UserPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        alert(err.message);
      } else {
        alert("Check your email for confirmation!");
      }
    });
  };

  return (
    <form onSubmit={handleSignUp}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
