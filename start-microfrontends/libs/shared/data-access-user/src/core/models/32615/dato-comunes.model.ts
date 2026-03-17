/**
 * Interfaz que representa la información de mercancías relacionada con el RFC y número de empleados.
 */
export interface MercanciasInfo {
    denominacion_social: string;
    rfc: string;
    numero_de_empleados: string;
    bimestre: string;
}

/**
 * Respuesta estructurada para datos de mercancías, incluye código, datos y mensaje.
 */
export interface RespuestaTabla {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de la tabla NICO.
     */
    data: MercanciasInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
}

/**
 * Interfaz que representa información de instalaciones principales.
 */
export interface InstalacionesPrincipalesTablaInfo {
    instalaciones_principales: string;
    tipo_de_instalacion: string;
    entidad_federativa: string;
    municipio_o_delegacion: string;
    colonia: string;
    codigo_postal: string;
    registro_ante_se_sat: string;
    proceso_productivo: string;
    acredita_el_uso_y_goce_del_inmueble: string;
    realiza_operaciones_de_comercio_exterior: string;
    reconocimiento_mutuo_instalacion_c_tpat: string;
    perfil_de_la_empresa: string;
    perfil_del_recinto_fiscalizado_estrategico: string;
    perfil_del_auto_transportista_terrestre: string;
    perfil_del_transportista_ferroviario: string;
    perfil_del_recinto_fiscalizado: string;
    perfil_de_mensajeria_y_paqueteria: string;
    perfil_almacen_general: string;
}

/**
 * Respuesta estructurada para la tabla de instalaciones principales.
 */
export interface InstalacionesPrincipalesRespuestaTabla {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de instalaciones principales.
     */
    data: InstalacionesPrincipalesTablaInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
}

/**
 * Interfaz que representa información personal de una persona.
 */
export interface PersonasInfo {
    rfc: string; // RFC de la persona
    curp: string; // CURP de la persona
    nombre: string; // Nombre de la persona
    apellidoPaterno: string; // Apellido paterno de la persona
    apellidoMaterno: string; // Apellido materno de la persona
}

/**
 * Respuesta estructurada para la tabla de personas.
 */
export interface PersonaRespuestaTabla {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de personas.
     */
    data: PersonasInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
}

/**
 * Interfaz que representa información de inventarios.
 */
export interface InventariosInfo {
    nombre: string; // Nombre del sistema o datos para su identificación
    lugarRadicacion: string; // Lugar de radicación
    sistemaControlInventarios: string; // Indique, si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.
}

/**
 * Respuesta estructurada para la tabla de inventarios.
 */
export interface InventariosRespuestaTabla {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de inventarios.
     */
    data: InventariosInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
}
