import React from "react";
import { ReportsHeadProps } from "../types";

const ReportsHead: React.FC<ReportsHeadProps> = ({ title, subtitle }) => {
  return (
    <div>
      <div className="text-2xl font-semibold">{title}</div>
      <div className="text-sm font-normal text-muted-foreground">
        {subtitle}
      </div>
    </div>
  );
};

export default ReportsHead;
