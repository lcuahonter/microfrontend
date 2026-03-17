/**
 * Interfaz que representa el detalle de una solicitud de avisos de residuos peligrosos
 */
export interface DetalleSolicitudAvisos {
    /** Indica si la empresa pertenece al mismo grupo empresarial */
    empresa_mismo_grupo: boolean,
    /** Descripción genérica adicional 2 */
    descripcion_generica2: string,
    /** Descripción genérica adicional 3 */
    descripcion_generica3: string,
    /** Identificador único de la solicitud */
    id_solicitud: number;
    /** Número de programa IMMEX asociado */
    numero_programa_immex: string;
    /** Bandera genérica booleana */
    boolean_generico: boolean;
    /** Número de registro ambiental de la empresa */
    numero_registro_ambiental: string;
    /** Descripción genérica 1 */
    descripcion_generica1: string;
    /** Descripción CLOB genérica 2 */
    desc_clob_generica2: string;
    /** Descripción CLOB genérica 1 */
    descripcion_clob_generica1: string;
    /** Indica si es una empresa controladora */
    empresa_controladora: boolean;
    /** Información de la empresa de reciclaje */
    empresa_reciclaje: EmpresaReciclaje;
    /** Información del destinatario de los residuos */
    destinatario: Destinatario;
    /** Información del transporte utilizado */
    transporte: Transporte;
    /** Aduana de salida por donde se exportan los residuos */
    aduana_salida: AduanaSalida;
    /** Lista de residuos incluidos en la solicitud */
    residuos: ResiduoDetalle[];
    /** RFC del solicitante */
    rfc_solicitante: string;
}

/**
 * Interfaz que representa la información de una empresa de reciclaje
 */
export interface EmpresaReciclaje {
    /** Identificador único de la empresa */
    id_empresa: number;
    /** Razón social de la empresa */
    razon_social: string;
    /** Nombre comercial de la empresa */
    nombre: string;
    /** Número telefónico de contacto */
    telefono: string;
    /** Correo electrónico de contacto */
    correo_electronico: string;
}

/**
 * Interfaz que representa la información del destinatario de los residuos
 */
export interface Destinatario {
    /** Identificador del destinatario */
    id_destinatario: string;
    /** Razón social del destinatario */
    razon_social: string;
    /** País de destino */
    pais: string;
    /** Domicilio completo del destinatario */
    domicilio: string;
    /** Código postal del domicilio */
    codigo_postal: string;
}

/**
 * Interfaz que representa la información del transporte de residuos
 */
export interface Transporte {
    /** Razón social de la empresa transportista */
    razon_social: string;
    /** Número de autorización SEMARNAT para transporte de residuos */
    autorizacion_semarnat_transporte: string;
}

/**
 * Interfaz que representa la aduana de salida
 */
export interface AduanaSalida {
    /** Clave de la aduana de salida */
    clave: string;
}

/**
 * Interfaz que representa el detalle de un residuo peligroso
 */
export interface ResiduoDetalle {
    /** Identificador de la mercancía */
    id_mercancia: number;
    /** Descripción detallada de la mercancía */
    descripcion_mercancia: string;
    /** Cantidad en unidad de medida de transporte */
    cantidadUMT: string;
    /** Cantidad expresada en letra */
    cantidad_letra: string;
    /** Clave de la unidad de medida comercial */
    cve_unidad_medida_comercial: number;
    /** Descripción de la unidad de medida comercial */
    descripcion_umc: string;
    /** Clave de la fracción arancelaria */
    cve_fraccion: string;
    /** Descripción de la fracción arancelaria */
    desc_fraccion: string;
    /** Clave de la partida arancelaria */
    cve_partida: string;
    /** Campo genérico 2 */
    generica2: string;
    /** Bandera genérica booleana 1 */
    boolean_generico1: string;
    /** Descripción de la bandera genérica booleana 1 */
    desc_boolean_generico1: string;
    /** Fracción NICO (Nomenclatura de Instrumentos de Control Obligatorio) */
    fraccion_nico: string;
    /** Clave NICO */
    cve_nico: string;
    /** Descripción de la denominación específica */
    desc_denominacion_especifica: string;
    /** Nombre químico del residuo */
    nombre_quimico: string;
    /** Descripción de la especie */
    desc_especie: string;
    /** Clave del nombre del residuo */
    cve_nombre_residuo: string;
    /** Descripción del nombre del residuo */
    desc_nombre_residuo: string;
    /** Clave del criterio de peligrosidad */
    cve_criterio_peligrosidad: string;
    /** Estado físico del residuo */
    estado_fisico: string;
    /** Descripción del estado físico */
    desc_estado_fisico: string;
    /** Descripción de otros estados físicos no catalogados */
    descripcion_estado_fisico_otros: string;
    /** Número de oficio para casos especiales */
    numero_oficio_caso_especial: string;
    /** Descripción del tipo de contenedor */
    desc_tipo_contenedor: string;
    /** Descripción de otros tipos de contenedores no catalogados */
    descripcion_tipo_contenedor_otros: string;
    /** Descripción de otras especificaciones adicionales */
    descripcion_otras_especificaciones: string;
    /** Número de manifiesto de entrega */
    numero_manifiesto: string;
    /** Capacidad del contenedor */
    capacidad: string;
    /** Fracción arancelaria completa */
    fraccion_arancelaria: string;
    /** Descripción NICO */
    desc_nico: string;
    /** Descripción de otro tipo de contenedor */
    desc_otro_contenedor: string;
    /** Descripción de otro estado físico */
    desc_otro_estado_fisico: string;
    /** Número de partida */
    numero_partida: number;
    /** Clave de clasificación del residuo */
    cve_clasificacion: string;
    /** Descripción de la clasificación */
    desc_clasificacion: string;
    /** Nombre de la clasificación */
    nom_clasificacion: string;
    /** Descripción del atributo */
    desc_atributo: string;
    /** Clave del atributo */
    creti?: string;
    /** Otri tipo de clasificacion */
    desc_otra_clasificacion: string;
}
