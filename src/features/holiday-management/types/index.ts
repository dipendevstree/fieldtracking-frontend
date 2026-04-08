// Additional parameters for listing APIs
export interface IListParams1 {
  [key: string]: unknown;
}
// Additional parameters for listing APIs
export interface IListParams {
  sort?: string;
  limit: number;
  page: number;
  [key: string]: unknown;
}
