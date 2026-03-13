/**
 * Permisos vigentes
 * @interface PermisosVigentes
 * @description Contiene la información de los permisos vigentes.
 */
export interface PermisosVigentes {
    /**
     * Número de folio del permiso.
     */
    numeroResolucion: string;

    /**
     * Tipo de solicitud del permiso.
     */
    tipoSolicitud: string;

    /**
     * Régimen del permiso.
     */
    regimen: string;

    /**
     * Clasificación del régimen del permiso.
     */
    clasificacionRegimen: string;

    /**
     * Periodo de vigencia del permiso.
     */
    periodoDeVigencia: string;

    /**
     * Fracción arancelaria del permiso.
     */
    fraccionArancelaria: string;

    /**
     * Unidad de medida del permiso.
     */
    unidad: string;

    /**
     * NICO del permiso.
     */
    nico: string;

    /**
     * Descripción del NICO del permiso.
     */
    nicoDescripcion: string;

    /**
     * Acotación del permiso.
     */
    acotacion: string;

    /**
     * Cantidad autorizada del permiso.
     */
    cantidadAutorizada: string;

    /**
     * Valor autorizado del permiso.
     */
    valorAutorizado: string;

    /**
     * Fecha de inicio de vigencia del permiso.
     */
    fechaInicioVigencia: string;

    /**
     * Fecha de fin de vigencia del permiso.
     */
    fechaFinVigencia: string;

    /**
     * Fecha de salida del permiso.
     */
    saldo?: string;

    /**
     * Descripción de la mercancía del permiso.
     */
    descripcionMercancia?: string;

    /**
     * País de procedencia del permiso.
     */
    paisProcedencia?: string;

    /**
     * Número de folio del trámite asociado al permiso.
     * @type {string}
     */
    folioTramite?: string;
}

/**
 * Respuesta de permisos vigentes
 * @interface PermisosVigentesRespuesta
 * @description Contiene la respuesta de la API para los permisos vigentes.
 */
export interface PermisosVigentesRespuesta {
    /**
     * Código de respuesta de la API.
     * @type {number}
     */
    code: number;

    /**
     * Datos de la respuesta.
     * @type {PermisosVigentes[]}
     */
    data: PermisosVigentes[];

    /**
     * Mensaje de respuesta de la API.
     * @type {string}
     */
    message: string;
}

/**
 * Detalle del titular
 * @interface TitularDetalle
 * @description Contiene la información del titular del permiso.
 */
export interface TitularDetalle {
    /**
     * Denominación del titular.
     * @type {string}
     */
    denominacion: string;

    /**
     * Actividad económica del titular.
     * @type {string}
     */
    actividadEconomica: string;

    /**
     * Correo electrónico del titular.
     * @type {string}
     */
    correoElectronico: string;

    /**
     * RFC del titular.
     * @type {string}
     */
    rfc: string;

    /**
     * Calle del domicilio fiscal del titular.
     * @type {string}
     */
    calle: string;

    /**
     * Número exterior del domicilio fiscal del titular.
     * @type {string}
     */
    numeroExterior: string;

    /**
     * Número interior del domicilio fiscal del titular.
     * @type {string}
     */
    numeroInterior: string;

    /**
     * Código postal del domicilio fiscal del titular.
     * @type {string}
     */
    codigoPostal: string;

    /**
     * Colonia del domicilio fiscal del titular.
     * @type {string}
     */
    colonia: string;

    /**
     * País del domicilio fiscal del titular.
     * @type {string}
     */
    pais: string;

    /**
     * Estado del domicilio fiscal del titular.
     * @type {string}
     */
    estado: string;

    /**
     * Localidad del domicilio fiscal del titular.
     * @type {string}
     */
    localidad: string;

    /**
     * Municipio o alcaldía del domicilio fiscal del titular.
     * @type {string}
     */
    municipioAlcaldia: string;

    /**
     * Teléfono del domicilio fiscal del titular.
     * @type {string}
     */
    telefono: string;
}

/**
 * Respuesta del detalle del titular
 * @interface TitularDetalleRespuesta
 * @description Contiene la respuesta de la API para el detalle del titular.
 */
export interface TitularDetalleRespuesta {
    /**
     * Código de respuesta de la API.
     * @type {number}
     */
    code: number;

    /**
     * Datos de la respuesta.
     * @type {TitularDetalle[]}
     */
    data: TitularDetalle[];

    /**
     * Mensaje de respuesta de la API.
     * @type {string}
     */
    message: string;
}

/**
 * Personas a notificar
 * @interface PersonasNotificar
 * @description Contiene la información de las personas a notificar.
 */
export interface PersonasNotificar {
    /**
     * Nombre de la persona a notificar.
     * @type {string}
     */
    nombre: string;

    /**
     * Apellido paterno de la persona a notificar.
     * @type {string}
     */
    apellidoPaterno: string;

    /**
     * Apellido materno de la persona a notificar.
     * @type {string}
     */
    apellidoMaterno: string;

    /**
     * Correo electrónico de la persona a notificar.
     * @type {string}
     */
    correoElectronico: string;

    /**
     * País de la persona a notificar.
     * @type {string}
     */
    pais: string;

    /**
     * Entidad federativa de la persona a notificar.
     * @type {string}
     */
    entidadFederative: string;

    /**
     * Municipio o delegación de la persona a notificar.
     * @type {string}
     */
    municipioDelegacion: string;
}

/**
 * Respuesta de personas a notificar
 * @interface PersonasNotificarRespuesta
 * @description Contiene la respuesta de la API para las personas a notificar.
 */
export interface PersonasNotificarRespuesta {
    /**
     * Código de respuesta de la API.
     * @type {number}
     */
    code: number;

    /**
     * Datos de la respuesta.
     * @type {PersonasNotificar[]}
     */
    data: PersonasNotificar[];

    /**
     * Mensaje de respuesta de la API.
     * @type {string}
     */
    message: string;
}