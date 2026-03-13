/**
 * Representa la información de un socio extranjero.
 */
export interface ConsultaSocioExtranjero {
    /** Razón social del socio extranjero (para personas morales) */
    razonSocial: string;
    /** Nombre del socio extranjero (para personas físicas) */
    nombre: string;
    /** Apellido paterno del socio extranjero */
    apellidoPaterno: string;
    /** Apellido materno del socio extranjero */
    apellidoMaterno: string;
    /** País de residencia del socio extranjero */
    pais: string;
    /** Código postal del socio extranjero */
    codigoPostal: string;
    /** Estado o provincia del socio extranjero */
    estado: string;
    /** Calle del domicilio del socio extranjero */
    calle: string;
    /** Número interior del domicilio */
    numeroInterior: string;
    /** Número exterior del domicilio */
    numeroExterior: string;
    /** Número de seguro social del socio extranjero */
    numeroSeguroSocial: string;
    /** Número de identificación fiscal del socio extranjero */
    numeroIdentificacionFiscal: string;
}