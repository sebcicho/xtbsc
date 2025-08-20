import { DataPoint } from "../interfaces/data-point";
import { formatDate } from "../utils";

export const mapStockData = (apiData: { symbol: string; values: { [key: string]: number } }, symbol: string): Array<DataPoint> => {
  if (!apiData || !apiData.values) {
    return [];
  }
  
  const timestamps = Object.keys(apiData.values);

  return timestamps.map(timestamp => {
    const value = apiData.values[timestamp];
    const dataPoint = {
      date: formatDate(timestamp),
      [symbol]: value,
    };
    return dataPoint;
  });
};