export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => resolve(btoa(reader.result as string));
    reader.onerror = error => reject(error);
  });
}

export function handleFileSelection(
  event: Event,
  fileNameElement: HTMLElement,
  filePreviewElement: HTMLElement,
  textInputElement: HTMLTextAreaElement
): File | null {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (!isValidFileType(file)) {
      alert('Solo se permiten archivos .eml, .jpg, .jpeg, .png o .txt');
      return null;
    }
    
    fileNameElement.textContent = file.name;
    filePreviewElement.classList.remove('hidden');
    textInputElement.value = '';
    textInputElement.disabled = true;
    return file;
  }
  
  return null;
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

export function isValidFileType(file: File): boolean {
  const allowedTypes = ['text/plain', 'message/rfc822', 'image/jpeg', 'image/png'];
  const allowedExtensions = ['.eml', '.txt', '.jpg', '.jpeg', '.png'];
  
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}