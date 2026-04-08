import { cn } from "@/lib/utils";
import { Main } from "@/components/layout/main";
import Notifications from "./components/Notifications";
import { NotificationsActionModal } from "./components/action-form-modal";
import TablePageLayout from "@/components/layout/table-page-layout";

const NotificationsPage = () => {
  return (
    <Main className={cn("flex flex-col gap-2 p-4")}>
      <TablePageLayout
        title="Notification Configuration"
        description="Configure alerts, reminders, and notification preferences for various events."
        className="p-0"
        showActionButton={false}
      >
        <Notifications />
      </TablePageLayout>
      <NotificationsActionModal key={"notifications-action-modal"} />
    </Main>
  );
};

export default NotificationsPage;
