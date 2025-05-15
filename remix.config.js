/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverModuleFormat: 'esm', // Usa ESM para comp
  serverBuildTarget: 'vercel',
  server: './server.js',
  future: {
    v2_routeConvention: true, // Habilita la convención de rutas v2
    v2_errorBoundary: true, // Usa los nuevos boundaries de errores
    v2_headers: true, // Mejora la gestión de headers en Remix
    v2_dev: true, // Activa mejoras de desarrollo
  },
  ignoredRouteFiles: ['**/.*'], // Ignora archivos ocultos
  tailwind: true, // Habilita Tailwind si está en uso
};
