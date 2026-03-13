/**
 * API para guardar la solicitud de consulta CAAT Terrestre.
 * @see https://api-v30.cloud-ultrasist.net/api/consultas/swagger-ui/index.html#/Consultas/caat-terrestre 
 * /api/consultas/caat-terrestre?page=1&size=20
 */



export const API_POST_FILTRAR_TERRESTRE = (page: number, size: number): string => `consultas/caat-terrestre?page=${page}&size=${size}`;



