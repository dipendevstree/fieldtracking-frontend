import { useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/data/app.data";
import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import { EnhancedError } from "@/types";
import { useGetMobileFeaturesData } from "./services/MobileFeatures.hook";
import { useMobileFeaturesStore } from "./store/mobile-features.store";
import { ErrorPage } from "@/components/shared/custom-error";
import MobileFeatures from "./components/MobileFeatures";
import { MobileFeaturesActionModal } from "./components/action-form-modal";

const MobileFeaturesPage = () => {
  const [pagination] = useState({
    page: DEFAULT_PAGE_NUMBER,
    limit: DEFAULT_PAGE_SIZE,
  });

  //   Mobile Features data
  const { isLoading, error } = useGetMobileFeaturesData(pagination);

  const { setOpen } = useMobileFeaturesStore();

  if (error) {
    const errorResponse = (error as EnhancedError)?.response?.data;
    return (
      <ErrorPage
        errorCode={errorResponse?.statusCode}
        message={errorResponse?.message}
      />
    );
  }

  const handleEditMobileFeaturesConfig = () => {
    // setCurrentConfig(mobileFeaturesConfig)
    setOpen("edit-config");
  };

  const handleAddMobilePermission = () => {
    setOpen("add-permission");
  };

  const handleAddMobileFeature = () => {
    setOpen("add-feature");
  };

  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      {/* Mobile Features Configuration Section */}
      <div className="mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Mobile App Features Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure mobile app features and permissions for sales
            representatives.
          </p>
        </div>

        {/* Settings Configuration */}
        <div className="mb-8">
          <MobileFeatures />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleEditMobileFeaturesConfig}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            disabled={isLoading}
          >
            Edit Mobile Features Configuration
          </button>
          <button
            onClick={handleAddMobilePermission}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            disabled={isLoading}
          >
            Add Mobile Permission
          </button>
          <button
            onClick={handleAddMobileFeature}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
            disabled={isLoading}
          >
            Add Mobile Feature
          </button>
        </div>
      </div>

      <MobileFeaturesActionModal key={"mobile-features-action-modal"} />
    </Main>
  );
};

export default MobileFeaturesPage;
