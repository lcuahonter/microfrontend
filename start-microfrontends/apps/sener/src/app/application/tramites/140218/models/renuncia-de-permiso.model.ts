/**
 * @interface DatosGenerales
 * @description
 * Representa los datos generales del solicitante, incluyendo información personal
 * como CURP, RFC, nombre, apellidos, actividad económica y correo electrónico.
 */
export interface DatosGenerales {
    curp: string; // Clave Única de Registro de Población
    rfc: string; // Registro Federal de Contribuyentes
    nombreRazonSocial: string; // Nombre o razón social
    primerApellido: string; // Primer apellido
    segundoApellido: string; // Segundo apellido
    actEconomica: string; // Actividad económica preponderante
    correo: string; // Correo electrónico
  }
  
  /**
   * @interface DomicilioFiscal
   * @description
   * Representa el domicilio fiscal del solicitante, incluyendo información como país,
   * código postal, entidad federativa, municipio, localidad, colonia, calle, y números de contacto.
   */
  export interface DomicilioFiscal {
    pais: string; // País
    codigoPostal: string; // Código postal
    entidadFederativa: string; // Estado o entidad federativa
    municipio: string; // Municipio o alcaldía
    localidad: string; // Localidad
    colonia: string; // Colonia
    calle: string; // Calle
    nExt: string; // Número exterior
    nInt?: string; // Número interior (opcional)
    lada: string; // Lada
    telefono: string; // Teléfono
  }
  
  /**
   * @interface SolicitanteData
   * @description
   * Representa los datos del solicitante, incluyendo datos generales y domicilio fiscal.
   */
  export interface SolicitanteData {
    datosGenerales: DatosGenerales;
    domicilioFiscal: DomicilioFiscal;
  }

  /**
   * @interface Renuncia
   * @description
   * Representa los datos relacionados con la renuncia de un permiso, incluyendo información
   * como folio del trámite, tipo de solicitud, régimen, clasificación del régimen, periodo de vigencia,
   * unidad de medida, fracción arancelaria, cantidad autorizada, valor autorizado, NICO, descripción del NICO,
   * acotación, fechas del permiso y motivo de la renuncia.
   */
  export interface Renuncia {
      folioTramite: string; // Folio del trámite
      tipoSolicitud: string; // Tipo de solicitud
      regimen: string; // Régimen
      clasificacionRegimen: string; // Clasificación del régimen
      periodoVigencia: string; // Periodo de vigencia
      unidadMedida: string; // Unidad de medida
      fraccionArancelaria: string; // Fracción arancelaria
      cantidadAutorizada: string; // Cantidad autorizada
      valorAutorizado: string; // Valor autorizado
      nico: string; // NICO
      descripcionNico: string; // Descripción del NICO
      acotacion: string; // Acotación
      permisoDesde: string; // Fecha de inicio del permiso
      permisoHasty: string; // Fecha de fin del permiso
      motivoRenuncia: string; // Motivo de la renuncia
  }