export const formatDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp, 10));
  return date.toLocaleDateString();
};
