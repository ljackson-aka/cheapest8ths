import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log("Authenticated User:", currentUser); // Debugging
        setUser(currentUser.attributes);
      } catch (err) {
        console.error("Error fetching user:", err);
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
      console.error("Error signing out:", err);
    }
  };

  return user ? (
    <div>
      <h2>Welcome, {user.email}</h2>
      <p><strong>Name:</strong> {user.name || "N/A"}</p>
      <p><strong>Phone:</strong> {user.phone_number || "N/A"}</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  ) : (
    <p>Please sign in.</p>
  );
};

export default Profile;
