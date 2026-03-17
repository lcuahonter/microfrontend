/** GuardarSolicitudCompletaRequest */
export interface GuardarSolicitudCompletaRequest {
    /** ID de la solicitud */
    id_solicitud: number;
    /** ID de la asignación */
    id_asignacion: number;
    /** ID de la factura de expedición */
    id_factura_expedicion: number;
    /** Indica si es genérico */
    boolean_generico: boolean;
    /** ID genérico 1 */
    ide_generica_1: string;
    /** Descripción genérica 2 */
    descripcion_generica_2: string;
    /** ID genérico 2 */
    ide_generica_2: string;
    /** Indica si requiere descripción de mercancía */
    requiere_descripcion_mercancia: boolean;
    /** Datos del solicitante */
    solicitante: Solicitante;
    /** Representación federal */
    representacion_federal: RepresentacionFederal;
    /** Datos de expedición */
    expedicion: Expedicion;
    /** Lista de fabricantes */
    fabricantes: Fabricante[];
    /** Instrumento de la solicitud */
    instrumento: Instrumento;
    /** Datos del importador */
    importador: Importador;
}

/** Expedicion */
export interface Expedicion {
    /** ID de expedición */
    id_expedicion: number;
    /** Cantidad de mercancía */
    cantidad: number;
    /** Descripción de la mercancía */
    descripcion_mercancia: string;
}

/** Fabricante */
export interface Fabricante {
    /** ID del fabricante */
    id_fabricante: number;
    /** RFC del fabricante */
    rfc: string;
    /** RFC para extranjero */
    rfc_extranjero: string;
    /** Razón social del fabricante */
    razon_social: string;
    /** Indica si es extranjero */
    es_extranjero: boolean;
    /** Nombre del fabricante */
    nombre: string;
    /** Apellido paterno del fabricante */
    apellido_paterno: string;
    /** Apellido materno del fabricante */
    apellido_materno: string;
    /** Correo electrónico del fabricante */
    correo_electronico: string;
    /** Teléfono del fabricante */
    telefono: string;
    /** Página web del fabricante */
    pagina_web: string;
    /** NSS del fabricante */
    nss: string;
    /** Área del fabricante */
    area: string;
    /** Número de registro del fabricante */
    numero_registro: string;
    /** Domicilio del fabricante */
    domicilio: FabricanteDomicilio;
}

/** FabricanteDomicilio */
export interface FabricanteDomicilio {
    /** Calle del domicilio */
    calle: string;
    /** Número exterior del domicilio */
    numero_exterior: string;
    /** Número interior del domicilio */
    numero_interior: string;
    /** Código postal del domicilio */
    codigo_postal: string;
    /** Nombre de la entidad federativa */
    nombre_entidad_federativa: string;
    /** Nombre del país */
    nombre_pais: string;
}

/** Importador */
export interface Importador {
    /** Razón social del importador */
    razon_social: string;
    /** Domicilio del importador */
    domicilio: ImportadorDomicilio;
}

/** ImportadorDomicilio */
export interface ImportadorDomicilio {
    /** Calle del domicilio */
    calle: string;
    /** Ciudad del domicilio */
    ciudad: string;
    /** Código postal del domicilio */
    codigo_postal: string;
    /** Clave del domicilio */
    cve_pais: string;
}

/** Instrumento */
export interface Instrumento {
    /** ID del mecanismo */
    id_mecanismo: number;
    /** País de origen o destino */
    pais_origen_destino: string;
    /** Clave del país */
    cve_pais: string;
}

/** RepresentacionFederal */
export interface RepresentacionFederal {
    /** Clave de entidad federativa */
    cve_entidad_federativa: string;
    /** Clave de unidad administrativa */
    cve_unidad_administrativa: string;
}

/** Solicitante */
export interface Solicitante {
    /** RFC del solicitante */
    rfc: string;
    /** Número de serie del certificado */
    certificado_serial_number: string;
    /** Nombre del solicitante */
    nombre: string | null;
    /** Indica si es persona moral */
    es_persona_moral: boolean;
}