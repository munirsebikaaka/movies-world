import React from "react";
import reactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";

const root = reactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={5}
      message={["teribble", "bad", "okey", "good", "amaizing"]}
    />
    <StarRating size={24} color="red" className="test " />
  </React.StrictMode>
);
