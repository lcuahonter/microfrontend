/**
 * Representa la respuesta de las validaciones de transporte.
 * 
 * @interface ValidacionesTransporteResponse
 * 
 * @property {string} codigo - Código que identifica el resultado de la validación.
 * @property {string} mensaje - Mensaje descriptivo del resultado de la validación.
 * @property {ValidacionesTransporte} datos - Objeto que contiene los datos específicos de las validaciones de transporte.
 */
export interface ValidacionesTransporteResponse {
    codigo: string;
    mensaje: string;
    datos: ValidacionesTransporte;
}

/**
 * Representa las validaciones relacionadas con el transporte en el sistema.
 * Esta interfaz contiene información detallada sobre los datos del transporte,
 * incluyendo validaciones específicas para diferentes tipos de transporte.
 * 
 * @property {string | null} empTransportista - Nombre del transportista.
 * @property {string | null} numeroPorte - Número de porte.
 * @property {string | null} fechaPorte - Fecha del porte.
 * @property {string | null} marcaTransporte - Marca del transporte.
 * @property {string | null} modeloTransporte - Modelo del transporte.
 * @property {string | null} placasTransporte - Placas del transporte.
 * @property {string | null} contenedorTransporte - Número de contenedor del transporte.
 * @property {string | null} numeroBL - Número de BL (Bill of Lading).
 * @property {string | null} tipoEquipo - Tipo de equipo.
 * @property {string | null} descripcionEquipo - Descripción del equipo.
 * @property {string | null} inicialesEquipo - Iniciales del equipo.
 * @property {string | null} numeroEquipo - Número del equipo.
 * @property {string | null} arriboPendienteAereo - Indica si el arribo aéreo está pendiente.
 * @property {string | null} guiaMasterAereo - Número de guía master aéreo.
 * @property {string | null} guiaHouseAereo - Número de guía house aéreo.
 * @property {string | null} fechaArriboAereo - Fecha de arribo aéreo.
 * @property {string | null} horaArriboAereo - Hora de arribo aéreo.
 * @property {boolean} guiaValida - Indica si la guía es válida.
 * @property {boolean | null} guiaHouseValida - Indica si la guía house es válida.
 * @property {boolean | null} guiaMasterValida - Indica si la guía master es válida.
 * @property {string | null} guiaBLMaritimo - Número de guía BL marítimo.
 * @property {string | null} guiaHouseMaritimo - Número de guía house marítimo.
 * @property {string | null} nombreBuqueMaritimo - Nombre del buque marítimo.
 * @property {string | null} contenedorMaritimo - Número de contenedor marítimo.
 * @property {string | null} tipoTransporteDes - Descripción del tipo de transporte.
 * @property {string | null} datosTransporte - Datos del transporte.
 * @property {string | null} observaciones - Observaciones adicionales.
 * @property {string | null} tipoTransporte - Tipo de transporte.
 * @property {boolean | null} blnMismosDatosTransporte - Indica si los datos de transporte son los mismos.
 */
export interface ValidacionesTransporte {
    empTransportista: string | null;
    numeroPorte: string | null;
    fechaPorte: string | null;
    marcaTransporte: string | null;
    modeloTransporte: string | null;
    placasTransporte: string | null;
    contenedorTransporte: string | null;
    numeroBL: string | null;
    tipoEquipo: string | null;
    descripcionEquipo: string | null;
    inicialesEquipo: string | null;
    numeroEquipo: string | null;
    arriboPendienteAereo: string | null;
    guiaMasterAereo: string | null;
    guiaHouseAereo: string | null;
    fechaArriboAereo: string | null;
    horaArriboAereo: string | null;
    guiaValida: boolean;
    guiaHouseValida: boolean | null;
    guiaMasterValida: boolean | null;
    guiaBLMaritimo: string | null;
    guiaHouseMaritimo: string | null;
    nombreBuqueMaritimo: string | null;
    contenedorMaritimo: string | null;
    tipoTransporteDes: string | null;
    datosTransporte: string | null;
    observaciones: string | null;
    tipoTransporte: string | null;
    blnMismosDatosTransporte: boolean | null;
}

/**
 * Representa el cuerpo de la solicitud para validar el número BL del transporte ferroviario.
 * 
 * @interface BodyValidaFerro
 * 
 * @property {number} numeroBL - Número de BL (Bill of Lading) a validar.
 */
export interface BodyValidaFerro {
    numeroBL: number;
}

/**
 * Representa el cuerpo de la solicitud para validar la guía  del transporte aéreo.
 * 
 * @interface BodyValidaAereo
 * 
 * @property {string} guiaMaster - Número de guía master a validar.
 */
export interface BodyValidaAereo {
    guiaMasterAereo: string;
}

/**
 * Representa el cuerpo de la solicitud para validar la guía  del transporte aéreo.
 * 
 * @interface BodyValidaAereo
 * 
 * @property {string} guiaHouse- Número de guía house a validar.
 */
export interface BodyValidaAereoDos {
    guiaHouseAereo: string;
}