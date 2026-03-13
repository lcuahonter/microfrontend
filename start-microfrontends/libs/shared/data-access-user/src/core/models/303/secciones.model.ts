/**
 * Representa un agente aduanal o figura relacionada.
 * @property {string} nombres - Nombres del agente.
 * @property {string} segundoApellido - Segundo apellido del agente.
 * @property {string} primerApellido - Primer apellido del agente.
 * @property {string} tipoFigura - Tipo de figura (agente, agencia, apoderado, etc.).
 * @property {string} patenteAutorizacion - Número de patente o autorización.
 * @property {string} se - Identificador de la Secretaría de Economía.
 */
export interface Agente {
    /**
     * Nombres del agente.
     */
    nombres: string;
    /**
     * Segundo apellido del agente.
     */
    segundoApellido: string;
    /**
     * Primer apellido del agente.
     */ 
    primerApellido: string;
    /**
     * Tipo de figura (agente, agencia, apoderado, etc.).
     */
    tipoFigura: string;
    /**
     * Número de patente o autorización.
     */
    patenteAutorizacion: string;
    /**
     * Identificador de la Secretaría de Economía.
     */
    se: string;
}
/**
 * Representa un transportista involucrado en el trámite.
 * @property {string} idPersonaTransportista - Identificador único del transportista.
 * @property {string} tipoPersona - Tipo de persona (física o moral).
 * @property {string} nacionalidad - Nacionalidad del transportista.
 * @property {boolean} esExtranjero - Indica si es extranjero.
 * @property {boolean} esNacional - Indica si es nacional.
 * @property {string} rfc - RFC nacional.
 * @property {string} rfcExtranjero - RFC extranjero.
 * @property {string} nombre - Nombre del transportista.
 * @property {string} transportista - Nombre comercial o razón social.
 * @property {string} taxId - Identificador fiscal internacional.
 * @property {string} denominacionRazonSocial - Denominación o razón social.
 * @property {string} apellidoPaterno - Apellido paterno.
 * @property {string} apellidoMaterno - Apellido materno.
 */
export interface Transportista {
    /**
     * Identificador único del transportista.
     */
    idPersonaTransportista: string;
    /**
     * Tipo de persona (física o moral).
     */
    tipoPersona: string;
    /**
     * Nacionalidad del transportista.
     */
    nacionalidad: string;
    /**
     * Indica si es extranjero.
     */
    esExtranjero: boolean;
    /**
     * Indica si es nacional.
     */
    esNacional: boolean;
    /**
     * RFC nacional.
     */
    rfc: string;
    /**
     * RFC extranjero.
     */
    rfcExtranjero: string;
    /**
     * Nombre del transportista.
     */
    nombre: string;
    /**
     * Nombre comercial o razón social.
     */
    transportista: string;
    /**
     * Identificador fiscal internacional.
     */
    taxId: string;
    /**
     * Denominación o razón social.
     */
    denominacionRazonSocial: string;
    /**
     * Apellido paterno.
     */
    apellidoPaterno: string;
    /**
     * Apellido materno.
     */
    apellidoMaterno: string;
}

/**
 * Representa un miembro relacionado con el trámite (ej. socio, representante).
 * @property {string} tipoPersona - Tipo de persona (física o moral).
 * @property {string} nombre - Nombre del miembro.
 * @property {string} rfc - RFC del miembro.
 * @property {string} caracter - Carácter o rol dentro de la empresa.
 * @property {string} nacionalidad - Nacionalidad del miembro.
 * @property {string} tributar - Régimen fiscal o tipo de tributación.
 * @property {string} nombreEmpresa - Nombre de la empresa asociada.
 */
export interface Miembro {
    /**
     * Tipo de persona (física o moral).
     */
    tipoPersona: string;
    /**
     * Nombre del miembro.
     */
    nombre: string;
    /**
     * RFC del miembro.
     */
    rfc: string;
    /**
     * Carácter o rol dentro de la empresa.
     */
    caracter: string;
    /**
     * Nacionalidad del miembro.
     */
    nacionalidad: string;
    /**
     * Régimen fiscal o tipo de tributación.
     */
    tributar: string;
    /**
     * Nombre de la empresa asociada.
     */
    nombreEmpresa: string;
}

/**
 * Representa un inventario relacionado con el trámite.
 * @property {string} identificacion - Identificador del inventario.
 * @property {string} radicacion - Número o referencia de radicación.
 * @property {boolean} conformeAnexo - Indica si cumple con el anexo correspondiente.
 */
export interface Inventario {
    /**
     * Identificador del inventario.
     */
    identificacion: string;
    /**
     * Número o referencia de radicación.
     */
    radicacion: string;
    /**
     * Indica si cumple con el anexo correspondiente.
     */
    conformeAnexo: boolean;
}
