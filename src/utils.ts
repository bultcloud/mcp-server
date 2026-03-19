export function formatJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function toolResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function toolError(e: unknown) {
  const message = e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true as const };
}
