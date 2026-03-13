/**
 * Interfaz que representa la estructura de un modelo de obtención de documentos.
 * 
 * @property id_documento_solicitud - Identificador único para la solicitud del documento.
 * @property documento - Objeto que contiene detalles sobre el documento.
 * @property documento.fecha_fin_vigencia - Fecha de expiración del documento.
 * @property documento.fecha_ini_vigencia - Fecha de inicio de vigencia del documento.
 * @property documento.nombre - Nombre del documento.
 * @property documento.tipo_documento - Tipo del documento.
 * @property ide_est_documento_sol - Identificador para el estado de la solicitud del documento.
 * @property estado_documento_solicitud - Estado actual de la solicitud del documento.
 * @property fecha_asociacion - Fecha en que se asoció el documento.
 * @property documento_uuid - Identificador único para el documento.
 */
export interface ModeloObtenDocumento {
    id_documento_solicitud: number,
    documento: {
        fecha_fin_vigencia: string,
        fecha_ini_vigencia: string,
        nombre: string,
        tipo_documento: string
    },
    ide_est_documento_sol: string,
    estado_documento_solicitud: string,
    fecha_asociacion: string,
    documento_uuid: string
}