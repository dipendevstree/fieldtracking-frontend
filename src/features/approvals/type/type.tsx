export interface Territory {
  id?: string;
  territory: string;
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export interface Category {
  expensesCategoryId?: string;
  categoryName: string;
  createdDate?: string;
}

export type TravelLumpSum = {
  date: string;
  amount: number;
  approvedAmount: number;
  mode: string;
  status: string;
};

export type TravelRoute = {
  date: string;
  fromLocation: string;
  toLocation: string;
  vehicleCategory: string;
  amount: number;
  approvedAmount: number;
  notes?: string;
  status: string;
};

export type Props = {
  expenseSubType: string;
  travelLumpSums?: TravelLumpSum[];
  travelRoutes?: TravelRoute[];
};
