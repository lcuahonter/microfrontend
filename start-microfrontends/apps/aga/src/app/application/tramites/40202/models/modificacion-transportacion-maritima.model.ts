/**
 * RespuestaCaatTabla: Interface para la respuesta de la tabla de CAAT registrado empresa
 * @interface RespuestaCaatTabla
 */
export interface RespuestaCaatTabla {
    /**
     * Código de respuesta de la API
     * @type {number}
     */
    code: number;

    /**
     * Datos de la tabla de CAAT registrado empresa
     * @type {CAATRegistradoEmpresaForm[]}
     */
    data: CAATRegistradoEmpresaForm[];

    /**
     * Mensaje de respuesta de la API
     * @type {string}
     */
    message: string;
}

/**
 * CAATRegistradoEmpresaForm: Interface para la información de la CAAT registrado empresa
 * @interface CAATRegistradoEmpresaForm
 */
export interface CAATRegistradoEmpresaForm {
    /**
     * RFC de la empresa CAAT
     * @type {string}
     */
    rfc: string;

    /**
     * Nombre o denominación o razón social de la empresa CAAT
     * @type {string}
     */
    nombreDenominacionRazonSocial: string;

    /**
     * Nombre de la empresa CAAT
     * @type {string}
     */
    nombrePFE?: string;

    /**
     * Primer apellido de la empresa CAAT
     * @type {string}
     */
    apellidoPaternoPFE?: string;

    /**
     * Segundo apellido de la empresa CAAT
     * @type {string}
     */
    apellidoMaternoPFE?: string;

    /**
     * Catálogo de CAAT
     * @type {string}
     */
    caat: string;

    /**
     * Inicio de vigencia
     * @type {string}
     */
    inicioVigencia: string;

    /**
     * Fin de vigencia
     * @type {string}
     */
    finVigencia: string;

    /**
     * País de la empresa CAAT
     * @type {string}
     */
    pais: string

    /**
     * Código postal de la empresa CAAT
     * @type {string}
     */
    codigoPostalPFE?: string;

    /**
     * Calle de la empresa CAAT
     * @type {string}
     */
    callePFE?: string;

    /**
     * Número exterior de la empresa CAAT
     * @type {string}
     */
    numeroExteriorPFE?: string;

    /**
     * Número interior de la empresa CAAT
     * @type {string}
     */
    numeroInteriorPFE?: string;

    /**
     * Ciudad de la empresa CAAT
     * @type {string}
     */
    ciudadPFE?: string;

    /**
     * Correo electrónico de la empresa CAAT
     * @type {string}
     */
    correoPFE?: string;

    /**
     * Estado de la empresa CAAT
     * @type {string}
     */
    estadoPFE?: string;
}

/**
 * CandidatoModificarCaatForm: Interface para la información del candidato a modificar CAAT
 */
export interface CandidatoModificarCaatForm {
    /**
     * RFC de la empresa CAAT
     * @type {string}
     */
    rfc: string;

    /**
     * Nombre o denominación o razón social de la empresa CAAT
     * @type {string}
     */
    nombreDenominacionRazonSocial: string;

    /**
     * Nombre de la empresa CAAT
     * @type {string}
     */
    correoElectronico: string;

    /**
     * Domicilio de la empresa CAAT
     * @type {string}
     */
    domicilio: string;

    /**
     * Nombre del director general de la empresa CAAT
     * @type {string}
     */
    nombreDG: string;
}

/**
 * PersonaFisicaExtranjeraForm: Interface para la información de la persona física extranjera
 * @interface PersonaFisicaExtranjeraForm
 */
export interface PersonaFisicaExtranjeraForm {
    /**
     * Nombre de la persona física extranjera
     * @type {string}
     */
    nombrePFE: string;

    /**
     * Primer apellido de la persona física extranjera
     * @type {string}
     */
    apellidoPaternoPFE?: string;

    /**
     * Segundo apellido de la persona física extranjera
     * @type {string}
     */
    apellidoMaternoPFE?: string;

    /**
     * Seguro numero de la persona física extranjera
     * @type {string}
     */
    seguroNumero: string;

    /**
     * Domicilio de la persona física extranjera
     * @type {string}
     */
    domicilioPFE: string;

    /**
     * País de la persona física extranjera
     * @type {number | string}
     */
    paisPFE: number | string;

    /**
     * Estado de la persona física extranjera
     * @type {string}
     */
    estadoPFE: string;

    /**
     * Correo electrónico de la persona física extranjera
     * @type {string}
     */
    correoPFE: string;

    /**
     * Código postal de la persona física extranjera
     * @type {string}
     */
    codigoPostalPFE?: string;

    /**
     * Calle de la persona física extranjera
     * @type {string}
     */
    callePFE?: string;

    /**
     * Número exterior de la persona física extranjera
     * @type {string}
     */
    numeroExteriorPFE?: string;

    /**
     * Número interior de la persona física extranjera
     * @type {string}
     */
    numeroInteriorPFE?: string;

    /**
     * Ciudad de la persona física extranjera
     * @type {string}
     */
    ciudadPFE?: string;

    /**
     * Nombre del director general de la persona física extranjera
     * @type {string}
     */
    nombreDG: string;
}

/**
 * PersonaMoralExtranjeraForm: Interface para la información de la persona moral extranjera
 * @interface PersonaMoralExtranjeraForm
 */
export interface PersonaMoralExtranjeraForm {
    /**
     * Denominación de la persona moral extranjera
     * @type {string}
     */
    denominacionPME: string;

    /**
     * Domicilio de la persona moral extranjera
     * @type {string}
     */
    domicilioPME: string;

    /**
     * País de la persona moral extranjera
     * @type {number | string}
     */
    paisPME: number | string;

    /**
     * Estado de la persona moral extranjera
     * @type {string}
     */
    estadoPME: string;

    /**
     * Código postal de la persona moral extranjera
     * @type {string}
     */
    codigoPostalPME: string;

    /**
     * Nombre del director general de la persona moral extranjera
     * @type {string}
     */
    nombreDG: string;

    /**
     * Correo electrónico de la persona moral extranjera
     * @type {string}
     */
    correoPME: string;

    /**
     * Primer apellido del director general de la persona moral extranjera
     * @type {string}
     */
    apellidoPaternoDG?: string;

    /**
     * Segundo apellido del director general de la persona moral extranjera
     * @type {string}
     */
    apellidoMaternoDG?: string;

    /**
     * Calle de la persona moral extranjera
     * @type {string}
     */
    callePME?: string;

    /**
     * Número exterior de la persona moral extranjera
     * @type {string}
     */
    numeroExteriorPME?: string;

    /**
     * Número interior de la persona moral extranjera
     * @type {string}
     */
    numeroInteriorPME?: string;
}