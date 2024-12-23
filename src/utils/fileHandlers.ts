import { logger } from './logger';
import { validateFile } from './fileValidator';
import { getContentType } from './contentType';
import { processImage } from './imageProcessor';

export async function handleFileSelection(
  event: Event,
  fileNameElement: HTMLElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): Promise<File | null> {
  const target = event.target as HTMLInputElement;
  let file = target.files?.[0];
  
  if (!file) {
    logger.log('warn', 'No file selected');
    return null;
  }

  // Validar archivo
  const validation = validateFile(file);
  if (!validation.isValid) {
    logger.log('error', 'File validation failed', { error: validation.error });
    window.showToast(validation.error || 'Error al validar el archivo', 'error');
    return null;
  }

  try {
    // Procesar imagen si es necesario
    if (file.type.startsWith('image/')) {
      file = await processImage(file);
      logger.log('info', 'Image processed', { 
        originalSize: target.files?.[0].size,
        newSize: file.size 
      });
    }

    // Actualizar UI
    fileNameElement.textContent = file.name;
    filePreviewElement.classList.remove('hidden');
    textInputElement.value = '';
    textInputElement.disabled = true;

    // Mostrar preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.className = 'max-h-32 rounded-lg';
        const previewContainer = document.getElementById('filePreviewImage');
        if (previewContainer) {
          previewContainer.innerHTML = '';
          previewContainer.appendChild(img);
        }
      };
      reader.readAsDataURL(file);
    }

    return file;
  } catch (error) {
    logger.log('error', 'Error handling file', { error });
    window.showToast('Error al procesar el archivo', 'error');
    return null;
  }
}

export function removeSelectedFile(
  fileInputElement: HTMLInputElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): null {
  // Reset file input
  fileInputElement.value = '';
  
  // Hide preview
  filePreviewElement.classList.add('hidden');
  
  // Clear preview image
  const previewImage = document.getElementById('filePreviewImage');
  if (previewImage) {
    previewImage.innerHTML = '';
  }
  
  // Enable text input
  textInputElement.disabled = false;
  
  logger.log('info', 'File removed successfully');
  return null;
}

export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => resolve(btoa(reader.result as string));
    reader.onerror = error => reject(error);
  });
}