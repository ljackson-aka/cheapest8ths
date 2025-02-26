import { useState } from "react";
import { Auth } from "aws-amplify"; // Import AWS Amplify Auth

const SubmitForm = () => {
  const [formData, setFormData] = useState({
    brand: "",
    product_name: "",
    thc_percentage: "",
    price: "",
    dispensary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the authenticated user's token
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      // Get the username from the authenticated session
      const user = await Auth.currentAuthenticatedUser();
      const submitted_by = user.username;

      // Ensure numeric fields are sent as numbers
      const submissionData = {
        submitted_by: submitted_by, // Set username as submitted_by
        brand: formData.brand,
        product_name: formData.product_name,
        thc_percentage: parseFloat(formData.thc_percentage), // Convert to number
        price: parseFloat(formData.price), // Convert to number
        dispensary: formData.dispensary,
      };

      const response = await fetch(
        "https://o8laa2q6gc.execute-api.us-east-2.amazonaws.com/prod/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: idToken, // Attach JWT token
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (response.ok) {
        alert("Submission successful! Awaiting admin approval.");
        setFormData({
          brand: "",
          product_name: "",
          thc_percentage: "",
          price: "",
          dispensary: "",
        }); // Reset form
      } else {
        const errorData = await response.json();
        alert(`Failed to submit: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit. Please sign in first.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
      <input name="product_name" placeholder="Product Name" value={formData.product_name} onChange={handleChange} required />
      <input name="thc_percentage" placeholder="THC %" type="number" value={formData.thc_percentage} onChange={handleChange} required />
      <input name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} required />
      <input name="dispensary" placeholder="Dispensary" value={formData.dispensary} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SubmitForm;
