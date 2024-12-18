interface FormData {
  text: string;
  language: string;
  segment: string;
  file: File | null;
}

export function validateForm(formData: FormData): { isValid: boolean; error?: string } {
  if (!formData.language || !formData.segment) {
    return { 
      isValid: false, 
      error: 'Por favor, selecciona un idioma y un segmento' 
    };
  }

  if (formData.file && formData.text.trim()) {
    return { 
      isValid: false, 
      error: 'Por favor, elige solo una opción: subir archivo o escribir texto' 
    };
  }

  if (!formData.file && !formData.text.trim()) {
    return { 
      isValid: false, 
      error: 'Por favor, sube un archivo o escribe un texto' 
    };
  }

  return { isValid: true };
}