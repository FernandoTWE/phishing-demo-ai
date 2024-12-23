export async function processImageFile(file: File): Promise<File> {
    // Si no es una imagen, devolver el archivo original
    if (!file.type.startsWith('image/')) {
      return file;
    }
  
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      img.onload = () => {
        // Mantener la relación de aspecto pero reducir si es necesario
        let width = img.width;
        let height = img.height;
        const maxSize = 1920; // Tamaño máximo razonable
  
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
  
        // Convertir a JPEG con calidad 0.8
        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(processedFile);
          } else {
            reject(new Error('Error al procesar la imagen'));
          }
        }, 'image/jpeg', 0.8);
      };
  
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }