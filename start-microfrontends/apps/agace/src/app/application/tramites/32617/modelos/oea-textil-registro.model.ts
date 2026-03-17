/**
 * @interfaz
 * @nombre NumeroEmpleadosTabla
 * @descripción
 * Define la estructura de los datos relacionados con el número de empleados por empresa.
 * Incluye información como denominación social, RFC y el bimestre correspondiente.
 */
export interface NumeroEmpleadosTabla {
  id: number; // Identificador único del vehículo.
  denominacionSocial: string; // Denominación social del vehículo.
  rfc: string; // RFC de la empresa.
  numeroDeEmpleados: number; // Número de empleados registrados.
  bimestre: string; // Bimestre al que corresponde el registro.
}

/**
 * Representa la información del RFC del enlace operativo.
 */
export interface RFCEnlaceOperativo {
  enlaceOperativorfc: string; // RFC del enlace operativo
  denominacionRazonsocial: string;// Denominación o razón social
  domicilio: string;// Domicilio asociado
}

export interface RFCTCEnlaceOperativo {
  rfcTC: string; // RFC del TC
  nombreDenominacionTC: string; // Nombre o denominación del TC
}

/**
 * @interfaz
 * @nombre BuscarRfcResponse
 * @descripción
 * Estructura de respuesta al realizar una búsqueda de RFC.
 * Contiene el código de respuesta, mensaje y los datos parciales del RFC.
 */
export interface BuscarRfcResponse {
  code: number; // Código de respuesta de la operación.
  data: Partial<NumeroEmpleadosTabla>; // Datos parciales relacionados con el RFC.
  message: string; // Mensaje de la respuesta.
}

/**
 * @interfaz
 * @nombre ApiResponse
 * @descripción
 * Define la estructura genérica para las respuestas de una API.
 * Contiene un arreglo de datos del tipo especificado, un código y un mensaje.
 * @template T - Tipo de datos esperado en la respuesta.
 */
export interface ApiResponse<T> {
  code: number; // Código de estado de la operación.
  data: T[]; // Arreglo de datos del tipo especificado.
  message: string; // Mensaje asociado a la respuesta.
}

/**
 * @interfaz
 * @nombre EntidadFederativa
 * @descripción
 * Representa una entidad federativa con su identificador y descripción.
 */
export interface EntidadFederativa {
  id: number; // Identificador único de la entidad federativa.
  descripcion: string; // Nombre o descripción de la entidad federativa.
}

/**
 * @interfaz
 * @nombre InstalacionesInterface
 * @descripción
 * Define la estructura de datos de las instalaciones del solicitante.
 * Incluye dirección, municipio, entidad federativa y registro correspondiente.
 */
export interface InstalacionesInterface {
  entidadFederativa: string; // Entidad federativa donde se ubica la instalación.
  municipio: string; // Municipio o alcaldía correspondiente.
  direccion: string; // Dirección completa de la instalación.
  codigoPostal: string; // Código postal asociado.
  registro: string; // Registro relacionado a la instalación.
}

/**
 * @interfaz
 * @nombre DomiciliosRfcSolicitanteTabla
 * @descripción
 * Define la estructura de los domicilios principales del solicitante.
 * Contiene información sobre ubicación, procesos productivos y otros datos relevantes.
 */
export interface DomiciliosRfcSolicitanteTabla {
  id?: number; // Identificador único del domicilio (opcional).
  InstalacionesPrincipales: string; // Nombre o descripción de la instalación principal.
  tipoInstalacion: string; // Tipo de instalación (e.g. oficina, planta).
  entidadFederativa: string; // Entidad federativa donde se encuentra la instalación.
  municipioAlcaldia: string; // Municipio o alcaldía correspondiente.
  coloniaCalleNumero: string; // Calle, número y colonia del domicilio.
  codigoPostal: string; // Código postal del domicilio.
  registroSESAT: string; // Registro ante el SESAT.
  procesoProductivo: string; // Descripción del proceso productivo realizado.
  acreditaUsoGoceInmueble: string; // Indica si se acredita el uso y goce del inmueble.
  realizaActividadComercioExterior: string; // Indica si realiza comercio exterior.
  reconocimientoMutuoCTPAT: string; // Participación en el programa CTPAT.
  perfilEmpresa: string; // Perfil de la empresa.
}

/**
 * @interfaz
 * @nombre ControlInventariosTabla
 * @descripción
 * Representa los sistemas de control de inventarios utilizados por la empresa.
 * Incluye datos como el nombre del sistema, lugar de radicación y cumplimiento del Anexo 24.
 */
export interface ControlInventariosTabla {
  id: number; // Identificador único del sistema.
  nombreSistema: string; // Nombre del sistema de control de inventarios.
  lugarRadicacion: string; // Lugar donde está radicado el sistema.
  cumpleAnexo24: boolean; // Indica si cumple con el Anexo 24.
}

/**
 * @interfaz
 * @nombre AgregarMiembroEmpresaTabla
 * @descripción
 * Define la estructura de los datos de un miembro de la empresa.
 * Incluye información personal, fiscal y la relación con la empresa.
 */
export interface AgregarMiembroEmpresaTabla {
  id: number; // Identificador único del miembro.
  tipoPersona: string; // Tipo de persona (física o moral).
  nombre: string; // Nombre(s) del miembro.
  nombreColleccion?: string; // Nombre de la colección (opcional).
  apellidoPaterno: string; // Apellido paterno.
  apellidoMaterno: string; // Apellido materno.
  nombreCompleto: string; // Nombre completo concatenado.
  rfc: string; // Registro Federal de Contribuyentes.
  caracter: string; // Carácter del miembro dentro de la empresa.
  nacionalidad: string; // Nacionalidad del miembro.
  obligadoTributarMexico: string; // Indica si está obligado a tributar en México.
  nombreEmpresa: string; // Nombre de la empresa a la que pertenece.
}

/**
 * Representa la información de un transportista en la lista de transportistas.
 */
export interface TransportistasListaInterface {
  enlaceOperativorfc: string; // RFC del enlace operativo del transportista
  denominacionRazonsocial: string; // Denominación o razón social del transportista
  domicilio: string; // Domicilio del transportista
  ccat: string; // Código CAAT del transportista
}
