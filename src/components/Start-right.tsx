import { useState } from "react";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";

const StartRight = () => {
  const [text, setText] = useState(""); // State to store input value

  const handleSubmit = () => {
    if (text.trim() === "") return; // Prevent empty submission
    console.log("Submitted text:", text);
    alert(`Submitted: ${text}`);
    setText(""); // Clear input after submission
  };

  return (
    <div className="Right-Side-main">
      <div className="custom-line-leftmiddle"></div>
      <div className="right-sidecontent-main">
        <div className="right-header-main">Step Tree</div>
        <div className="right-main-main">CIAO</div>

        <div className="right-text-main">
          <div className="input-container">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-input"
              placeholder="Enter your text..."
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
            <HiArrowRight className="submit-icon" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartRight;
