export const isValidFormNumber = (value: string) => {
  const valueAsNumber = Number(value);
  return !isNaN(valueAsNumber) && valueAsNumber > 0;
};
