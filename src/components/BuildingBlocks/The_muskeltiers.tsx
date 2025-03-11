import { ShieldCheck, FileText } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";

const The_muskeltiers = ({ number }: { number: number }) => {
  return (
    <div className="container-for-triplets">
      <ShieldCheck size="1.5vw" strokeWidth="1" />
      <CustomLightbulb number={number} />
      <FileText size="1.5vw" strokeWidth="1" />
    </div>
  );
};

export default The_muskeltiers;
