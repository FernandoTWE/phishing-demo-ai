import { logger } from '../logger';
import { validateFile } from '../fileValidator';
import { processImage } from '../imageProcessor';

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

  // Validate file
  const validation = validateFile(file);
  if (!validation.isValid) {
    logger.log('error', 'File validation failed', { error: validation.error });
    window.showToast(validation.error || 'Error al validar el archivo', 'error');
    return null;
  }

  try {
    // Process image if necessary
    if (file.type.startsWith('image/')) {
      file = await processImage(file);
      logger.log('info', 'Image processed', { 
        originalSize: target.files?.[0].size,
        newSize: file.size 
      });
    }

    // Update UI
    fileNameElement.textContent = file.name;
    filePreviewElement.classList.remove('hidden');
    textInputElement.value = '';
    textInputElement.disabled = true;

    // Show preview for images
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