import { Trend } from "../interfaces/enums";

export const getColor = (trend?: Trend): string => {
  if (trend === Trend.NEGATIVE) {
    return '#af366fff';
  } else if (trend === Trend.POSITIVE) {
    return '#45be86ff'
  } 
  return '#dad752ff'
};
