export enum TERMS_TYPE {
  TERMS_AND_CONDITIONS = "terms_of_service",
  PRIVACY_POLICY = "privacy_policy",
  DATA_PROCESSING = "data_processing_agreement",
}

export interface TermsAndConditions {
  id: string;
  type: TERMS_TYPE;
  content: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}
