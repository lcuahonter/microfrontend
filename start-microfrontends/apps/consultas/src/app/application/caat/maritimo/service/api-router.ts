/**
 * API para guardar la consulta CAAT Marítimo.
 * @see https://api-v30.cloud-ultrasist.net/api/consultas/swagger-ui/index.html#/Consultas/caat-maritimo
 * /api/consultas/caat-maritimo?page=1&size=20
 */

export const API_POST_FILTRAR_MARITIMO = (page: number, size: number): string => `consultas/caat-maritimo?page=${page}&size=${size}`;





