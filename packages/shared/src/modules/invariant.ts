export class InvariantError extends Error {
  type = "InvariantError";
}

export function invariant(value: any, message: string): null {
  if (!value) {
    throw new InvariantError(message);
  }

  // Useful in react component context as `undefined` is not allowed in JSX
  return null;
}
