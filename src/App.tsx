import {
  BrowserRouter as Router,
  Routes,
  Route,
  /*useSearchParams,*/
} from "react-router-dom";

import Layout from "./Layout";
import Welcome from "./components/Welcome";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Welcome />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
