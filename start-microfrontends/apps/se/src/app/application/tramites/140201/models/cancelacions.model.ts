/**
 * @description
 * Interfaz que define la estructura del domicilio de notificación.
 */
export interface DomicilioNotificacion {
    calle: string;
    numeroExterior: string;
    apellidoMaterno: string;
}

/**
 * @description
 * Interfaz que representa los datos de cancelación de autorizaciones.
 */
export interface CancelacionDeAutorizaciones {
    /**
     * Folio del programa.
     */
    folioDePrograma: string;

    /**
     * Tipo de programa.
     */
    tipoPrograma: string;

    /**
     * Modalidad seleccionada.
     */
    seleccionaLaModalidad: string;
    /**
     * Motivo de cancelación.
     */
    estatus: string;
}

/**
 * @description
 * Interfaz que representa el estado del formulario de pago de derechos.
 */
export const FECHA_DE_PAGO = {
    /**
    * Nombre de la etiqueta para el campo de fecha de pago.
    */
    labelNombre: 'Fecha de pago',
    /**
    * Indica si el campo es obligatorio.
    */
    required: true,
    /**
    * Indica si el campo está habilitado para edición.
    */
    habilitado: true,
};