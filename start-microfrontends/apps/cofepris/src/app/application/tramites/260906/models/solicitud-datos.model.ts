import { Catalogo, CatalogoResponse } from '@libs/shared/data-access-user/src';
import { TablaDatos } from '@libs/shared/data-access-user/src/core/models/260906/detos.model';
import { TableData } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define los datos de una solicitud.
 */
export interface SolicitudDatos {
  /**
   * Fecha de creación de la solicitud.
   */
  fechaCreacion: string;

  /**
   * Nombre de la mercancía asociada a la solicitud.
   */
  mercancia: string;

  /**
   * Cantidad de mercancía.
   */
  cantidad: string;

  /**
   * Nombre del proveedor de la mercancía.
   */
  proovedor: string;

  /**
   * Lista de datos SCIAN (Sistema de Clasificación Industrial de América del Norte).
   */
  SCIANLista: TableData;

  /**
   * Lista opcional de mercancías.
   */
  mercancias?: TableData;
}

/**
 * Interfaz que define las opciones de un radio button.
 */
export interface RadioOptions {
  /**
   * Etiqueta que describe la opción.
   */
  label: string;

  /**
   * Valor asociado a la opción.
   */
  value: string | number;
}

/**
 * Interfaz que define los datos de una solicitud en formato de tabla.
 */
export interface DatosDeSolicitud {
  /**
   * Encabezados de la tabla.
   */
  tablaHeadData: string[];

  /**
   * Filas de datos de la tabla, basadas en la interfaz SolicitudDatos.
   */
  tablaFilaDatos: SolicitudDatos[];

  /**
   * Opciones de radio button asociadas a los datos.
   */
  hacerlosRadioOptions: RadioOptions[];
}

/**
 * Interfaz que define los datos generales de una solicitud.
 */
export interface Solicitud {
  razonSocial: string;
  correoElectronico: string;
  codigoPostal: string;
  estado: number;
  municipio: string;
  localidad: string;
  colonia: string;
  calle: string;
  lada: number;
  telefono: number;
  avisoDeFuncionamiento: string;
  licenciaSanitaria: string;
  liveFreshFrozen: string;
  regimen: number;
  aduana: number;
  hacerlos: string | number;
  rfc: string;
  legalRazonSocial: string;
  apellidoPaterno: string;
  apellidoMeterno: string;
}

/**
 * Constante que define las propiedades relacionadas con la fecha de pago.
 */
export const FECHA_DE_PAGO = {
  /**
   * Nombre de la etiqueta para la fecha de pago.
   */
  labelNombre: 'Fecha de pago',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Indica si el campo está habilitado.
   */
  habilitado: true
};

/**
 * @interface
 * @name RespuestaConsulta
 * @description
 * Interfaz que representa la respuesta de una consulta.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   */
  message: string;
}

/**
 * @interface
 * @name ConsultaDatos
 * @description
 * Contiene los datos obtenidos de una consulta.
 */
export interface ConsultaDatos {
  referencia: string;
  cadenaDependencia: string;
  banco: string;
  llave: string;
  tipoFetch: string;
  importe: string;
  selectedEstado: CatalogoResponse;
  setClave: CatalogoResponse;
  setDescripcion: CatalogoResponse;
  setDespecificarClasificacion: Catalogo;
  Fabricante: TablaDatos[];
  Destinatario: TablaDatos[];
  Proveedor: TablaDatos[];
  Facturador: TablaDatos[];
  tercerosNacionalidad: string;
  tipoPersona: string;
  rfc: string;
  curp: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  denominacionRazonSocial: string;
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
  extranjeroCodigo: string;
  extranjeroEstado: string;
  extranjeroColonia: string;
  estado: string;
  rfcResponsableSanitario: string;
  denominacion: string;
  correo: string;
  tipoOperacionJustificacion: string;
  codigoPostal: string;
  muncipio: string;
  claveScianModal: string;
  claveDescripcionModal: string;
  avisoCheckbox: boolean;
  licenciaSanitaria: string;
  regimen: string;
  aduanasEntradas: string;
  numeroPermiso: string;
  tiempoPrograma: number;
  clasificacion: string;
  especificarClasificacionProducto: string;
  denominacionEspecifica: string;
  denominacionDistintiva: string;
  denominacionComun: string;
  tipoDeProducto: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  cantidadUMT: string;
  UMT: string;
  cantidadUMC: string;
  UMC: string;
  presentacion: string;
  numeroRegistro: string;
  fechaCaducidad: string;
  cumplimiento: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoOperacion: string | number;
  informacionConfidencial: string | number;
  manifesto: boolean;
}
