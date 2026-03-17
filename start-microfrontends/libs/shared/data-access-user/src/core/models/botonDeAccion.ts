/**
 * Representa la configuración y comportamiento de un botón de acción dentro de la interfaz.
 *
 * @interface BotonAccion
 * 
 * @property {string} id - Identificador único del botón utilizado en el HTML.
 * @property {string} operacion - Acción o proceso que se ejecutará al presionar el botón.
 * @property {string} label - Texto visible que se mostrará dentro del botón.
 * @property {string} url - Ruta o enlace al que se redirige al usuario, si aplica.
 */
export interface BotonAccion {
    id: string;
    operacion: string;
    label: string;
    url: string;
}

/**
 * Representa la información de un documento asociado al trámite.
 *
 * @interface Documento
 * 
 * @property {number} id_documento_oficial - Identificador único del documento oficial.
 * @property {string} desc_documento - Descripción del documento.
 * @property {string | null} documento_minio - Nombre o identificador del archivo almacenado, o null si no existe.
 */
export interface DocumentoInterfaz {
    id_documento_oficial: number;
    desc_documento: string;
    documento_minio: string | null;
}

/**
 * Contiene los acuses y documentos oficiales relacionados con un trámite.
 *
 * @interface Documentos
 * 
 * @property {Array<DocumentoInterfaz>} acuses - Lista de documentos correspondientes a los acuses del trámite.
 * @property {Array<DocumentoInterfaz>} documentos_oficiales - Lista de documentos oficiales emitidos para el trámite.
 */
export interface DocumentosInterfaz {
    acuses: Array<DocumentoInterfaz>;
    documentos_oficiales: Array<DocumentoInterfaz>;
}

/**
 * Representa los datos asociados a la bandeja de acuses y resoluciones,
 * incluyendo botones disponibles, información del trámite y documentos relacionados.
 *
 * @interface BandejaAcusesResoluciones
 * 
 * @property {BotonAccion[]} botones - Lista de botones de acción configurados para el trámite.
 * @property {boolean} es_tramite_comun - Indica si el trámite es común.
 * @property {string | null} mensaje - Mensaje adicional proporcionado por el servicio, si existe.
 * @property {string} num_folio_tramite - Número de folio del trámite.
 * @property {number} id_tipo_tramite - Identificador del tipo de trámite.
 * @property {number} id_solicitud - Identificador de la solicitud relacionada.
 * @property {string} acronimo - Acrónimo asociado al trámite.
 * @property {string | null} tipo_solicitud - Descripción del tipo de solicitud.
 * @property {number} dias_habiles_transcurridos - Número de días hábiles transcurridos desde el inicio del trámite.
 * @property {string} fecha_inicio_tramite - Fecha en la que inició el trámite.
 * @property {string} unidad_administrativa - Nombre de la unidad administrativa asociada.
 * @property {string} estado_solicitud - Estado actual de la solicitud.
 * @property {boolean} tiene_aviso_cancelacion - Indica si la solicitud tiene aviso de cancelación.
 * @property {DocumentosInterfaz} documentos - Conjunto de acuses y documentos oficiales del trámite.
 */
export interface BandejaAcusesResoluciones {
    botones: BotonAccion[];
    es_tramite_comun: boolean;
    mensaje: string | null;
    num_folio_tramite: string;
    id_tipo_tramite: number;
    id_solicitud: number;
    acronimo: string;
    tipo_solicitud: string | null;
    dias_habiles_transcurridos: number;
    fecha_inicio_tramite: string;
    unidad_administrativa: string;
    estado_solicitud: string;
    tiene_aviso_cancelacion: boolean;
    documentos: DocumentosInterfaz;
}

/**
 * Representa la respuesta del servicio que obtiene la información
 * de la bandeja de acuses y resoluciones.
 *
 * @interface RespuestaBandejaAcusesResoluciones
 * 
 * @property {string} codigo - Código de resultado de la operación (por ejemplo: "00" para éxito).
 * @property {string} mensaje - Mensaje descriptivo del resultado de la operación.
 * @property {BandejaAcusesResoluciones} datos - Información detallada de la bandeja de acuses y resoluciones.
 */
export interface RespuestaBandejaAcusesResoluciones {
    codigo: string;
    mensaje: string;
    datos: BandejaAcusesResoluciones;
}
