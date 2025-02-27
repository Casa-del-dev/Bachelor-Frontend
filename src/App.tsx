import {
  BrowserRouter as Router,
  Routes,
  Route,
  /*useSearchParams,*/
} from "react-router-dom";

import Layout from "./Layout";
import Welcome from "./components/Welcome";
import Problem from "./components/Problem";
import Start from "./components/Start";
import BB from "./components/Building-Block";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/problem" element={<Problem />} />
          <Route path="/start" element={<Start />} />
          <Route path="/bb" element={<BB />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
