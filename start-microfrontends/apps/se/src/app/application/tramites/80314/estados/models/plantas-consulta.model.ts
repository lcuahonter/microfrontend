 
  /**
   * Interfaz que representa la información de domicilio.
   * 
   * @property {number} [id] - Identificador único del domicilio.
   * @property {string} [calle] - Calle de la dirección.
   * @property {string} [numeroExterior] - Número exterior de la dirección.
   * @property {string} [numeroInterior] - Número interior de la dirección.
   * @property {string} [codigoPostal] - Código postal.
   * @property {string} [localidad] - Localidad del domicilio.
   * @property {string} [colonia] - Colonia del domicilio.
   * @property {string} [delegacionMunicipio] - Delegación o municipio del domicilio.
   * @property {string} [entidadFederativa] - Entidad federativa del domicilio.
   * @property {string} [pais] - País del domicilio.
   * @property {string} [telefono] - Teléfono de contacto asociado al domicilio.
   * @property {string} [idPlanta] - ID de la planta asociada (como cadena de texto).
   * @property {string} [idSolicitud] - ID de la solicitud asociada (opcional).
   * @property {string} [razonSocial] - Razón social asociada al domicilio.
   * @property {'Baja' | 'Activada'} [desEstatus] - Estado descriptivo del domicilio, puede ser 'Baja' o 'Activada'.
   * @property {boolean} [estatus] - Estado booleano del domicilio.
   * @property {string} [rfc] - Registro Federal de Contribuyentes asociado al domicilio.
   */
  export interface DomicilioInfo {
    id?: number;
    calle?: string; // Calle de la dirección
    numeroExterior?: string; // Número exterior de la dirección
    numeroInterior?: string; // Número interior de la dirección
    codigoPostal?: string; // Código postal
    localidad?: string; // Localidad
    colonia?: string; // Colonia
    delegacionMunicipio?: string; // Delegación o municipio
    entidadFederativa?: string; // Entidad federativa
    pais?: string; // País
    telefono?: string; // Teléfono
    idPlanta?: string; // ID de la planta (como cadena de texto)
    idSolicitud?: string; // Opcional, ya que puede estar indefinido (id de la solicitud)
    razonSocial?: string; // Razón social
    desEstatus?: 'Baja' | 'Activada'; // Valor fijo que puede ser 'Baja' o 'Activada'
    estatus?: boolean; // Valor booleano para el estado
    rfc?: string;
  }
  
  /**
   * Interfaz que representa los datos de una entidad complementaria.
   * 
   * @property {string} [rfc] - Registro Federal de Contribuyentes (RFC) de la entidad complementaria. Es opcional.
   * @property {string} [nombre] - Nombre de la entidad complementaria. Es opcional.
   * @property {string} [apellidoPrimer] - Primer apellido de la entidad complementaria. Es opcional.
   * @property {string} [apellidoSegundo] - Segundo apellido de la entidad complementaria. Es opcional.
   */
  export interface Complimentaria {
    rfc?: string;
    nombre?: string;
    apellidoPrimer?: string;
    apellidoSegundo?: string;
  }

  /**
   * Interfaz que representa los datos de los federatarios.
   * 
   * @property {string} [nombre] - Nombre del federatario.
   * @property {string} [apellidoPaterno] - Apellido paterno del federatario.
   * @property {string} [apellidoMaterno] - Apellido materno del federatario.
   * @property {string} [numeroActa] - Número del acta asociada.
   * @property {string} [fetchActa] - Información para obtener el acta.
   * @property {string} [numeroNotaria] - Número de la notaría asociada.
   * @property {string} [municipioDelegacion] - Municipio o delegación del federatario.
   * @property {string} [estado] - Estado donde se encuentra el federatario.
   */
  export interface Federetarios {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    numeroActa?: string;
    fetchActa?: string;
    numeroNotaria?: string;
    municipioDelegacion?: string;
    entidadFederativa?: string;

  }

  /**
   * @interface Operacions
   * @extends Complimentaria
   * @extends Federetarios
   * @extends DomicilioInfo
   * 
   * Representa las operaciones relacionadas con una planta y su información asociada.
   * 
   * @property {string} [razonSocial] - Razón social de la planta.
   * @property {string} [fiscalSolicitante] - Información fiscal del solicitante.
   * @property {string} [rfc] - Registro Federal de Contribuyentes.
   * @property {string} [nombre] - Nombre del solicitante.
   * @property {string} [apellidoPrimer] - Primer apellido del solicitante.
   * @property {string} [apellidoSegundo] - Segundo apellido del solicitante.
   * @property {string} [numeroActa] - Número del acta.
   * @property {string} [fetchActa] - Información relacionada con el acta.
   * @property {string} [numeroNotaria] - Número de la notaría.
   * @property {string} [municipioDelegacion] - Municipio o delegación.
   * @property {string} [estado] - Estado de la ubicación.
   * @property {number} [id] - Identificador único.
   * @property {string} [calle] - Calle de la dirección.
   * @property {string} [numeroExterior] - Número exterior de la dirección.
   * @property {string} [numeroInterior] - Número interior de la dirección.
   * @property {string} [codigoPostal] - Código postal.
   * @property {string} [localidad] - Localidad.
   * @property {string} [colonia] - Colonia.
   * @property {string} [delegacionMunicipio] - Delegación o municipio.
   * @property {string} [entidadFederativa] - Entidad federativa.
   * @property {string} [pais] - País.
   * @property {string} [telefono] - Teléfono de contacto.
   * @property {string} [idPlanta] - ID de la planta (como cadena de texto).
   * @property {string} [idSolicitud] - ID de la solicitud (opcional).
   * @property {'Baja' | 'Activada'} [desEstatus] - Estado descriptivo, puede ser 'Baja' o 'Activada'.
   * @property {boolean} [estatus] - Estado booleano de la planta.
   */
  export interface Operacions extends Complimentaria, Federetarios, DomicilioInfo {
    razonSocial?: string;
    fiscalSolicitante?: string;

    rfc?: string;
    nombre?: string;
    apellidoPrimer?: string;
    apellidoSegundo?: string;

    numeroActa?: string;
    fetchActa?: string;
    numeroNotaria?: string;
    municipioDelegacion?: string;
    estado?: string;

    id?: number;
    calle?: string; // Calle de la dirección
    numeroExterior?: string; // Número exterior de la dirección
    numeroInterior?: string; // Número interior de la dirección
    codigoPostal?: string; // Código postal
    localidad?: string; // Localidad
    colonia?: string; // Colonia
    delegacionMunicipio?: string; // Delegación o municipio
    entidadFederativa?: string; // Entidad federativa
    pais?: string; // País
    telefono?: string; // Teléfono
    idPlanta?: string; // ID de la planta (como cadena de texto)
    idSolicitud?: string; // Opcional, ya que puede estar indefinido (id de la solicitud)
    desEstatus?: 'Baja' | 'Activada'; // Valor fijo que puede ser 'Baja' o 'Activada'
    estatus?: boolean; // Valor booleano para el estado
  }

  /**
   * Representa una bitácora con información sobre modificaciones realizadas.
   *
   * @property {string} tipoModificion - Tipo de modificación realizada.
   * @property {string} fetchModificion - Fecha en la que se realizó la modificación.
   * @property {string} valoresAnteriores - Valores anteriores antes de la modificación.
   * @property {string} valoresNuevos - Nuevos valores después de la modificación.
   */
  export interface Bitacora {
    tipoModificion: string;
    fetchModificion: string;
    valoresAnteriores: string;
    valoresNuevos: string;
  }

  /**
   * Representa un anexo con información relacionada a fracciones arancelarias y valores anteriores.
   *
   * @property {string} [tipoFraccion] - Tipo de fracción asociada al anexo.
   * @property {string} [fraccionArancelariaExportacion] - Fracción arancelaria utilizada para exportación.
   * @property {string} [fraccionArancelariaImportacion] - Fracción arancelaria utilizada para importación.
   * @property {string} [descripcion] - Descripción adicional del anexo.
   * @property {string} [valoresAnteriores] - Valores históricos o anteriores relacionados al anexo.
   */
  export interface Anexo {
    tipoFraccion?: string;
    fraccionArancelariaExportacion?: string;
    fraccionArancelariaImportacion?: string;
    descripcion?: string;
    valoresAnteriores?: string;
  }

  /**
   * Interfaz que representa los datos de modificación.
   * 
   * @interface DatosModificacion
   */
  export interface DatosModificacion {
    /**
     * RFC del solicitante.
     * @type {string}
     */
    rfc: string;

    /**
     * Representación federal asociada.
     * @type {string}
     */
    representacionFederal: string;

    /**
     * Tipo de modalidad de la solicitud.
     * @type {string}
     */
    tipoModalidad: string;

    /**
     * Descripción de la modalidad.
     * @type {string}
     */
    descripcionModalidad: string;

    /**
     * Actividad productiva actual del solicitante.
     * @type {string}
     */
    actividadProductivaActual: string;
  }