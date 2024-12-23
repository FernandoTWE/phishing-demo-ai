export async function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve(btoa(reader.result as string));
      reader.onerror = error => reject(error);
    });
  }