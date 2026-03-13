/**
 * API endpoint para filtrar consultas de CAAT Aéreo.
 * @see https://api-v30.cloud-ultrasist.net/api/consultas/caat-agentes
 * @param {number} page - El número de página a recuperar (1-indexado)
 * @param {number} size - El número de elementos por página
 * @returns {string} La ruta del endpoint para la consulta de CAAT Aéreo
 */
export const API_POST_FILTRAR_AGENTES = (page: number, size: number): string => `consultas/caat-agentes?page=${page}&size=${size}`;

