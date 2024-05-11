export const API_URL = "https://jsonplaceholder.typicode.com/todos/";
export const checkSequenceAndCoverage = (data) => {
  let previousMax = 0;
  let totalCoverage = 0;
  for (const key in data) {
    const group = data[key];
    const min = parseInt(group.min);
    const max = parseInt(group.max);

    if (min < 1 || max > 10 || min >= max || min <= previousMax) {
      return { valid: false, wrongGroupIndex: key };
    }

    totalCoverage += max - min + 1;
    previousMax = max;
  }
  const valid = totalCoverage === 10;
  return { valid, wrongGroupIndex: valid ? null : Object.keys(data).length };
};
