import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./Layout";
import Welcome from "./components/Welcome";
import Problem from "./components/Problem";
import Problem_details from "./components/Problem_detail";
import Start from "./components/Start";
import Redirect from "./components/Redirect";
import BB from "./components/Building-Block";
import Profile from "./components/Profile";

function App() {
  const [selectedProblem, _] = useState<string>("");

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/problem" element={<Problem />} />
          <Route
            path="/problem/:id"
            element={<Problem_details selectedProblem={selectedProblem} />}
          />
          <Route path="/start/:id" element={<Start />} />
          {/* This route handles /start without a parameter and redirects */}
          <Route path="/start" element={<Redirect />} />
          <Route path="/bb" element={<BB />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
