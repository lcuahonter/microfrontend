/**
* Interfaz que define la estructura de datos para los asociados del sistema.
* Representa la información básica de un asociado y su trámite correspondiente.
*/
export interface Asociados {
   /**
    * Identificador único del asociado.
    * @type {number}
    * @example 12345
    */
   id: number;

   /**
    * Número de folio único que identifica el trámite del asociado.
    * @type {string}
    * @example "TRM-2024-001234"
    */
   folioTramite: string;

   /**
    * Tipo de trámite que está realizando el asociado.
    * @type {string}
    * @example "Alta", "Baja", "Modificación", "Renovación"
    */
   tipoTramite: string;

   /**
    * Estado actual del trámite del asociado.
    * @type {string}
    * @example "Pendiente", "En Proceso", "Aprobado", "Rechazado", "Completado"
    */
   estatus: string;

   /**
    * Fecha en la que se registró por primera vez el asociado en el sistema.
    * Formato de fecha en string (ISO 8601 recomendado).
    * @type {string}
    * @example "2024-01-15T10:30:00Z" o "2024-01-15"
    */
   fechaAltaDeRegistro: string;
}