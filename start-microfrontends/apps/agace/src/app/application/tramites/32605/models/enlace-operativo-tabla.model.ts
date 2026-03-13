/**
 * Representa un enlace operativo.
 * @description Contiene los datos personales y de contacto de un enlace operativo, incluyendo su ciudad, cargo y si es suplente.
 */
export interface TablaEnlaceOperativo {
    
    /**
     * Registro único del enlace operativo.
     */
    registro: string;

    /**
     * Identificador único del enlace.
     */
    id: number;

    /**
     * Registro Federal de Contribuyentes.
     */
    rfc: string;

    /**
     * Nombre del enlace operativo.
     */
    nombre: string;

    /**
     * Apellido paterno del enlace.
     */
    apellidoPaterno: string;

    /**
     * Apellido materno del enlace.
     */
    apellidoMaterno: string;

    /**
     * Ciudad en la que reside el enlace.
     */
    cuidad: string;

    /**
     * Cargo que desempeña el enlace operativo.
     */
    cargo: string;

    /**
     * Número de teléfono de contacto.
     */
    telefono: string;

    /**
     * Correo electrónico del enlace operativo.
     */
    correoElectronico: string;

    /**
     * Indica si el enlace operativo es suplente.
     */
    suplente: boolean;

    /**
     * Indica si el enlace ha sido seleccionado.
     * Campo opcional.
     */
    seleccionado?: boolean;
}


export interface EnlaceOperativoRespuestaTabla {
    /**
     * Código de estado de la respuesta HTTP.
     * @description Indica el resultado de la operación (200: éxito, 4xx: error cliente, 5xx: error servidor)
     * @example 200, 400, 404, 500
     */
    code: number;
    
    /**
     * Arreglo de datos de personas notificaciones.
     * @description Contiene la lista de personas obtenidas del servidor
     */
    data: TablaEnlaceOperativo[];
    
    /**
     * Mensaje descriptivo de la respuesta.
     * @description Proporciona información adicional sobre el resultado de la operación
     * @example "Operación exitosa", "Error al obtener datos"
     */
    message: string;
}