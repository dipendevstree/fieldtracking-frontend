export interface Approver {
  approverId: string;
  name: string;
  role: string;
  level: number;
  amountRange: {
    min: number;
    max: number;
  };
  isRequired: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApprovalHierarchy {
  hierarchyId: string;
  level: number;
  amountRange: {
    min: number;
    max: number;
  };
  approverRole: string;
  isRequired: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryApprover {
  categoryId: string;
  categoryName: string;
  approverRole: string;
  isEnabled: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApprovalSettings {
  defaultFirstApprover: string;
  autoApproveLimit: number;
  createdAt?: string;
  updatedAt?: string;
}

// State to manage information for the delete modal
export interface DeletionState {
  onConfirm: () => void;
  itemName: string;
  itemIdentifierValue: string;
}

export interface LevelProps {
  levelIdx: number;
  removeLevel: (index: number) => void;
  levelFieldsLength: number;
  usersOptions: { label: string; value: string }[];
  expenseCategoryOptions: { label: string; value: string }[];
  tierOptions: { label: string; value: string }[];
  initiateDelete: (state: DeletionState) => void;
  deleteApprovalLevel: any;
  isDeleting: boolean;
  isFirstLevel: boolean;
}

export interface ExpenseCategoryRowProps {
  levelIdx: number;
  categoryIdx: number;
  remove: (index: number) => void;
  canDelete: boolean;
  expenseCategoryOptions: { label: string; value: string }[];
  tierOptions: { label: string; value: string }[];
  isDeleting: boolean;
  initiateDelete: (state: DeletionState) => void;
  deleteApprovalLevel: any;
}
