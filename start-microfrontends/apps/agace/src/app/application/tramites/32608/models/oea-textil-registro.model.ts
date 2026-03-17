/**
 * @interfaz
 * @nombre VehiculosTabla
 * @descripción
 * Define la estructura de los datos de la tabla de vehículos.
 * Contiene información básica sobre los vehículos, como marca, modelo y VIN.
 */
export interface NumeroEmpleadosTabla {
  id: number; // Identificador único del vehículo.
  denominacionSocial: string; // Denominación social del vehículo.
  rfc: string; // Modelo del vehículo.
  numeroDeEmpleados: number; // Número de empleados del vehículo.
  bimestre:string; // Bimestre al que corresponde el registro.
}

/**
 * Interface para la respuesta de búsqueda de RFC
 */
export interface BuscarRfcResponse {
  code: number;
  data: Partial<NumeroEmpleadosTabla>; // Datos de RFC obtenidos.
  message: string;
}

/**
 * Interface para la respuesta de la API
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface ApiResponse<T> {
  code: number;
  data: T[];
  message: string;
}

/**
 * Interface para las entidades federativas
 */
export interface EntidadFederativa {
  id: number;
  descripcion: string;
}

/**
 * Interface para las instalaciones
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface InstalacionesInterface {
    entidadFederativa: string;
    municipio: string;
    direccion: string;
    codigoPostal: string;
    registro: string
}

/**
 * Interface para las instalaciones principales del solicitante.
 * Contiene información detallada sobre los domicilios y actividades productivas.
 */
export interface DomiciliosRfcSolicitanteTabla {
  id?:number;
  InstalacionesPrincipales: string;
  tipoInstalacion: string;
  entidadFederativa: string;
  municipioAlcaldia: string;
  coloniaCalleNumero: string; // Esto estaba mal etiquetado como codigoPostal en la configuración de la tabla
  codigoPostal: string;
  registroSESAT: string;
  procesoProductivo: string;
  acreditaUsoGoceInmueble: string;
  realizaActividadComercioExterior: string;
  reconocimientoMutuoCTPAT: string;
  perfilEmpresa: string;
}

/**
 * Interface para los datos de control de inventarios.
 * Contiene información sobre el sistema, lugar de radicación y cumplimiento del Anexo 24.
 */
export interface ControlInventariosTabla {
  id:number;
  nombreSistema:string;
  lugarRadicacion:string;
  cumpleAnexo24: boolean;
}
/**
 * Interface para los datos de la empresa del grupo.
 * Contiene información sobre el RFC, denominación social, domicilio y fecha de la última operación.
 */

export interface AgregarMiembroEmpresaTabla {
  id:number;
  tipoPersona: string;
  nombre: string;
  nombreColleccion?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  rfc: string;
  caracter: string;
  nacionalidad: string;
  obligadoTributarMexico: string;
  nombreEmpresa: string;
}

/**
 * Representa los detalles de una empresa del grupo.
 *
 * @property rfcEnclaveOperativo - RFC del enclave operativo.
 * @property denominacionRazonsocial - Denominación o razón social de la empresa.
 * @property domicilio - Domicilio de la empresa.
 * @property inputfechaDeLaUltimaOperacion - Fecha de la última operación de la empresa.
 */
export interface EmpresaDelGrupo{
  rfcEnclaveOperativo: string;
  denominacionRazonsocial: string;
  domicilio: string;
  inputfechaDeLaUltimaOperacion: string;
}

/**
 * Representa los detalles de un transportista en la tabla.
 *
 * @property rfcEnclaveOperativo - RFC del enlace operativo del transportista.
 * @property denominacionRazonsocial - Denominación o razón social del transportista.
 * @property domicilio - Domicilio del transportista.
 * @property ccat - Código o identificador único del transportista.
 */
export interface TransportistasTable {
  rfcEnclaveOperativo: string;
  denominacionRazonsocial: string;
  domicilio: string;
  ccat: string;
}
/**
 * Representa la información del RFC del enlace operativo.
 *
 * @property enlaceOperativorfc - El RFC (Registro Federal de Contribuyentes) del enlace operativo.
 * @property denominacionRazonsocial - La denominación o razón social del enlace operativo.
 * @property domicilio - El domicilio del enlace operativo.
 */
export interface RFCEnlaceOperativo {
  enlaceOperativorfc: string;
  denominacionRazonsocial: string;
  domicilio: string;
  
}
/**
 * Representa los detalles de un transportista en la lista.
 *
 * @property enlaceOperativorfc - RFC (Registro Federal de Contribuyentes) del enlace operativo.
 * @property denominacionRazonsocial - Denominación o razón social del transportista.
 * @property domicilio - Domicilio del transportista.
 * @property ccat - Identificador único o código del transportista.
 */
export interface TransportistasListaInterface {
  enlaceOperativorfc: string;
  denominacionRazonsocial: string;
  domicilio: string;
  ccat: string;
}

/**
 * Representa la estructura de respuesta para el proceso de registro OEA textil.
 *
 * @property rubroCertificacion - Código de certificación para el sector textil.
 * @property fechaFinVigenciaRubro - Fecha de finalización de la vigencia de la certificación.
 * @property numeroOficio - Número de oficio oficial asociado con la certificación.
 */export interface RubroTextil {
  rubroCertificacion: string;
  fechaFinVigenciaRubro: string;
  numeroOficio: string;
}