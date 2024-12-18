export type ContentType = 'image' | 'message';

export function getContentType(file: File): ContentType {
  if (file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name)) {
    return 'image';
  }
  return 'message';
}