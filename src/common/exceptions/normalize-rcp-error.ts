export const normalizeRpcError = (error: unknown): string | object => {
  console.log(typeof error);
  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) return error;

  return { message: 'Unexpected microservice error' };
};
