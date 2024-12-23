import { logger } from './logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  logger.log('info', 'Starting file validation', { fileName: file.name, size: file.size, type: file.type });

  // Size validation
  if (file.size > MAX_FILE_SIZE) {
    logger.log('error', 'File size exceeds limit', { size: file.size, maxSize: MAX_FILE_SIZE });
    return {
      isValid: false,
      error: 'El archivo no puede superar los 10MB'
    };
  }

  // Type validation
  const allowedTypes = new Set([
    'text/plain',
    'message/rfc822',
    'image/jpeg',
    'image/png'
  ]);

  const allowedExtensions = new Set(['.eml', '.txt', '.jpg', '.jpeg', '.png']);
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.has(file.type) && !allowedExtensions.has(extension)) {
    logger.log('error', 'Invalid file type', { type: file.type, extension });
    return {
      isValid: false,
      error: 'Solo se permiten archivos .eml, .jpg, .jpeg, .png o .txt'
    };
  }

  logger.log('info', 'File validation successful', { fileName: file.name });
  return { isValid: true };
}