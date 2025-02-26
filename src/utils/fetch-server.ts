const baseURL = process.env.NEXT_PUBLIC_API;

export async function fetchServer<T>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  data?: any,
  config?: RequestInit,
  errCallback?: () => void
): Promise<T> {
  try {
    const response = await fetch(`${baseURL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...config,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    return response.json();
  } catch (error: any) {
    console.error('Error', error.message);
    errCallback?.();
    throw error;
  }
}