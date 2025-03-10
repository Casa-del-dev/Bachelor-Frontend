import { ShieldCheck, FileText } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";

const The_muskeltiers = () => {
  return (
    <div className="container-for-triplets">
      <ShieldCheck size="2vw" strokeWidth="1" />
      <FileText size="2vw" strokeWidth="1" />
      <CustomLightbulb number={2} />
    </div>
  );
};

export default The_muskeltiers;
