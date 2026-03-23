import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  IconEdit,
  IconPlayerPlay,
  IconRefresh,
  IconBan,
  IconHistory,
  IconClock,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CustomButton from "@/components/shared/custom-button";
import CustomTooltip from "@/components/shared/custom-tooltip";
import { DialogType, useOrganizationStore } from "../store/organizations.store";
import { useNavigate } from "@tanstack/react-router";
import { OrganizationPlanStatus } from "@/components/layout/types";

const ACTIONS: {
  label: string;
  key: DialogType;
  icon: React.ElementType;
}[] = [
  { label: "Edit", key: "edit", icon: IconEdit },
  { label: "Activate Plan", key: "activatePlan", icon: IconPlayerPlay },
  { label: "Renew Plan", key: "renewPlan", icon: IconRefresh },
  { label: "Suspend Organization", key: "suspendOrganization", icon: IconBan },
  { label: "Extend Grace Period", key: "extendGracePeriod", icon: IconClock },
  { label: "Plan History", key: "planHistory", icon: IconHistory },
];

export function DataTableRowActions({ row }: any) {
  const { setOpen, setCurrentRow } = useOrganizationStore();
  const navigate = useNavigate();

  const planStatus = row.original.planStatus;

  const filteredActions = ACTIONS.filter((action) => {
    if (action.key === "edit" || action.key === "planHistory") return true;

    if (planStatus === OrganizationPlanStatus.TRIAL) {
      return action.key === "activatePlan";
    }

    if (
      planStatus === OrganizationPlanStatus.ACTIVE ||
      planStatus === OrganizationPlanStatus.GRACE_PERIOD
    ) {
      if (action.key === "renewPlan") return true;
    }

    if (planStatus === OrganizationPlanStatus.EXPIRED) {
      return action.key === "suspendOrganization";
    }

    if (planStatus === OrganizationPlanStatus.GRACE_PERIOD) {
      if (action.key === "extendGracePeriod") return true;
    }

    return false;
  });

  const openAction = (type: DialogType) => {
    if (type === "planHistory") {
      navigate({
        to: "/superadmin/plan-history",
        search: {
          organizationId: row.original.organizationID || row.original.id,
        },
      });
      return;
    }
    setCurrentRow(row.original);
    setOpen(type);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <CustomButton
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 cursor-pointer p-0"
        >
          <CustomTooltip title="Actions">
            <div>
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </div>
          </CustomTooltip>
        </CustomButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[180px]">
        {filteredActions.map((action) => {
          const Icon = action.icon;

          return (
            <DropdownMenuItem
              key={action.key}
              onClick={() => openAction(action.key)}
            >
              {action.label}
              <DropdownMenuShortcut>
                <Icon size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
