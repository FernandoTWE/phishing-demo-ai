export async function processFileForUpload(file: File): Promise<string> {
    // Validar que el archivo existe
    if (!file || !(file instanceof File)) {
      throw new Error('Archivo no válido');
    }
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const result = reader.result;
          if (typeof result !== 'string' || !result) {
            throw new Error('Error al leer el archivo');
          }
          resolve(result);
        } catch (error) {
          reject(new Error('Error al procesar el archivo'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      
      // Leer el archivo como URL de datos
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        reject(new Error('Error al iniciar la lectura del archivo'));
      }
    });
  }