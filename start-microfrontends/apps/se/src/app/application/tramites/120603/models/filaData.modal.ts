/**
 * Interfaz que define los datos de selección de sucursal.
 * Contiene las propiedades necesarias para almacenar la información
 * relacionada con la ubicación de una sucursal.
 */
export interface SeleccionDeSucursalData {
    /** Calle de la sucursal */
    calle: string,
    /** Número exterior de la sucursal */
    numeroExterior: number,
    /** Número interior de la sucursal */
    numeroInterior: number,
    /** Código postal de la sucursal */
    codigoPostal: number,
    /** Colonia de la sucursal */
    colonia: string,
    /** Municipio o alcaldía de la sucursal */
    municipioAlcaldia: string,
    /** Estado donde se encuentra la sucursal */
    estado: string,
    /** País donde se encuentra la sucursal */
    pais: string,
    /** Localidad de la sucursal */
    localidad: string,
    /** Lada de la sucursal */
    lada?: number,
    /** Teléfono de contacto de la sucursal */
    telefono: number,
    /** Clave de país */
    cvepais?: string,
    /** Clave de colonia */
    cveColonia?: string,
    /** Clave de entidad */
    cveEntidad?: string
}

/**
 * Interfaz que define los datos de socios y accionistas.
 * Contiene las propiedades necesarias para almacenar la información
 * relacionada con los socios y accionistas de una empresa.
 */
export interface SociosYAccionistasData {
    /** Identificador único */
    id: number,
    /** Calle donde reside el socio o accionista */
    calle: string,
    /** Razón social de la empresa asociada */
    razonSocial: string,
    /** Nombre del socio o accionista */
    nombre: string,
    /** Apellido paterno del socio o accionista */
    apellidoPaterno: string,
    /** Apellido materno del socio o accionista */
    apellidoMaterno: string,
    /** Correo electrónico del socio o accionista */
    correo: string,
     /** idPersona del socio o accionista */
    idRolePersona?:string,
    /** RFC del socio o accionista */
    rfc?: string
}

/**
 * Interfaz que define los datos de socios y accionistas extranjeros.
 * Contiene las propiedades necesarias para almacenar la información
 * relacionada con los socios y accionistas extranjeros de una empresa.
 */
export interface SociosYAccionistasExtranjerosData {
    /** Identificador único */
    id: number
    /** Identificación fiscal (Tax ID) del socio o accionista extranjero */
    taxId: number,
    /** Razón social de la empresa asociada */
    razonSocial: string,
    /** Nombre del socio o accionista extranjero */
    nombre: string,
    /** Apellido paterno del socio o accionista extranjero */
    apellidoPaterno: string,
    /** País relacionado con el socio o accionista extranjero */
    datosPais: string,
    /** Código postal relacionado con el socio o accionista extranjero */
    datosCodigoPostal: number,
    /** Estado relacionado con el socio o accionista extranjero */
    datosEstado: string,
    /** Correo electrónico del socio o accionista extranjero */
    correoElectronico: string
    /** idPersona del socio o accionista extranjero */
    idRolePersona?:string
}
