import { processImageFile } from './imageProcessor';
import { showError } from './notifications';
import type { FileHandlerElements } from '../types/fileHandling';

export async function handleFileSelection(
  event: Event,
  elements: FileHandlerElements
): Promise<File | null> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) {
    return null;
  }

  if (!isValidFileType(file)) {
    showError('Solo se permiten archivos .eml, .jpg, .jpeg, .png o .txt');
    return null;
  }

  try {
    const processedFile = file.type.startsWith('image/') 
      ? await processImageFile(file)
      : file;
    
    updateUIElements(processedFile, elements);
    return processedFile;
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    showError('No se pudo procesar la imagen. Por favor, inténtalo de nuevo.');
    return null;
  }
}

export function removeSelectedFile(elements: FileHandlerElements): null {
  const { fileInput, filePreview, textInput } = elements;
  fileInput.value = '';
  filePreview.classList.add('hidden');
  textInput.disabled = false;
  return null;
}

function updateUIElements(
  file: File,
  elements: FileHandlerElements
): void {
  const { fileName, filePreview, textInput } = elements;
  fileName.textContent = file.name;
  filePreview.classList.remove('hidden');
  textInput.value = '';
  textInput.disabled = true;
}

export function isValidFileType(file: File): boolean {
  const allowedTypes = ['text/plain', 'message/rfc822', 'image/jpeg', 'image/png'];
  const allowedExtensions = ['.eml', '.txt', '.jpg', '.jpeg', '.png'];
  
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}