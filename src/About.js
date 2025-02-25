import React from "react";
import { Link } from "react-router-dom";
import "./About.css"; // Add styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About CHEAP8THS.COM</h1>
      <p>
        Cheapest8ths helps cannabis consumers find the best deals by providing real-time price tracking, 
        user-submitted prices, and trend analysis.
      </p>

      <h2>What We Offer</h2>
      <ul>
        <li>🔍 Compare the cheapest 8ths available in your area</li>
        <li>📊 Track price trends over time</li>
        <li>👥 Contribute prices and earn rewards</li>
      </ul>

      <h2>Join Our Community</h2>
      <p>
        Help improve pricing transparency by submitting updates and competing on the leaderboard.
      </p>

      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default About;
