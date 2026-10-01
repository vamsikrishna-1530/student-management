/** Pull a readable message from Axios / API error shapes. */
export const getErrorMessage = (err: unknown, fallback: string): string => {
  const apiMessage = (err as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return apiMessage || fallback;
};
