import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ContractAnalyzer from "./components/ContractAnalyzer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/analyze" component={ContractAnalyzer} />
          <Route path="/" component={LandingPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;