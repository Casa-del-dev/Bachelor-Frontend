import "./Welcome.css";
import Top from "./ImageWelcome";
import photo from "../assets/Juppie.jpg";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <Top />

      {/*Detailed information about the page*/}
      <div className="container-fluid">
        <div className="body-1">
          <div className="First-div">
            <img src={photo} alt="Small Thumbnail" />
            <div className="First-text">Welcome!</div>
          </div>
        </div>
        <div className="body-2">
          <div className="Second-div">
            <div className="Second-text">Welcome!</div>
            <img src={photo} alt="Small Thumbnail" />
          </div>
        </div>
        <div className="body-1">
          <div className="Third-div">
            <img src={photo} alt="Small Thumbnail" />
            <div className="Third-text">Welcome!</div>
          </div>
        </div>
        <div className="body-2">
          <div className="Fourth-div">
            <div className="Fourth-text">Welcome!</div>
            <img src={photo} alt="Small Thumbnail" />
          </div>
        </div>
      </div>

      {/*Review part*/}
      <div className="container-review">
        <hr />
      </div>
    </div>
  );
};

export default Welcome;
