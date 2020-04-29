import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider as AuthProvider } from "./contexts/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
