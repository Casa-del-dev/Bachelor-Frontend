import imga from "../assets/Study.webp";
import "./ImageWelcome.css";

const ImageWelcome = () => {
  return (
    <div className="container-image">
      <div className="text">
        DBox Plus: An AI-Assisted Code <br />
        Learning Tutor
      </div>
      <img src={imga} className="image" alt="Background" />
    </div>
  );
};

export default ImageWelcome;
