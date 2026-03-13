export interface SolicitudMaritima {
    id_solcitud: number;
    solicitante: Solicitante;
    transportistas_maritimos: TransportistaMaritimo[];
    fecha_registro: string;
}

/* ========== SOLICITANTE ========== */

export interface Solicitante {
    rfc: string;
}

/* ========== TRANSPORTISTA MARÍTIMO ========== */

export interface TransportistaMaritimo {
    id_persona_solicitud: number;
    persona_moral: boolean;
    boolean_extranjero: boolean;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    rfc: string;
    nss: string;
    correo_electronico: string;
    razon_social: string;
    domicilio_calle: string;
    director_general?: DirectorGeneral;
    domicilio: Domicilio;
}

/* ========== DIRECTOR GENERAL ========== */

export interface DirectorGeneral {
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
}

/* ========== DOMICILIO ========== */

export interface Domicilio {
    calle: string;
    numero_exterior: string;
    numero_interior: string;
    codigo_postal: string;
    ciudad: string;
    informacion_extra: string; // aquí puedes guardar el “estado extranjero”
    pais: string;
    entidad_federativa: string;
    delegacion_municipio: string;
    colonia: string;
}
