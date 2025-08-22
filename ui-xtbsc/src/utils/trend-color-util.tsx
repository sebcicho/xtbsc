import { Trend } from "../interfaces/enums";

export const getColor = (trend?: Trend): string => {
  if (trend === Trend.NEGATIVE) {
    console.log('negative');
    return '#af366fff';
  } else if (trend === Trend.POSITIVE) {
    console.log('positive')
    return '#45be86ff'
  } 
  return '#dad752ff'
};
