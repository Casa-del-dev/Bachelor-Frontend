import { useState, useEffect } from "react";
import "./Team.css";
import Network from "./Network";
import picEren from "../../assets/Eren.jpeg";
import picAnastasiia from "../../assets/Anastasiia.jpg";
import picApril from "../../assets/AprilWang.jpg";
import { useInView } from "./useInView";

const Team = ({ condition }: { condition: boolean }) => {
  const TeamRef = useInView<HTMLDivElement>({ threshold: 0.7 });

  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    if (condition) {
      requestAnimationFrame(() => setShowBg(true));
    }
  }, [condition]);

  const teamMembers = [
    {
      name: "Eren Homburg",
      role: "Bachelor Student",
      affiliation: "ETH Zürich",
      tag: "Programmer",
      image: picEren,
    },
    {
      name: "Anastasiia Birillo",
      role: "Extern",
      affiliation: "JetBrains",
      tag: "Co-Supervisor",
      image: picAnastasiia,
    },
    {
      name: "April Yi Wang",
      role: "Professor",
      affiliation: "ETH Zürich",
      tag: "Supervisor",
      image: picApril,
    },
  ];

  return (
    <div className="team-container">
      <Network condition={showBg} />
      <div
        className={`team-content ${
          TeamRef.isIntersecting && showBg ? "slide-in-top-team delay-0" : ""
        }`}
      >
        <div className="MeetOutTeam">Meet Our Team</div>

        <div className="team-layout">
          <div
            ref={TeamRef.ref}
            className={`team-left ${
              TeamRef.isIntersecting && showBg
                ? "slide-in-top-team delay-1"
                : ""
            }`}
          >
            <div className="team-card">
              <img src={picEren} alt="Eren Homburg" className="team-avatar" />
              <h3>Eren Homburg</h3>
              <p>Bachelor Student</p>
              <p>ETH Zürich</p>
              <span className="team-tag">Programmer</span>
            </div>
          </div>

          <div
            className={`team-right ${
              TeamRef.isIntersecting && showBg
                ? "slide-in-top-team delay-2"
                : ""
            }`}
          >
            {[picAnastasiia, picApril].map((image, i) => {
              const member = teamMembers[i + 1];
              return (
                <div className="team-card" key={member.name}>
                  <img src={image} alt={member.name} className="team-avatar" />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <p>{member.affiliation}</p>
                  <span className="team-tag">{member.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
