/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildPath: "build/index.js", // Asegura que el build se genere correctamente
  serverModuleFormat: 'esm',
  future: {
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_dev: true,
  },
  ignoredRouteFiles: ['**/.*'],
  tailwind: true,
};
