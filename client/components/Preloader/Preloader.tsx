import "./Preloader.scss";
import { useEffect } from "react";
import { preLoaderAnim } from "./animation";

const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
      <div className="texts-container">
        <span>Discover</span>
        <span>Campus</span>
        <span>Guidance</span>
      </div>
    </div>
  );
};

export default PreLoader;