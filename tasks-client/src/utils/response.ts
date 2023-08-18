export type CustomResponse = {
  error: string | null;
  data: any;
};

export function createResponse(
  data: any,
  error: string | null,
  status: number
): Response {
  const response: CustomResponse = { data, error };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}
