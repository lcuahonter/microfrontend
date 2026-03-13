/**
 * RespuestaContribuyenteTabla: Interfaz para la respuesta de la tabla de contribuyentes
 * @interface RespuestaContribuyenteTabla
 */
export interface RespuestaContribuyenteTabla {
    /**
     * Código de respuesta de la API
     * @type {number}
     */
    code: number;
  
    /**
     * Datos de la tabla de contribuyentes
     * @type {PersonaFisicaNacionalForm[]}
     */
    data: PersonaFisicaNacionalForm[];
  
    /**
     * Mensaje de respuesta de la API
     * @type {string}
     */
    message: string;
  }
  
  /**
   * PersonaFisicaNacionalForm: Interfaz para la información de la persona física nacional
   * @interface PersonaFisicaNacionalForm
   */
  export interface PersonaFisicaNacionalForm {
    /**
     * Nombre de la persona física nacional
     * @type {string}
     */
    nombrePFN: string;
  
    /**
     * RFC de la persona física nacional
     * @type {string}
     */
    rfcPFN: string;
  
    /**
     * Primer apellido de la persona física nacional
     * @type {string}
     */
    apellidoPaternoPFN?: string;
  
    /**
     * Segundo apellido de la persona física nacional
     * @type {string}
     */
    apellidoMaternoPFN?: string;
  
    /**
     * Pais de la persona física nacional
     * @type {number | string}
     */
    paisPFN: number | string;
  
    /**
     * Código postal de la persona física nacional
     * @type {string}
     */
    codigoPostalPFN: string;
  
    /**
     * Estado de la persona física nacional
     * @type {number | string}
     */
    estadoPFN: number | string;
  
    /**
     * Municipio de la persona física nacional
     * @type {number | string}
     */
    municipioPFN: number | string;
  
    /**
     * Localidad de la persona física nacional
     * @type {string}
     */
    localidadPFN: string;
  
    /**
     * Colonia de la persona física nacional
     * @type {number | string}
     */
    coloniaPFN: number | string;
  
    /**
     * Calle de la persona física nacional
     * @type {string}
     */
    callePFN: string;
  
    /**
     * Número exterior de la persona física nacional
     * @type {string}
     */
    numeroExteriorPFN?: string;
  
    /**
     * Número interior de la persona física nacional
     * @type {string}
     */
    numeroInteriorPFN?: string;
  
    /**
     * Correo electrónico de la persona física nacional
     * @type {string}
     */
    domicilioPFN: string;
  }
  
  /**
   * RespuestaContribuyentePMNTabla: Interfaz para la respuesta de la tabla de contribuyentes PMN
   * @interface RespuestaContribuyentePMNTabla
   */
  export interface RespuestaContribuyentePMNTabla {
    /**
     * Código de respuesta de la API
     * @type {number}
     */
    code: number;
  
    /**
     * Datos de la tabla de contribuyentes PMN
     * @type {PersonaMoralNacionalForm[]}
     */
    data: PersonaMoralNacionalForm[];
  
    /**
     * Mensaje de respuesta de la API
     * @type {string}
     */
    message: string;
  }
  
  /**
   * PersonaMoralNacionalForm: Interfaz para la información de la persona moral nacional
   * @interface PersonaMoralNacionalForm
   */
  export interface PersonaMoralNacionalForm {
    /**
     * RFC de la persona moral nacional
     * @type {string}
     */
    rfcPMN: string;
  
    /**
     * Denominación de la persona moral nacional
     * @type {string}
     */
    denominacionPMN: string;
  
    /**
     * Correo electrónico de la persona moral nacional
     * @type {string}
     */
    correoPMN: string;
  
    /**
     * País de la persona moral nacional
     * @type {number | string}
     */
    paisPMN: number | string;
  
    /**
     * Código postal de la persona moral nacional
     * @type {string}
     */
    codigoPostalPMN?: string;
  
    /**
     * Estado de la persona moral nacional
     * @type {number | string}
     */
    estadoPMN: number | string;
  
    /**
     * Municipio de la persona moral nacional
     * @type {number | string}
     */
    municipioPMN: number | string;
  
    /**
     * Localidad de la persona moral nacional
     * @type {string}
     */
    localidadPMN: string;
  
    /**
     * Colonia de la persona moral nacional
     * @type {number | string}
     */
    coloniaPMN: number | string;
  
    /**
     * Calle de la persona moral nacional
     * @type {string}
     */
    callePMN: string;
  
    /**
     * Número exterior de la persona moral nacional
     * @type {string}
     */
    numeroExteriorPMN?: string;
  
    /**
     * Número interior de la persona moral nacional
     * @type {string}
     */
    numeroInteriorPMN?: string;
  
    /**
     * Nombre del director general de la persona moral nacional
     * @type {string}
     */
    nombreDirectorGeneral?: string;
  
    /**
     * Primer apellido del director general de la persona moral nacional
     * @type {string}
     */
    apellidoPaternoDirectorGeneral?: string;
  
    /**
     * Segundo apellido del director general de la persona moral nacional
     * @type {string}
     */
    apellidoMaternoDirectorGeneral?: string;
  
    /**
     * Domicilio de la persona moral nacional
     * @type {string}
     */
    domicilioPMN: string;
  }
  
  /**
   * PersonaFisicaExtranjeraForm: Interfaz para la información de la persona física extranjera
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
  }
  
  /**
   * PersonaMoralExtranjeraForm: Interfaz para la información de la persona moral extranjera
   * @interface PersonaMoralExtranjeraForm
   */
  export interface PersonaMoralExtranjeraForm {
  /**
   * Ciudad de la persona moral extranjera
   * @type {string}
   */
  ciudadPME?: string;
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
  
  /**
   * RespuestaCaatTabla: Interfaz para la respuesta de la tabla de CAAT registrado empresa
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
   * CAATRegistradoEmpresaForm: Interfaz para la información de la CAAT registrado empresa
   * @interface CAATRegistradoEmpresaForm
   */
  export interface CAATRegistradoEmpresaForm {
    /**
     * RFC de la empresa CAAT
     * @type {string}
     */
    rfc: string;
  
    /**
     * Nombre de la empresa CAAT
     * @type {string}
     */
    nombreDenominacionRazonSocial: string;
  
    /**
     * Catálogo de CAAT
     * @type {string}
     */
    caat: string;
  
    /**
     * Perfil CAAT
     * @type {string}
     */
    perfilCaat: string;
  
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
    pais: string;
  }
  
  /**
   * RespuestaConsulta: Interfaz que representa la respuesta de una consulta
   * @interface RespuestaConsulta
   */
  export interface RespuestaConsulta {
    /**
     * Indica si la consulta fue exitosa
     * @type {boolean}
     */
    success: boolean;
  
    /**
     * Datos resultantes de la consulta
     * @type {ConsultaDatos}
     */
    datos: ConsultaDatos;
  
    /**
     * Mensaje de la respuesta
     * @type {string}
     */
    message: string;
  }
  
  /**
   * ConsultaDatos: Contiene los datos obtenidos de una consulta
   * @interface ConsultaDatos
   */
  export interface ConsultaDatos {
    /**
     * Número de seguro
     * @type {string}
     */
    seguroNumero: string;
  
    /**
     * Nombre de persona física extranjera
     * @type {string}
     */
    nombrePFE: string;
  
    /**
     * Apellido paterno de persona física extranjera
     * @type {string}
     */
    apellidoPaternoPFE: string;
  
    /**
     * Apellido materno de persona física extranjera
     * @type {string}
     */
    apellidoMaternoPFE: string;
  
    /**
     * Correo electrónico de persona física extranjera
     * @type {string}
     */
    correoPFE: string;
  
    /**
     * País de persona física extranjera
     * @type {string}
     */
    paisPFE: string;
  
    /**
     * Código postal de persona física extranjera
     * @type {string}
     */
    codigoPostalPFE: string;
  
    /**
     * Ciudad de persona física extranjera
     * @type {string}
     */
    ciudadPFE: string;
  
    /**
     * Estado de persona física extranjera
     * @type {string}
     */
    estadoPFE: string;
  
    /**
     * Calle de persona física extranjera
     * @type {string}
     */
    callePFE: string;
  
    /**
     * Número exterior de persona física extranjera
     * @type {string}
     */
    numeroExteriorPFE: string;
  
    /**
     * Número interior de persona física extranjera
     * @type {string}
     */
    numeroInteriorPFE: string;
  
    /**
     * Denominación de persona moral extranjera
     * @type {string}
     */
    denominacionPME: string;
  
    /**
     * Correo electrónico de persona moral extranjera
     * @type {string}
     */
    correoPME: string;
  
    /**
     * País de persona moral extranjera
     * @type {string}
     */
    paisPME: string;
  
    /**
     * Código postal de persona moral extranjera
     * @type {string}
     */
    codigoPostalPME: string;
  
    /**
     * Ciudad de persona moral extranjera
     * @type {string}
     */
    ciudadPME: string;
  
    /**
     * Estado de persona moral extranjera
     * @type {string}
     */
    estadoPME: string;
  
    /**
     * Calle de persona moral extranjera
     * @type {string}
     */
    callePME: string;
  
    /**
     * Número exterior de persona moral extranjera
     * @type {string}
     */
    numeroExteriorPME: string;
  
    /**
     * Número interior de persona moral extranjera
     * @type {string}
     */
    numeroInteriorPME: string;
  
    /**
     * Nombre del director general
     * @type {string}
     */
    nombreDG: string;
  
    /**
     * Apellido paterno del director general
     * @type {string}
     */
    apellidoPaternoDG: string;
  
    /**
     * Apellido materno del director general
     * @type {string}
     */
    apellidoMaternoDG: string;
  
    /**
     * Tipo de CAAT aérea
     * @type {string}
     */
    tipoDeCaatAerea: string;
  
    /**
     * Código de identificación de transportación aérea
     * @type {string}
     */
    ideCodTransportacionAerea: string;
  
    /**
     * Código IATA/ICAO
     * @type {string}
     */
    codIataIcao: string;
  
    /**
     * Tabla de personas físicas extranjeras
     * @type {PersonaFisicaExtranjeraForm[]}
     */
    personaFisicaExtranjeraTabla: PersonaFisicaExtranjeraForm[];
  
    /**
     * Tabla de personas morales extranjeras
     * @type {PersonaMoralExtranjeraForm[]}
     */
    personaMoralExtranjeraTabla: PersonaMoralExtranjeraForm[];
  }

  /**
   * CAATSolicitud: Interfaz que representa una solicitud de CAAT
   * @interface CAATSolicitud
   */
  export interface CAATSolicitud{
    /**
     * Identificador único de la solicitud
     * @type {string}
     */
    idSolicitud: string;

    /**
     * Identificador de la persona que realizó la solicitud
     * @type {string}
     */
    idPersonaSolicitud: string;

    /**
     * Identificador genérico de la solicitud
     * @type {string}
     */
    ideGenerica1: string;

    /**
     * Clave del folio CAAT
     * @type {string}
     */
    claveFolioCAAT: string;

    /**
     * Clave del folio CAAT
     * @type {string}
     */
    cveFolioCaat: string;

    /**
     * Descripción del tipo de CAAT
     * @type {string}
     */
    descripcionTipoCaat: string;

    /**
     * Tipo de CAAT aérea
     * @type {string}
     */
    tipoDeCaatAerea: string;

    /**
     * Identificador del código de transportación aérea
     * @type {string}
     */
    ideCodTransportacionAerea: string;

    /**
     * Código IATA/ICAO
     * @type {string}
     */
    codIataIcao: string;

    /**
     * Fecha de inicio de vigencia del CAAT
     * @type {string}
     */
    fechaInicioVigencia: string;

    /**
     * Fecha de fin de vigencia del CAAT
     * @type {string}
     */
    fechaFinVigencia: string;
  }