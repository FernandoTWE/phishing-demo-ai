import { logger } from './logger';

export async function processImage(file: File): Promise<File> {
  // Si no es una imagen, devolver el archivo original
  if (!file.type.startsWith('image/')) {
    return file;
  }

  try {
    // Crear un objeto URL para la imagen
    const imageUrl = URL.createObjectURL(file);
    
    // Cargar la imagen
    const img = await loadImage(imageUrl);
    
    // Comprimir la imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calcular dimensiones manteniendo el aspect ratio
    const maxSize = 1200;
    let width = img.width;
    let height = img.height;
    
    if (width > height && width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Dibujar imagen redimensionada
    ctx?.drawImage(img, 0, 0, width, height);
    
    // Convertir a Blob con calidad reducida
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b as Blob),
        'image/jpeg',
        0.7 // Calidad de compresión
      );
    });
    
    // Limpiar
    URL.revokeObjectURL(imageUrl);
    
    // Crear nuevo archivo
    return new File([blob], file.name, {
      type: 'image/jpeg'
    });
  } catch (error) {
    logger.log('error', 'Error processing image', { error });
    return file; // En caso de error, devolver original
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}