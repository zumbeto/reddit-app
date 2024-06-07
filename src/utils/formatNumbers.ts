export const formatNumbers = (numbers: number): string => {
  if (numbers == null) {
    return '0';
  }
  if (numbers >= 1000) {
    return (numbers / 1000).toFixed(1) + 'k';
  }
  return numbers.toString();
};
