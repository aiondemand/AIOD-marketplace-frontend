export const getKeyCategoryByValue = (
  enumAsset: any,
  value: string,
): string | undefined => {
  return Object.keys(enumAsset).find((key) => enumAsset[key] === value);
};
