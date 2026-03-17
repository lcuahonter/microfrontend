/**
 * Representa los datos generales del solicitante.
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
 * Representa el domicilio fiscal del solicitante.
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
 * Agrupa los datos generales y el domicilio fiscal del solicitante.
 */
export interface SolicitanteData {
  datosGenerales: DatosGenerales; // Datos generales del solicitante
  domicilioFiscal: DomicilioFiscal; // Domicilio fiscal del solicitante
}

/**
 * Representa el domicilio del establecimiento relacionado con el trámite.
 */
export interface DomicilioEstablecimiento {
  ideGenerica1: string; // Identificador genérico del establecimiento
  establecimientoRFCResponsableSanitario: string; // RFC del responsable sanitario
  establecimientoRazonSocial: string; // Razón social del establecimiento
  establecimientoCorreoElectronico: string; // Correo electrónico del establecimiento
  establecimientoEstados: string; // Estado del establecimiento
  descripcionMunicipio: string; // Descripción del municipio o alcaldía
  localidad: string; // Localidad del establecimiento
  establishomentoColonias: string; // Colonias del establecimiento
  calle: string; // Calle del establecimiento
  lada: string;// Lada del establecimiento
  telefono: string;// Teléfono del establecimiento
  establecimientoDomicilioCodigoPostal: string;// Código postal del establecimiento
  scian: string; // Código SCIAN del establecimiento
  discriminacionScian: string; // Descripción del código SCIAN    
}

/**
 * Representa los datos relacionados con el código SCIAN.
 */
export interface ScianForm {
  scian: string; // Código SCIAN
  descripcionScian: string; // Descripción del código SCIAN
}

/**
 * Representa los datos de la solicitud.
 */
export interface SolicitudForm {
  ideGenerica1: string; // Identificador genérico de la solicitud
  justificacionId: string;// Justificación de la solicitud
  codigoPostal: string; // Código postal
  estado: string; // Estado
  municipioOAlcaldia: string;// Municipio o alcaldía
  localidad: string;// Localidad
  colonias: string;// Colonias
  calle: string; // Calle
  lada: string; // Lada
  telefono: string; // Teléfono
}

/**
 * Representa los datos específicos del establecimiento en la solicitud.
 */
export interface SolicitudEstablecimientoForm {
  noLicenciaSanitaria: string; // Número de licencia sanitaria
  avisoCheckbox: string; // Checkbox de aviso
  regimen: string; // Régimen del establecimiento
  aduanasEntradas: string; // Aduanas de entrada
  aifaCheckbox: string; // Checkbox relacionado con AIFA
}

/**
 * 
 * Representa los datos relacionados con las mercancías.
 */
export interface FormMercancias {
  clasificacion: string; // Clasificación de la mercancía
  especificarClasificacionProducto: string; // Especificación de la clasificación
  denominacionEspecifica: string; // Denominación específica
  denominacionDistintiva: string; // Denominación distintiva
  denominacionComun: string; // Denominación común
  tipoDeProducto: string; // Tipo de producto
  estadoFisico: string; // Estado físico del producto
  fraccionArancelaria: string; // Fracción arancelaria
  cantidadUMT: string; // Cantidad en UMT
  cantidadUMC: string; // Cantidad en UMC
  UMC: string; // Unidad de medida comercial
  presentacion: string; // Presentación del producto
  numeroRegistro: string; // Número de registro
  fechaCaducidad: string; // Fecha de caducidad
}

/**
 * Agrupa los datos completos de un formulario.
 * */
export interface CompleteForm {
  domicilioEstablecimiento: DomicilioEstablecimiento; // Domicilio del establecimiento
  solicitudEstablecimientoForm: SolicitudEstablecimientoForm; // Datos del establecimiento
  scianForm: ScianForm; // Datos del código SCIAN
  formMercancias: FormMercancias[]; // Lista de mercancías
}

/**
 * Representa los datos relacionados con el pago de derechos.
 * */ 
export interface PagoDeDerechos {
  claveDeReferncia: string; // Clave de referencia del pago
  cadenaDeLaDependencia: string; // Cadena de la dependencia
  banco: string; // Nombre del banco
  llaveDePago: string; // Llave de pago
  fechaDePago: string; // Fecha del pago
  importeDePago: string; // Importe del pago
}

