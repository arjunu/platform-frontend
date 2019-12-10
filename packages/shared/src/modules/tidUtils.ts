export const makeTid = (base: string | undefined, postfix: string): string | undefined => {
  if (!base) {
    return undefined;
  }

  return base + "." + postfix;
};
