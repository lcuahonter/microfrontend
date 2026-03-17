/**
 * Class: BaseResponse
 * 
 * Description:
 * 
 * Modelo que representa el contenido de los llamados a la API
 *
 * @author Miguel Arturo Rojas Hernández
 * @email marojash@desarrollo-ultrasist.com.mx
 * 
 * @created 05 de junio 2024
 * @version 1.0
 * @category Modelo de entrada
 */
export interface BaseResponse<T = string> {
    codigo: string;
    error?: string;
    path: string;
    timestamp: string;
    mensaje: string;
    datos?: T;
    detalle_errores?: string[];
}
