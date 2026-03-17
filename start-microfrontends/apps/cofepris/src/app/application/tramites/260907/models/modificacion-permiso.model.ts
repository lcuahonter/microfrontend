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
 * @interface DomicilioEstablecimiento
 * @description
 * Representa el domicilio del establecimiento, incluyendo información como RFC,
 * razón social, correo electrónico, estado, municipio, localidad, colonia, calle, y contacto.
 */
export interface DomicilioEstablecimiento {
  ideGenerica1: string;
  establecimientoRFCResponsableSanitario: string;
  establecimientoRazonSocial: string;
  establecimientoCorreoElectronico: string;
  establecimientoEstados: string;
  descripcionMunicipio: string;
  localidad: string;
  establishomentoColonias: string;
  calle: string;
  lada: string;
  telefono: string;
  establecimientoDomicilioCodigoPostal: string;
  scian: string;
}

/**
 * @interface ScianForm
 * @description
 * Representa los datos relacionados con el SCIAN (Sistema de Clasificación Industrial de América del Norte).
 */
export interface ScianForm {
  scian: string;
  descripcionScian: string;
}

/**
 * @interface SolicitudEstablecimientoForm
 * @description
 * Representa los datos de la solicitud del establecimiento, incluyendo licencia sanitaria,
 * régimen y aduanas de entrada.
 */
export interface SolicitudEstablecimientoForm {
  noLicenciaSanitaria: string;
  avisoCheckbox: string;
  regimen: string;
  aduanasEntradas: string;
  aifaCheckbox: string;
}

/**
 * @interface FormMercancias
 * @description
 * Representa los datos relacionados con las mercancías, incluyendo clasificación,
 * denominaciones, tipo de producto, estado físico, fracción arancelaria, y presentación.
 */
export interface FormMercancias {
  clasificacion: string;
  especificarClasificacionProducto: string;
  denominacionEspecifica: string;
  denominacionDistintiva: string;
  denominacionComun: string;
  tipoDeProducto: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  cantidadUMT: string;
  cantidadUMC: string;
  UMC: string;
  presentacion: string;
  numeroRegistro: string;
  fechaCaducidad: string;
}

/**
 * @interface CompleteForm
 * @description
 * Representa un formulario completo que incluye datos del domicilio del establecimiento,
 * SCIAN, solicitud del establecimiento y mercancías.
 */
export interface CompleteForm {
  domicilioEstablecimiento: DomicilioEstablecimiento;
  scianForm: ScianForm;
  solicitudEstablecimientoForm: SolicitudEstablecimientoForm;
  formMercancias: FormMercancias;
}

/**
 * @interface PagoDeDerechos
 * @description
 * Representa los datos relacionados con el pago de derechos, incluyendo clave de referencia,
 * banco, fecha e importe del pago.
 */
export interface PagoDeDerechos {
  claveDeReferncia: string; // Clave de referencia del pago
  cadenaDeLaDependencia: string; // Cadena de la dependencia
  banco: string; // Nombre del banco
  llaveDePago: string; // Llave de pago
  fechaDePago: string; // Fecha del pago
  importeDePago: string; // Importe del pago
}

/**
 * @interface Facturador
 * @description
 * Representa los datos del facturador, incluyendo información personal y de contacto.
 */
export interface Facturador {
  tipoPersona: string;
  pais: string;
  estado: string;
  codigoPostaloEquivalente: string;
  coloniaoEquivalente: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: string;
  correoElectronico: string;
}

/**
 * @interface Fabricante
 * @description
 * Representa los datos del fabricante, incluyendo información personal, ubicación y contacto.
 */
export interface Fabricante {
  tercerosNacionalidad: string;
  tipoPersona: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  pais: string;
  extranjeroEstado: string;
  estadoLocalidad: string;
  municipioAlcaldia: string;
  localidad: string;
  entidadFederativa: string;
  codigoPostaloEquivalente: string;
  colonia: string;
  coloniaoEquivalente: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: string;
  correoElectronico: string;
}

/**
 * @interface Destinatario
 * @description
 * Representa los datos del destinatario, incluyendo información personal, ubicación y contacto.
 */
export interface Destinatario {
  tipoPersona: string;
  pais: string;
  estadoLocalidad: string;
  municipioAlcaldia: string;
  localidad: string;
  entidadFederativa: string;
  codigoPostaloEquivalente: string;
  colonia: string;
  coloniaoEquivalente: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: string;
  correoElectronico: string;
}

/**
 * @interface Proveedor
 * @description
 * Representa los datos del proveedor, incluyendo información personal, ubicación y contacto.
 */
export interface Proveedor {
  tipoPersona: string;
  pais: string;
  estado: string;
  codigoPostaloEquivalente: string;
  coloniaoEquivalente: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: string;
  correoElectronico: string;
}

/**
 * @interface TercerosRelacionados
 * @description
 * Representa los datos de terceros relacionados, incluyendo facturador, fabricante,
 * destinatario y proveedor.
 */
export interface TercerosRelacionados {
  facturador: Facturador;
  fabricante: Fabricante;
  destinatario: Destinatario;
  proveedor: Proveedor;
}

/**
 * @interface Tramite
 * @description
 * Representa los datos de un trámite, incluyendo folio, tipo, estatus y fecha de registro.
 */
export interface Tramite {
  id: number; // Identificador único del trámite
  folioTramite: string; // Folio o número de referencia del trámite
  tipoTramite: string; // Tipo de trámite
  estatus: string; // Estatus del trámite
  fechaAltaDeRegistro: string; // Fecha de registro
}