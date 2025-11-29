
// Utility to convert snake_case keys to camelCase
const toCamelCase = (row) => {
  const obj = {};
  for (const key in row) {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    obj[camelKey] = row[key];
  }
  return obj;
};

export { toCamelCase }