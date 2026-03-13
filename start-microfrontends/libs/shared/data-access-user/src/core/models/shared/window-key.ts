/**
 * Tipo `WindowKey`
 * 
 * Este tipo representa todas las claves (propiedades) disponibles en el objeto global `window`.
 * 
 * Se utiliza principalmente para proporcionar seguridad de tipos (type safety) cuando se accede dinámicamente
 * a propiedades del objeto `window`, como por ejemplo `window['PKI']`, evitando errores de escritura
 * y permitiendo autocompletado en editores compatibles con TypeScript.
 * 
 * @example
 * const pki = window['PKI' as WindowKey];
 */
export type WindowKey = keyof typeof window;
