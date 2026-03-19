interface ApiResponse {
  status: string;
  data: unknown;
  error?: { message: string };
}

export class Client {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const resp = await fetch(this.baseURL + path, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });

    const text = await resp.text();

    let apiResp: ApiResponse;
    
    try {
      apiResp = JSON.parse(text);
    } catch {
      throw new Error(`Unmarshal response (status ${resp.status}): ${text}`);
    }

    if (apiResp.error) {
      throw new Error(`API error: ${apiResp.error.message}`);
    }

    if (resp.status >= 400) {
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }

    return apiResp.data;
  }

  async get(path: string): Promise<unknown> {
    return this.request("GET", path);
  }

  async post(path: string, body?: unknown): Promise<unknown> {
    return this.request("POST", path, body);
  }

  async put(path: string, body: unknown): Promise<unknown> {
    return this.request("PUT", path, body);
  }

  async delete(path: string): Promise<unknown> {
    return this.request("DELETE", path);
  }
}
