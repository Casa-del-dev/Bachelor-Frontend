import { useState, useEffect } from "react";
import "./Team.css";

const Team = ({ condition }: { condition: boolean }) => {
  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    if (condition) {
      // Delay to allow triggering animation smoothly
      requestAnimationFrame(() => setShowBg(true));
    }
  }, [condition]);

  const teamMembers = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Ethan Hunt",
    "Fiona Gallagher",
  ];

  return (
    <div className="team-container">
      <div className={`team-background ${showBg ? "bg-visible" : ""}`} />

      <div className="team-content">
        <h2>Meet Our Team</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {teamMembers.map((member, index) => (
            <li
              key={index}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {member}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Team;
