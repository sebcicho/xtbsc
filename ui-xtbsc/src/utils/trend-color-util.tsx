import { Trend } from "../interfaces/enums";

export const getColor = (trend?: Trend): string => {
    console.log('getColor: ', trend)
  if (trend === Trend.NEGATIVE) {
    console.log('negative')
    return '#af366fff';
  } else if (trend === Trend.POSITIVE) {
    return '#45be86ff'
  } 
  return '#dad752ff'
};
