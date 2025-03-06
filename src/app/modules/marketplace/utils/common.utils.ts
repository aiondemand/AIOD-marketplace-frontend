export function chunkArray<R>(array: R[], size: number): R[][] {
  const chunks: R[][] = [];
  for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function removeTrailingSlash(str: string): string {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

export function hasQuotes(query: string): boolean {
  return query.startsWith('"') && query.endsWith('"') && query.length >= 2;
} 
