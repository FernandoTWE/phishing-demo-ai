import { getContentType } from './contentType';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFileSize(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'El archivo no puede superar los 10MB'
    };
  }
  return { isValid: true };
}

export function validateFileType(file: File): FileValidationResult {
  const { mimeType } = getContentType(file);
  const allowedTypes = [
    'text/plain',
    'message/rfc822',
    'image/jpeg',
    'image/png'
  ];
  
  const allowedExtensions = ['.eml', '.txt', '.jpg', '.jpeg', '.png'];
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.includes(mimeType) && !allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'Solo se permiten archivos .eml, .jpg, .jpeg, .png o .txt'
    };
  }
  
  return { isValid: true };
}

export function handleFileSelection(
  event: Event,
  fileNameElement: HTMLElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): File | null {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return null;

  // Validate file size and type
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    alert(sizeValidation.error);
    return null;
  }

  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    alert(typeValidation.error);
    return null;
  }
  
  // Update UI
  fileNameElement.textContent = file.name;
  filePreviewElement.classList.remove('hidden');
  textInputElement.value = '';
  textInputElement.disabled = true;
  
  return file;
}

export function removeSelectedFile(
  fileInputElement: HTMLInputElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): null {
  fileInputElement.value = '';
  filePreviewElement.classList.add('hidden');
  textInputElement.disabled = false;
  return null;
}