import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
// import Approvers from "./components/Approvers";
import { ApproverFormNew } from "./components/Approvers-new";
const ApproversPage = () => {
  return (
    <Main className={cn("flex flex-col p-0")}>
      {/* Settings Configuration */}
      {/* <Approvers /> */}
      <ApproverFormNew />
    </Main>
  );
};

export default ApproversPage;
