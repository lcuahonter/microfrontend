/**
 * Modelo de respuesta del servicio de consulta de información del contribuyente por RFC.
 */
export interface IdcResponse {
    codigo: string;
    mensaje: string;
    datos: Datos;
}

/**
 * Los datos generales del contribuyente.
 */
export interface Datos {
    id_persona_sol: number;
    id_persona_persona_sol_r: number;
    id_solicitud: number;
    nombre: string;
    apellido_materno: string;
    apellido_paterno: string;
    razon_social: string;
    rfc: string;
    curp: string;
    correo_electronico: string;
    telefono: string;
    descripcion_giro: string;
    domicilio: Domicilio;
    bln_persona_moral: boolean;
    bln_extranjero: boolean;
    tipo_persona: string;
    tipo_sociedad: string;
}

/**
 * Domicilio del contribuyente.
 */
export interface Domicilio {
    id_direccion_sol: null;
    calle: string;
    num_exterior: string;
    num_interior: string;
    cp: string;
    colonia: Colonia;
    localidad: Colonia;
    delegacion_municipio: Colonia;
    entidad_federativa: Colonia;
    pais: Colonia;
}

/**
 * Colonia del contribuyente.
 */
export interface Colonia {
    clave: string;
    nombre: string;
}
