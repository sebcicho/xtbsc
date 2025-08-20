import { formatDate } from "../utils";

export const mapStockData = (apiData: { symbol: string; values: { [key: string]: number } }, symbol: string): Array<object> => {
  if (!apiData || !apiData.values) {
    return [];
  }
  
  // Get the keys (timestamps) from the values object.
  const timestamps = Object.keys(apiData.values);

  // Map each timestamp to a new data object.
  return timestamps.map(timestamp => {
    const value = apiData.values[timestamp];
    // Create a new object with 'date' and the dynamic 'symbol' as keys.
    const dataPoint = {
      date: formatDate(timestamp),
      [symbol]: value, // This uses a computed property name
    };
    return dataPoint;
  });
};