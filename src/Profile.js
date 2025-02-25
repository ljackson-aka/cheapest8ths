import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        
        console.log("✅ Full Cognito User Object:", currentUser); // Debug full object
        console.log("🔥 Username:", currentUser.username || "Not Found");
        console.log("🔥 Attributes:", currentUser.attributes || "No Attributes Found");

        setUser({
          username: currentUser.username || "Unknown User",
          email: currentUser.attributes?.email || "N/A",
        });
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      window.location.href = "/"; // Redirect to home page after logout
    } catch (err) {
      console.error("❌ Error signing out:", err);
    }
  };

  return user ? (
    <div>
      <h2>Welcome, {user.username}</h2> 
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  ) : (
    <p>Please sign in.</p>
  );
};

export default Profile;
