export function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  );
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; domain=.aiod.eu; Secure; SameSite=None`;
}
