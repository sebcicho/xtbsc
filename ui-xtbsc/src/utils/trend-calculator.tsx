import { DataPoint } from "../interfaces/data-point";
import { Trend } from "../interfaces/enums";

export const calculateTrend = (datapoints: Array<DataPoint>, symbol: string): Trend => {
  const trendNumber = calculatePercentage(datapoints, symbol);
  if(trendNumber < 0) {
    return Trend.NEGATIVE;
  } else if (trendNumber > 0) {
    return Trend.POSITIVE;
  }

  return Trend.EQUAL;
};

export const calculatePercentage = (datapoints: Array<DataPoint>, symbol: string): number => {
  const trendNumber = ((datapoints[datapoints.length -1][symbol] as number) / (datapoints[0][symbol] as number) * 100) - 100;
  return Math.floor(trendNumber * 100) / 100;
};