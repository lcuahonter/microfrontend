
/**
 * Modelo que representa una persona CAAT.
 * @interface PersonaCaat
 */
export interface PersonaCaat {
    nombre: string;
    apellidoMaterno: string;
    apellidoPaterno: string;
    correoElectronico: string;
    curp: string;
    razonSocial: string;
    rfc: string;
    nss: string;
    extranjero: boolean;
    moral: boolean;
    descripcionGiro: string;
    calle: string;
    numeroExterior: string;
    numeroInterio: string;
    codigoPostal: string;
    informacionExtra: string;
    ciudad: string;
    clavePais: string;
    nombrePais: string;
    claveEntidad: string;
    nombreEntidad: string;
    claveDelegacionMunicipio: string;
    nombreDelegacionMunicipio: string;
    claveColonia: string;
    nombreColonia: string;
    nombrelocalidad: string;
    folioCaat: string;
    perfilCaat: string;
    fechaInicio: string;
    fechaFin: string;
    idPersonaCaat: number;
    nombreDirector: string;
    directorApellidoMaterno: string;
    directorApellidoPaterno: string;
}
