export const isWithinRange = (val, range) =>
  parseInt(val) >= parseInt(range[0]) && parseInt(val) <= parseInt(range[1])
    ? true
    : false;
