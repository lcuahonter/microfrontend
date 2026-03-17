/**
 * Modelo para la solicitud de guardado de permiso de importación con modificación temporal de mercancía.
 * 
 * @description Este modelo representa la estructura de datos requerida para enviar una solicitud
 * de guardado de un trámite de importación con modificación temporal de mercancía.
 * 
 * @example
 * ```typescript
 * const solicitud: GuardarSolicitudRequest = {
 *   cve_entidad_federativa: "09",
 *   descripcion_representacion_federal: "Ciudad de México",
 *   clave_clasificacion_regimen: "REG001",
 *   regimen: { cve_regimen: "TEMP001" },
 *   mercancia: { ... },
 *   productor: { ... },
 *   exportador: { ... },
 *   datos_genericos_solicitud: { ... },
 *   cve_unidad_administrativa: "UA001",
 *   rfc: "RFC123456789"
 * };
 * ```
 */
export interface GuardarSolicitudRequest {
    /** Clave de la entidad federativa donde se realiza el trámite */
    cve_entidad_federativa: string;
    
    /** Descripción de la representación federal correspondiente */
    descripcion_representacion_federal: string;
    
    /** Clave de clasificación del régimen aduanero aplicable */
    clave_clasificacion_regimen: string;
    
    /** Información del régimen aduanero */
    regimen: Regimen;
    
    /** Información detallada de la mercancía a importar */
    mercancia: Mercancia;
    
    /** Información del productor de la mercancía */
    productor: Productor;
    
    /** Información del exportador de la mercancía */
    exportador: Exportador;
    
    /** Datos genéricos adicionales de la solicitud */
    datos_genericos_solicitud: DatosGenericosSolicitud;
    
    /** Clave de la unidad administrativa responsable */
    cve_unidad_administrativa: string;
    
    /** RFC del representante legal que presenta la solicitud */
    rfc: string;
}

/**
 * Modelo para el régimen aduanero en la solicitud de guardado.
 * 
 * @description Define el tipo de régimen bajo el cual se realizará la importación temporal.
 */
export interface Regimen {
    /** Clave única que identifica el régimen aduanero aplicable */
    cve_regimen: string;
}

/**
 * Modelo para la mercancía en la solicitud de guardado.
 * 
 * @description Contiene toda la información técnica, comercial y aduanera de la mercancía
 * que será objeto de importación temporal con modificación.
 */
export interface Mercancia {
    /** Descripción detallada de la modificación temporal que se realizará a la mercancía */
    descripcion_temporal_modificacion_mercancia: string;
    
    /** Marca comercial de la mercancía */
    marca: string;
    
    /** Tipo de aduana por donde ingresará la mercancía */
    tipo_aduana: string;
    
    /** Fracción arancelaria que clasifica la mercancía según el sistema armonizado */
    fraccion_arancelaria: string;
    
    /** Subdivisión específica dentro de la fracción arancelaria */
    subdivision: string;
    
    /** Unidad de medida establecida en la tarifa arancelaria */
    unidad_medida_tarifaria: string;
    
    /** Unidad de medida utilizada comercialmente */
    unidad_medida_comercial: string;
    
    /** Descripción técnica completa de la mercancía */
    descripcion: string;
    
    /** Cantidad de mercancía expresada en unidades comerciales */
    cantidad_comercial: number;
    
    /** Cantidad de mercancía expresada en unidades tarifarias */
    cantidad_tarifaria: number;
    
    /** Precio unitario de la mercancía */
    precio_unitario: number;
    
    /** Valor total de la factura */
    valor_total_factura: number;
    
    /** Clave del país de destino final de la mercancía */
    pais_destino_clave: string;
    
    /** Clave del país de origen de la mercancía */
    pais_origen_clave: string;
    
    /** Observaciones adicionales sobre la mercancía */
    observaciones: string;
    
    /** Número de la factura comercial */
    numero_factura: string;
    
    /** Fecha de emisión de la factura en formato ISO (YYYY-MM-DD) */
    fecha_factura: string;
    
    /** Capacidad o volumen de la mercancía */
    capacidad: number;
    
    /** Moneda en que está expresada la factura */
    moneda: string;
    
    /** Valor de la factura en moneda original */
    valor_factura: number;
    
    /** Valor de la factura convertido a dólares estadounidenses */
    valor_factura_usd: number;
    
    /** Valor total de la factura expresado en dólares estadounidenses */
    valor_total_factura_dolares: number;
}

/**
 * Modelo para el productor en la solicitud de guardado.
 * 
 * @description Información del fabricante o productor original de la mercancía.
 * Puede ser persona física o moral según el tipo especificado.
 */
export interface Productor {
    /** Identificador del tipo de persona (física o moral) */
    ide_tipo_persona_sol: string;
    
    /** Nombre del productor (para persona física) */
    nombre: string;
    
    /** Apellido paterno del productor (para persona física) */
    apellido_paterno: string;
    
    /** Apellido materno del productor (para persona física) */
    apellido_materno: string;
    
    /** Razón social del productor (para persona moral) */
    razon_social: string;
    
    /** Descripción de la ubicación geográfica del productor */
    descripcion_ubicacion: string;
}

/**
 * Modelo para el exportador en la solicitud de guardado.
 * 
 * @description Información de la empresa o persona que exporta la mercancía.
 * Puede ser persona física o moral según el tipo especificado.
 */
export interface Exportador {
    /** Identificador del tipo de persona (física o moral) */
    ide_tipo_persona_sol: string;
    
    /** Nombre del exportador (para persona física) */
    nombre: string;
    
    /** Apellido paterno del exportador (para persona física) */
    apellido_paterno: string;
    
    /** Apellido materno del exportador (para persona física) */
    apellido_materno: string;
    
    /** Razón social del exportador (para persona moral) */
    razon_social: string;
    
    /** Descripción de la ubicación geográfica del exportador */
    descripcion_ubicacion: string;
}

/**
 * Modelo para los datos genéricos de la solicitud.
 * 
 * @description Campos adicionales flexibles que pueden contener información
 * específica según los requerimientos particulares del trámite.
 */
export interface DatosGenericosSolicitud {
    /** Primera descripción genérica adicional */
    descripcion_generica_1: string;
    
    /** Fecha genérica en formato ISO (YYYY-MM-DD) */
    fecha_generica_1: string;
    
    /** Segunda descripción genérica adicional */
    descripcion_generica_2: string;
    
    /** Tercera descripción genérica adicional */
    descripcion_generica_3: string;
    
    /** Primer valor numérico genérico */
    num_generico_1: number;
    
    /** Segundo valor numérico genérico */
    num_generico_2: number;
    
    /** Tercer valor numérico genérico */
    num_generico_3: number;
}

/**
 * Modelo para el representante legal en la solicitud de guardado.
 * 
 * @description Información de la persona autorizada para actuar en nombre
 * del solicitante en el trámite aduanero.
 * 
 * @note Esta interfaz está definida pero no se utiliza en GuardarSolicitudRequest.
 * Considerar si es necesaria o debe ser removida.
 */
export interface RepresentanteLegal {
    /** Nombre del representante legal */
    nombre: string;
    
    /** Apellido paterno del representante legal */
    ap_paterno: string;
    
    /** Apellido materno del representante legal */
    ap_materno: string;
    
    /** Número telefónico de contacto del representante legal */
    telefono: string;
}