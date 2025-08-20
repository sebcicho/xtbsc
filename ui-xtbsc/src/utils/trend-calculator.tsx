import { DataPoint } from "../interfaces/data-point";
import { Trend } from "../interfaces/enums";

export const calculateTrend = (datapoints: Array<DataPoint>, symbol: string): Trend => {
  const trendNumber = (datapoints[datapoints.length -1][symbol] as number) - (datapoints[0][symbol] as number);
  if(symbol === 'DT') {
    console.log('Start value:', datapoints[0][symbol]);
    console.log('End value:', datapoints[datapoints.length - 1][symbol]);
    console.log(trendNumber);
  }
  if(trendNumber < 0) {
    return Trend.NEGATIVE;
  } else if (trendNumber > 0) {
    return Trend.POSITIVE;
  }

  return Trend.EQUAL;
};
