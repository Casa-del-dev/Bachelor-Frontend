import React from "react";

const problemDetails: { [key: string]: string } = {
  "Problem 1": `
  **Roman to Integer**
  Convert a Roman numeral to an integer.
  
  **Example:**
  - Input: "III"
  - Output: 3
  `,
  "Problem 2": `
  **Reverse Integer**
  Given a signed 32-bit integer, return it reversed.
  
  **Example:**
  - Input: 123
  - Output: 321
  `,
};

const Problem_details = ({ selectedProblem }: { selectedProblem: string }) => {
  return (
    <div>
      <h2>{selectedProblem}</h2>
      <p>Details for {selectedProblem}</p>
    </div>
  );
};

export default Problem_details;
