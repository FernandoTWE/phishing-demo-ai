export type ContentType = 'image' | 'message';

export function getContentType(file: File): { type: ContentType; mimeType: string } {
  const mimeType = file.type || getMimeTypeFromExtension(file.name);
  
  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name)) {
    return {
      type: 'image',
      mimeType
    };
  }
  
  return {
    type: 'message',
    mimeType: mimeType || 'message/rfc822'
  };
}

function getMimeTypeFromExtension(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'eml': 'message/rfc822'
  };
  
  return mimeTypes[ext || ''] || '';
}