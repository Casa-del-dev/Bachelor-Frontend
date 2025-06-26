import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CodeProvider } from "./CodeContext";
import Layout from "./Layout";
import Welcome from "./components/Welcome";
import Problem from "./components/Problem";
import Start from "./components/Start";
import Redirect from "./components/Redirect";
import Abstract from "./components/Abstract";
import { ProfilePage } from "./components/Header";
import GitHubCallback from "./GitHubComponent";

function App() {
  return (
    <Router>
      <CodeProvider>
        <Layout>
          <Routes>
            <Route path="/github/callback" element={<GitHubCallback />} />

            <Route path="/" element={<Welcome />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/start/:id" element={<Start />} />
            {/* This route handles /start without a parameter and redirects */}
            <Route path="/start" element={<Redirect />} />
            <Route path="/abstract" element={<Abstract />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </CodeProvider>
    </Router>
  );
}

export default App;
