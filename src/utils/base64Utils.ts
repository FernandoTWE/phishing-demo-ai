export function addBase64Prefix(base64Content: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64Content}`;
}

export async function fileToBase64WithPrefix(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // This automatically adds the data URI prefix
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function textToBase64WithPrefix(text: string): string {
  const base64Content = btoa(text);
  return addBase64Prefix(base64Content, 'text/plain');
}