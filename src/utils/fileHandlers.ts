import { logger } from './logger';
import { validateFile } from './fileValidator';
import { getContentType } from './contentType';

export async function handleFileSelection(
  event: Event,
  fileNameElement: HTMLElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): Promise<File | null> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) {
    logger.log('warn', 'No file selected');
    return null;
  }

  logger.log('info', 'File selected', { 
    name: file.name,
    size: file.size,
    type: file.type 
  });

  // Validate file
  const validation = validateFile(file);
  if (!validation.isValid) {
    logger.log('error', 'File validation failed', { error: validation.error });
    alert(validation.error);
    return null;
  }

  try {
    // Preview image if it's an image file
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

    // Update UI
    fileNameElement.textContent = file.name;
    filePreviewElement.classList.remove('hidden');
    textInputElement.value = '';
    textInputElement.disabled = true;

    logger.log('info', 'File processed successfully');
    return file;
  } catch (error) {
    logger.log('error', 'Error processing file', { error });
    alert('Error al procesar el archivo. Por favor, inténtalo de nuevo.');
    return null;
  }
}

export function removeSelectedFile(
  fileInputElement: HTMLInputElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): null {
  logger.log('info', 'Removing selected file');
  
  fileInputElement.value = '';
  filePreviewElement.classList.add('hidden');
  textInputElement.disabled = false;
  
  const previewContainer = document.getElementById('filePreviewImage');
  if (previewContainer) {
    previewContainer.innerHTML = '';
  }

  return null;
}