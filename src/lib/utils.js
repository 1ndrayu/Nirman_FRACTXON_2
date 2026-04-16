export const formatNumber = (val) => {
  if (!val && val !== 0) return '';
  const parts = val.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const parseFormattedNumber = (str) => {
  return parseFloat(str.replace(/,/g, ''));
};
