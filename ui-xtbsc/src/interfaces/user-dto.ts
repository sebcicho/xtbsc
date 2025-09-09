import { AssetDto } from "./asset-dto";

export interface UserDto {
  userId: string;
  assets: AssetDto[];
}