/**
 * 
 * Representa los datos del facturador.
 * */
export interface Facturador {
  tipoPersona: string; // Tipo de persona (física o moral)
  pais: string; // País
  estado: string; // Estado
  codigoPostaloEquivalente: string; // Código postal
  coloniaoEquivalente: string; // Colonia
  calle: string; // Calle
  numeroExterior: string; // Número exterior
  numeroInterior: string; // Número interior
  lada: string; // Lada
  telefono: string; // Teléfono
  correoElectronico: string; // Correo electrónico
}

/**
 * Representa los datos del fabricante.
 * */
export interface Fabricante {
  tercerosNacionalidad: string; // Nacionalidad del tercero
  tipoPersona: string; // Tipo de persona (física o moral)
  nombre: string; // Nombre del fabricante
  primerApellido: string; // Primer apellido
  segundoApellido: string; // Segundo apellido
  pais: string; // País
  extranjeroEstado: string; // Estado en el extranjero
  estadoLocalidad: string; // Estado o localidad
  municipioAlcaldia: string; // Municipio o alcaldía
  localidad: string; // Localidad
  entidadFederativa: string; // Entidad federativa
  codigoPostaloEquivalente: string; // Código postal
  colonia: string; // Colonia
  coloniaoEquivalente: string; // Colonia equivalente
  calle: string; // Calle
  numeroExterior: string; // Número exterior
  numeroInterior: string; // Número interior
  lada: string; // Lada
  telefono: string; // Teléfono
  correoElectronico: string; // Correo electrónico
}

/**
 * 
 * Representa los datos del destinatario.
 * */
export interface Destinatario {
  tipoPersona: string; // Tipo de persona (física o moral)
  pais: string; // País
  estadoLocalidad: string; // Estado o localidad
  municipioAlcaldia: string; // Municipio o alcaldía
  localidad: string; // Localidad
  entidadFederativa: string; // Entidad federativa
  codigoPostaloEquivalente: string; // Código postal
  colonia: string; // Colonia
  coloniaoEquivalente: string; // Colonia equivalente
  calle: string; // Calle
  numeroExterior: string; // Número exterior
  numeroInterior: string; // Número interior
  lada: string; // Lada
  telefono: string; // Teléfono
  correoElectronico: string; // Correo electrónico
}

/**
 * 
 * Representa los datos del proveedor.
 * */
export interface Proveedor {
  tipoPersona: string; // Tipo de persona (física o moral)
  pais: string; // País
  estado: string; // Estado
  codigoPostaloEquivalente: string; // Código postal
  coloniaoEquivalente: string; // Colonia
  calle: string; // Calle
  numeroExterior: string; // Número exterior
  numeroInterior: string; // Número interior
  lada: string; // Lada
  telefono: string; // Teléfono
  correoElectronico: string; // Correo electrónico
}

/**
 *  
 * Agrupa los datos de terceros relacionados.
 * */
export interface TercerosRelacionados {
  facturador: Facturador; // Datos del facturador
  fabricante: Fabricante; // Datos del fabricante
  destinatario: Destinatario; // Datos del destinatario
  proveedor: Proveedor; // Datos del proveedor
}

/**
 * Representa los datos de un paso en el asistente (wizard).
 * Representa los datos de un trámite.
 */
export interface Tramite {
  id: number; // Identificador único del trámite
  folioTramite: string; // Folio o referencia del trámite
  tipoTramite: string; // Tipo de trámite
  estatus: string; // Estatus del trámite
  fechaAltaDeRegistro: string; // Fecha de registro
}

/**
 * Representa la estructura de los datos del formulario en el asistente de modificación de permisos.
 * Este modelo agrupa las diferentes secciones del formulario en un único objeto.
 */


export interface FormData {
  solicitanteData: SolicitanteData | null;
  completeForm: CompleteForm[] | null;
  tercerosRelacionados: TercerosRelacionados[] | null;
  pagoDeDerechos: PagoDeDerechos[] | null;
  tramitesAsociados: Tramite[] | null;
}