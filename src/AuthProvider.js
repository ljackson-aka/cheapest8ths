import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "https://us-east-2u2iwljkdm.auth.us-east-2.amazoncognito.com",
  client_id: "83r8dsr4fn4pk55fr48jr43ds",
  redirect_uri: "https://www.cheap8ths.com/",  // ✅ Ensure this matches Cognito settings
  response_type: "code",
  scope: "openid profile email"
};

export const AppAuthProvider = ({ children }) => (
  <AuthProvider {...oidcConfig}>{children}</AuthProvider>
);
