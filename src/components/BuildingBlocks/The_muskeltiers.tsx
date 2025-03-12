import { ShieldCheck, FileText } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";

const The_muskeltiers = ({
  number,
  fill = "yellow",
}: {
  number?: number;
  fill?: string;
}) => {
  return (
    <div className="container-for-triplets">
      <ShieldCheck className="Check-tree" size="1.5vw" strokeWidth="1" />
      <CustomLightbulb number={number} fill={fill} />
      <FileText className="Filetext-tree" size="1.5vw" strokeWidth="1" />
    </div>
  );
};

export default The_muskeltiers;
