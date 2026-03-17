/**
 * Transportista Model
 */
export interface Transportista {
    //Identificador único de la persona transportista
    idPersonaTransportista: string;
    //Tipo de persona (física o moral)
    tipoPersona: string;
    //Nacionalidad del transportista
    nacionalidad: string;
    //Indica si el transportista es extranjero
    esExtranjero: boolean;
    //Indica si el transportista es nacional
    esNacional: boolean;
    //RFC del transportista
    rfc: string;
    //RFC del transportista extranjero
    rfcExtranjero: string;
    //Nombre del transportista
    nombre: string;
    //Apellido paterno del transportista
    apellidoPaterno: string;
    //Apellido materno del transportista
    apellidoMaterno: string;
    //Denominación o razón social del transportista
    denominacionRazonSocial: string;
    //Tax ID del transportista
    taxId: string;
}