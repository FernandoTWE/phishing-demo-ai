import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Integraciones que estás utilizando
  integrations: [
    tailwind(), 
    cloudflare() // Integración de Cloudflare
  ],
  // Configuración del adaptador de salida
  output: 'server', // Específico para Cloudflare Workers
  adapter: cloudflare(), // Configura el adaptador de Cloudflare
});
