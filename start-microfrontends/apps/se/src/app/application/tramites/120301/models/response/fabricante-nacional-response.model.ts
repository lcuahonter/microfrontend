/** FabricanteNacionalRfcResponse */
export interface FabricanteNacionalRfcResponse {
    /** ID de la persona solicitante */
    id_persona_sol: string;
    /** ID de relación de persona solicitante */
    id_persona_persona_sol_r: string;
    /** ID de la solicitud */
    id_solicitud: string;
    /** Nombre del fabricante */
    nombre: string;
    /** Apellido materno del fabricante */
    apellido_materno: string;
    /** Apellido paterno del fabricante */
    apellido_paterno: string;
    /** Razón social del fabricante */
    razon_social: string;
    /** RFC del fabricante */
    rfc: string;
    /** CURP del fabricante */
    curp: string;
    /** Correo electrónico del fabricante */
    correo_electronico: string;
    /** Teléfono del fabricante */
    telefono: string;
    /** Descripción del giro comercial */
    descripcion_giro: string;
    /** Domicilio del fabricante */
    domicilio: Domicilio;
    /** Indica si es persona moral */
    bln_persona_moral: string;
    /** Indica si es extranjero */
    bln_extranjero: string;
    /** Tipo de persona */
    tipo_persona: string;
    /** Tipo de sociedad */
    tipo_sociedad: string;
}

/** Domicilio */
export interface Domicilio {
    /** ID de la dirección solicitante */
    id_direccion_sol: string;
    /** Calle del domicilio */
    calle: string;
    /** Número exterior del domicilio */
    num_exterior: string;
    /** Número interior del domicilio */
    num_interior: string;
    /** Código postal del domicilio */
    cp: string;
    /** Colonia del domicilio */
    colonia: Colonia;
    /** Localidad del domicilio */
    localidad: Localidad;
    /** Delegación o municipio del domicilio */
    delegacion_municipio: string;
    /** Entidad federativa del domicilio */
    entidad_federativa: EntidadFederativa;
    /** País del domicilio */
    pais: Localidad;
}

/** Localidad */
export interface Localidad {
    /** Clave de la localidad */
    clave: string;
    /** Nombre de la localidad */
    nombre: string;
}

export interface Colonia {
    /** Clave de la colonia */
    clave: string;
    /** Nombre de la colonia */
    nombre: string;
}

export interface EntidadFederativa {
    /** Clave de la entidad federativa */
    clave: string;
    /** Nombre de la entidad federativa */
    nombre: string;
}