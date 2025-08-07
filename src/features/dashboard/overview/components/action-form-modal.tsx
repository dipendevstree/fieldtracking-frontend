import { useOverviewStore } from "../store/over-view.store";
import { SalesRepModal, PerformanceModal, ActivityModal } from "./action-form";

export function OverviewActionModal() {
  const {
    open,
    setOpen,
    currentUser,
    setCurrentUser,
    currentActivity,
    setCurrentActivity,
  } = useOverviewStore();

  const closeModal = () => {
    setOpen(null);
    setTimeout(() => {
      setCurrentUser(null);
      setCurrentActivity(null);
    }, 300);
  };

  return (
    <>
      {/* User Details Modal */}
      {currentUser && (
        <SalesRepModal
          key="user-details"
          currentUser={currentUser}
          open={open === "view-user"}
          onOpenChange={(value) => {
            if (!value) closeModal();
            else setOpen("view-user");
          }}
        />
      )}

      {/* Performance Modal */}
      {currentUser && (
        <PerformanceModal
          key="performance"
          currentUser={currentUser}
          open={open === "view-performance"}
          onOpenChange={(value) => {
            if (!value) closeModal();
            else setOpen("view-performance");
          }}
        />
      )}

      {/* Activity Modal */}
      {currentActivity && (
        <ActivityModal
          key="activity"
          currentActivity={currentActivity}
          open={open === "view-activity"}
          onOpenChange={(value) => {
            if (!value) closeModal();
            else setOpen("view-activity");
          }}
        />
      )}
    </>
  );
}
