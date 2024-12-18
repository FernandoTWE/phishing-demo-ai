# Documentación Técnica de Implementación

## 1. Estructura General

El proyecto está construido con Astro y TypeScript, utilizando Tailwind CSS para los estilos. La aplicación permite a los usuarios analizar correos electrónicos mediante dos métodos:
- Subida de archivos (imágenes o .eml)
- Entrada directa de texto

### 1.1 Componentes Principales

- `index.astro`: Página principal con el formulario
- `results.astro`: Página de resultados del análisis
- Componentes modulares en `src/components/`
- Utilidades en `src/utils/`
- Servicios en `src/services/`

## 2. Manejo de Archivos

### 2.1 Validaciones de Archivo (`fileHandlers.ts`)

```typescript
const allowedTypes = ['text/plain', 'message/rfc822', 'image/jpeg', 'image/png'];
const allowedExtensions = ['.eml', '.txt', '.jpg', '.jpeg', '.png'];
```

- Se validan tanto los MIME types como las extensiones
- Tamaño máximo: 4MB
- Conversión automática a base64 para el envío

### 2.2 Proceso de Conversión a Base64

```typescript
async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => resolve(btoa(reader.result as string));
    reader.onerror = error => reject(error);
  });
}
```

## 3. Validaciones del Formulario

### 3.1 Reglas de Validación (`formValidation.ts`)

- No se permite envío simultáneo de archivo y texto
- Campos obligatorios:
  - Idioma
  - Segmento (residencial/pymes)
  - Archivo o texto
- Consentimiento requerido

### 3.2 Estructura de Datos de Formulario

```typescript
interface FormData {
  text: string;
  language: string;
  segment: string;
  file: File | null;
}
```

## 4. Proceso de Envío al Webhook

### 4.1 Estructura del Payload

```typescript
{
  text: string,          // Contenido en base64 o texto plano
  requestId: string,     // Timestamp único
  language: string,      // Código de idioma
  segment: string,       // "residencial" o "pymes"
  contentType: string,   // "text", "image", o tipo de archivo
  contextType: string    // Campo vacío requerido
}
```

### 4.2 Proceso de Envío

1. Validación del formulario
2. Generación de requestId único
3. Conversión de archivo a base64 (si aplica)
4. Envío POST al webhook
5. Inicio del proceso de polling

## 5. Sistema de Polling de Resultados

### 5.1 Proceso de Recuperación (`resultService.ts`)

```typescript
async function checkResults(requestId: string) {
  const response = await fetch(`https://4bda4.twidget.io/requestid?requestId=${requestId}`);
  // Proceso de verificación y manejo de respuesta
}
```

### 5.2 Lógica de Polling

- Intervalo: 5 segundos
- Timeout: 2 minutos
- Manejo de errores con reintentos
- Almacenamiento en localStorage al recibir respuesta

## 6. Visualización de Resultados

### 6.1 Proceso de Renderizado

- Recuperación de datos desde localStorage
- Formateo de resultados según tipo
- Presentación en interfaz moderna y responsive

### 6.2 Estados de la Aplicación

1. Estado inicial (formulario)
2. Estado de carga (loading overlay)
3. Estado de resultados
4. Estados de error

## 7. Seguridad

### 7.1 Medidas Implementadas

- Validación de tipos de archivo
- Sanitización de inputs
- No almacenamiento permanente de datos
- Manejo seguro de base64

### 7.2 Consideraciones de Privacidad

- Los datos se procesan en memoria
- No se almacenan archivos
- Consentimiento explícito requerido

## 8. Manejo de Errores

- Validaciones preventivas en frontend
- Timeouts en peticiones
- Feedback visual para el usuario
- Sistema de reintentos en polling