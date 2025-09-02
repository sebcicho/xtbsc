export interface TransactionDto {
  assetType: string;
  assetSymbol: string;
  quantity: number;
  price?: number;
  timestampTransaction?: number;
  currency?: string;
}