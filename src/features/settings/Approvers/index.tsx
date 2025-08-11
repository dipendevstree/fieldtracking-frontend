import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import Approvers from "./components/Approvers";
const ApproversPage = () => {
  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* Approvers Configuration Section */}
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Expense Approvers Configuration
          </h2>
          <p className="text-muted-foreground ">
            Configure approval hierarchy and default approvers for different
            scenarios
          </p>
        </div>
        {/* Settings Configuration */}
        <div>
          <Approvers />
        </div>
      </div>
    </Main>
  );
};

export default ApproversPage;
