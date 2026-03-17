import { Bitacora } from "./bitcora-response";
import { FraccionesResponse } from "./agregar-fraccion";
/**
 * Representa la configuración del programa obtenida desde el servicio.
 *
 * @interface ConfiguracionDelProgramaResponse
 * 
 * @property {string} fecha_inicio_vigencia - Fecha de inicio de vigencia del programa.
 * @property {string} fecha_fin_vigencia - Fecha de finalización de la vigencia del programa.
 * @property {FraccionesResponse[]} fracciones - Lista de fracciones asociadas a la configuración del programa.
 * @property {Bitacora[]} bitacora - Historial de registros que conforman la bitácora del programa.
 */
export interface ConfiguracionDelProgramaResponse{
    fecha_inicio_vigencia : string;
    fecha_fin_vigencia: string;
    fracciones : FraccionesResponse[];
    bitacora: Bitacora[]
}