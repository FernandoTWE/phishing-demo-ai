import { logger } from '../logger';

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