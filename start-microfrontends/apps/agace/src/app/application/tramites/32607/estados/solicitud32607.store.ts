import { Domicilios } from '../models/solicitud.model';
import { EnlaceOperativo } from '../models/solicitud.model';
import { Injectable } from '@angular/core';
import { NumeroDeEmpleados } from '../models/solicitud.model';
import { SeccionSociosIC } from '../models/solicitud.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define las propiedades relacionadas con listas de datos
 * de empleados, domicilios, socios, y enlaces operativos.
 */
export interface Solicitud32607State {
  /**
   * Identificador único de la persona que realiza la solicitud.
   */
  idPersonaSolicitud: string;

  /**
   * RFC del tercero relacionado con la solicitud.
   */
  rfcTercero: string;

  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Nombre del solicitante.
   */
  nombre: string;

  /**
   * Apellido paterno del solicitante.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del solicitante.
   */
  apellidoMaterno: string;

  /**
   * Teléfono de contacto del solicitante.
   */
  telefono: string;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * RFC del tercero a agregar en el enlace.
   */
  agregarEnlaceRfcTercero: string;

  /**
   * RFC del solicitante a agregar en el enlace.
   */
  agregarEnlaceRfc: string;

  /**
   * Nombre del solicitante a agregar en el enlace.
   */
  agregarEnlaceNombre: string;

  /**
   * Apellido paterno del solicitante a agregar en el enlace.
   */
  agregarEnlaceApellidoPaterno: string;

  /**
   * Apellido materno del solicitante a agregar en el enlace.
   */
  agregarEnlaceApellidoMaterno: string;

  /**
   * Ciudad o estado del solicitante a agregar en el enlace.
   */
  agregarEnlaceCiudadEstado: string;

  /**
   * Cargo del solicitante a agregar en el enlace.
   */
  agregarEnlaceCargo: string;

  /**
   * Teléfono de contacto del solicitante a agregar en el enlace.
   */
  agregarEnlaceTelefono: string;

  /**
   * Correo electrónico del solicitante a agregar en el enlace.
   */
  agregarEnlaceCorreoElectronico: string;

  /**
   * Indica si el solicitante es suplente.
   */
  agregarEnlaceSuplente: boolean;

  /**
   * Valor asociado al código 2089.
   */
  '2089': number | string;

  /**
   * Valor asociado al código 2090.
   */
  '2090': number | string;

  /**
   * Valor asociado al código 2091.
   */
  '2091': number | string;

  /**
   * Valor asociado al código 2042.
   */
  '2042': number | string;

  /**
   * Valor asociado al código 2043.
   */
  '2043': number | string;

  /**
   * Valor asociado al código 2044.
   */
  '2044': number | string;

  /**
   * Fecha de inicio de operaciones de comercio exterior.
   */
  fechaInicioComercio: string;

  /**
   * Fecha de pago asociada a la solicitud.
   */
  fechaPago: string;

  /**
   * Monto total asociado a la solicitud.
   */
  monto: string;

  /**
   * Detalles de las operaciones bancarias relacionadas con la solicitud.
   */
  operacionesBancarias: string;

  /**
   * Llave única de pago asociada a la solicitud.
   */
  llavePago: string;

  /**
   * RFC del transportista relacionado con la solicitud.
   */
  transportistaRFC: string;

  /**
   * RFC del transportista modificado relacionado con la solicitud.
   */
  transportistaRFCModifTrans: string;

  /**
   * Razón social del transportista relacionado con la solicitud.
   */
  transportistaRazonSocial: string;

  /**
   * Domicilio del transportista relacionado con la solicitud.
   */
  transportistaDomicilio: string;

  /**
   * CAAT del transportista relacionado con la solicitud.
   */
  transportistaCaat: string;

  /**
   * Identificador del domicilio del transportista relacionado con la solicitud.
   */
  transportistaIdDomicilio: string;

  /**
   * Identificador del RFC del transportista relacionado con la solicitud.
   */
  transportistaIdRFC: string;

  /**
   * Identificador de la razón social del transportista relacionado con la solicitud.
   */
  transportistaIdRazonSocial: string;

  /**
   * Identificador del CAAT del transportista relacionado con la solicitud.
   */
  transportistaIdCaat: string;

  /**
   * Carácter del miembro en la solicitud.
   */
  miembroCaracterDe: string | number;

  /**
   * Indica si el miembro tiene obligación de tributar en México.
   */
  miembroTributarMexico: number | string;

  /**
   * Nacionalidad del miembro.
   */
  miembroNacionalidad: string | number;

  /**
   * Registro Federal de Contribuyentes (RFC) del miembro.
   */
  miembroRfc: string;

  /**
   * Registro federal del miembro ante autoridades pertinentes.
   */
  miembroRegistroFederal: string;

  /**
   * Nombre completo del miembro.
   */
  miembroNombreCompleto: string;

  /**
   * Tipo de persona muestra en la solicitud.
   */
  miembroTipoPersonaMuestra: string | number;

  /**
   * Nombre del miembro.
   */
  miembroNombre: string;

  /**
   * Apellido paterno del miembro.
   */
  miembroApellidoPaterno: string;

  /**
   * Apellido materno del miembro.
   */
  miembroApellidoMaterno: string;

  /**
   * Nombre de la empresa del miembro.
   */
  miembroNombreEmpresa: string;

  /**
   * RFC de la subcontrata para la búsqueda.
   */
  subcontrataRFCBusqueda: string;

  /**
   * RFC de la subcontrata.
   */
  subcontrataRFC: string;

  /**
   * Razón social de la subcontrata.
   */
  subcontrataRazonSocial: string;

  /**
   * Número de empleados de la subcontrata.
   */
  subcontrataEmpleados: string;

  /**
   * Bimestre en el que se está realizando la subcontratación.
   */
  subcontrataBimestre: number;

  /**
   * Nombre o identificación de las instalaciones principales.
   */
  principales: string | number;

  /**
   * Nombre del municipio donde se encuentra la instalación.
   */
  municipio: string;

  /**
   * Tipo de instalación en la que se encuentra la empresa.
   */
  tipoDeInstalacion: string | number;

  /**
   * Entidad federativa (estado) donde se encuentra ubicada la instalación.
   */
  entidadFederativa: string;

  /**
   * Registro ante la SE/SAT relacionado con la instalación.
   */
  registroSESAT: string;

  /**
   * Descripción de la instalación o domicilio.
   */
  descripcion: string;

  /**
   * Código postal de la ubicación de la instalación.
   */
  codigoPostal: string;

  /**
   * Proceso productivo realizado en la instalación.
   */
  procesoProductivo: string | number;

  /**
   * Indica si la empresa tiene el derecho de uso y goce del inmueble.
   */
  goceDelInmueble: string | number;

  /**
   * Empresa propietaria de la instalación.
   */
  empresa: string | number;

  /**
   * Indica si la instalación realiza operaciones de comercio exterior.
   */
  comercioExterior: string | number;

  /**
   * Indica si existe un reconocimiento mutuo (como C-TPAT) de la instalación.
   */
  mutuo: string | number;

  /**
   * Número de catálogos seleccionados.
   */
  catseleccionados: number;

  /**
   * Número de servicio asociado a la solicitud.
   */
  servicio: number;

  /**
   * Valor asociado con el código 190 (puede ser un número o una cadena).
   */
  '190': string | number;

  /**
   * Valor asociado con el código 191 (puede ser un número o una cadena).
   */
  '191': string | number;

  /**
   * Valor asociado con el código 199 (puede ser un número o una cadena).
   */
  '199': string | number;

  /**
   * Número de empleados relacionados con la solicitud.
   */
  empleados: string;

  /**
   * El bimestre relacionado con la solicitud.
   */
  bimestre: number;

  /**
   * Valor asociado con el código 2034 (puede ser un número o una cadena).
   */
  '2034': string | number;

  /**
   * Valor asociado con el código 236 (puede ser un número o una cadena).
   */
  '236': string | number;

  /**
   * Valor asociado con el código 237 (puede ser un número o una cadena).
   */
  '237': string | number;

  /**
   * Valor asociado con el código 238 (puede ser un número o una cadena).
   */
  '238': string | number;

  /**
   * Valor asociado con el código 239 (puede ser un número o una cadena).
   */
  '239': string | number;

  /**
   * Valor asociado con el código 240 (puede ser un número o una cadena).
   */
  '240': string | number;

  /**
   * Valor asociado con el código 241 (puede ser un número o una cadena).
   */
  '241': string | number;

  /**
   * Valor asociado con el código 243 (puede ser un número o una cadena).
   */
  '243': string | number;

  /**
   * Valor asociado con el código 244 (puede ser un número o una cadena).
   */
  '244': string | number;

  /**
   * Valor asociado con el código 245 (puede ser un número o una cadena).
   */
  '245': string | number;

  /**
   * Indica si se seleccionaron todos los elementos (1 o 0).
   */
  indiqueTodos: number;

  /**
   * Valor asociado con el código 246 (puede ser un número o una cadena).
   */
  '246': string | number;

  /**
   * Primer archivo relacionado con la solicitud.
   */
  file1: string;

  /**
   * Segundo archivo relacionado con la solicitud.
   */
  file2: string;

  /**
   * Valor asociado con el código 247 (puede ser un número o una cadena).
   */
  '247': string | number;

  /**
   * Valor asociado con el código 248 (puede ser un número o una cadena).
   */
  '248': string | number;

  /**
   * Identificación relacionada con la solicitud.
   */
  identificacion: string;

  /**
   * Lugar de radicación donde se procesa la solicitud.
   */
  lugarDeRadicacion: string;

  /**
   * Valor asociado con el código 249 (puede ser un número o una cadena).
   */
  '249': string | number;

  /**
   * Valor asociado con el código 250 (puede ser un número o una cadena).
   */
  '250': string | number;

  /**
   * Valor asociado con el código 251 (puede ser un número o una cadena).
   */
  '251': string | number;

  /**
   * Primer valor de tipo booleano, relacionado con algún tipo de validación o configuración.
   */
  checkbox1: boolean;

  /**
   * Segundo valor de tipo booleano, relacionado con algún tipo de validación o configuración.
   */
  checkbox2: boolean;

  /**
   * Tercer valor de tipo booleano, relacionado con algún tipo de validación o configuración.
   */
  checkbox3: boolean;

  /**
   * Estado actual 2, relacionado con la solicitud.
   */
  actualmente2: string;

  /**
   * Estado actual 1, relacionado con la solicitud.
   */
  actualmente1: string;

  /**
   * Lista de objetos que representan los empleados con su número de empleados.
   */
  numeroDeEmpleadosLista: NumeroDeEmpleados[];

  /**
   * Lista de objetos que contienen información sobre los domicilios de la empresa o entidad.
   */
  domiciliosDatos: Domicilios[];

  /**
   * Lista de objetos que representan las secciones de socios del IC (Índice de Contribuyentes).
   */
  listaSeccionSociosIC: SeccionSociosIC[];

  /**
   * Lista de objetos que contienen los datos relacionados con los enlaces operativos.
   */
  enlaceOperativosLista: EnlaceOperativo[];

  /**
   * ID de la entidad federativa seleccionada.
   */
  entidad: number;

  /**
   * Indicador del campo 301, puede ser numérico o texto.
   */
  '301': number | string;

  /**
   * Número IMMEX ingresado por el usuario.
   */
  numeroIMMEX: string;

  /**
   * Modalidad IMMEX seleccionada o escrita.
   */
  modalidadIMMEX: string;

  /**
   * Indicador del campo 302, puede ser numérico o texto.
   */
  '302': number | string;

  /**
   * Nombre o tipo de rubro de certificación.
   */
  rubroCertificacion: string;

  /**
   * Fecha de fin de vigencia del rubro de certificación (formato texto o ISO).
   */
  fechaFinVigenciaRubro: string;

  /**
   * Número de oficio relacionado con la certificación.
   */
  numeroOficio: string;

  /**
   * Indicador del campo 306, puede ser numérico o texto.
   */
  '306': number | string;

  /**
   * Indicador del campo 307, puede ser numérico o texto.
   */
  '307': number | string;

  /**
   * Indicador del campo 308, puede ser numérico o texto.
   */
  '308': number | string;

  /**
   * Nombre del inventario registrado.
   */
  inventarioNombre: string;

  /**
   * Indica si se incluye el anexo 24 en el inventario.
   */
  inventarioAnexo: boolean;

  /**
   * Lugar de radicación del inventario.
   */
  inventarioLugar: string;
}

/**
 * Crea el estado inicial para `Solicitud32607State`.
 *
 * @returns El estado inicial con valores predeterminados.
 */
export function createInitialSolicitudState(): Solicitud32607State {
  return {
    idPersonaSolicitud: '',
    rfcTercero: '',
    rfc: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    correoElectronico: '',
    agregarEnlaceRfcTercero: '',
    agregarEnlaceRfc: '',
    agregarEnlaceNombre: '',
    agregarEnlaceApellidoPaterno: '',
    agregarEnlaceApellidoMaterno: '',
    agregarEnlaceCiudadEstado: '',
    agregarEnlaceCargo: '',
    agregarEnlaceTelefono: '',
    agregarEnlaceCorreoElectronico: '',
    agregarEnlaceSuplente: false,
    '2089': 0,
    '2090': 0,
    '2091': 0,
    '2042': 0,
    '2043': 0,
    '2044': 0,
    fechaInicioComercio: '',
    fechaPago: '',
    monto: '',
    operacionesBancarias: '',
    llavePago: '',
    transportistaRFC: '',
    transportistaRFCModifTrans: '',
    transportistaRazonSocial: '',
    transportistaDomicilio: '',
    transportistaCaat: '',
    transportistaIdDomicilio: '',
    transportistaIdRFC: '',
    transportistaIdRazonSocial: '',
    transportistaIdCaat: '',
    miembroCaracterDe: '',
    miembroTributarMexico: 0,
    miembroNacionalidad: '',
    miembroRfc: '',
    miembroRegistroFederal: '',
    miembroNombreCompleto: '',
    miembroTipoPersonaMuestra: '',
    miembroNombre: '',
    miembroApellidoPaterno: '',
    miembroApellidoMaterno: '',
    miembroNombreEmpresa: '',
    subcontrataRFCBusqueda: '',
    subcontrataRFC: '',
    subcontrataRazonSocial: '',
    subcontrataEmpleados: '',
    subcontrataBimestre: 0,
    principales: 0,
    municipio: '',
    tipoDeInstalacion: 0,
    entidadFederativa: '',
    registroSESAT: '',
    descripcion: '',
    codigoPostal: '',
    procesoProductivo: 0,
    goceDelInmueble: 0,
    empresa: 0,
    comercioExterior: 0,
    mutuo: 0,
    catseleccionados: 0,
    servicio: 0,
    '190': 0,
    '191': 0,
    '199': 0,
    empleados: '',
    bimestre: 0,
    '2034': 0,
    '236': 0,
    '237': 0,
    '238': 0,
    '239': 0,
    '240': 0,
    '241': 0,
    '243': 0,
    '244': 0,
    '245': 0,
    indiqueTodos: 0,
    '246': 0,
    file1: '',
    file2: '',
    '247': 0,
    '248': 0,
    identificacion: '',
    lugarDeRadicacion: '',
    '249': 0,
    '250': 0,
    '251': 0,
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    actualmente2: '',
    actualmente1: '',
    numeroDeEmpleadosLista: [] as NumeroDeEmpleados[],
    domiciliosDatos: [] as Domicilios[],
    listaSeccionSociosIC: [] as SeccionSociosIC[],
    enlaceOperativosLista: [] as EnlaceOperativo[],
    entidad: 0,
    '301': 0,
    numeroIMMEX: '',
    modalidadIMMEX: '',
    '302': 0,
    rubroCertificacion: '',
    fechaFinVigenciaRubro: '',
    numeroOficio: '',
    '306': 0,
    '307': 0,
    '308': 0,
    inventarioNombre: '',
    inventarioAnexo: false,
    inventarioLugar: '',
  };
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'solicitud32607',
  resettable: true,
})
/** Clase encargada de manejar el estado de 'Solicitud32607' mediante el uso de un store.
 *  Esta clase extiende de la clase 'Store', lo que permite la gestión centralizada del estado.
 */
export class Solicitud32607Store extends Store<Solicitud32607State> {
  /**
   * Constructor que inicializa el estado de la solicitud.
   * Utiliza la función `createInitialSolicitudState` para establecer el estado inicial.
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Actualiza el valor del campo `idPersonaSolicitud` en el estado.
   *
   * @param valor - El nuevo valor para `idPersonaSolicitud`.
   */
  actualizarIdPersonaSolicitud(valor: string): void {
    this.update((state) => ({ ...state, idPersonaSolicitud: valor }));
  }

  /**
   * Actualiza el valor del campo `rfcTercero` en el estado.
   *
   * @param valor - El nuevo valor para `rfcTercero`.
   */
  actualizarRfcTercero(valor: string): void {
    this.update((state) => ({ ...state, rfcTercero: valor }));
  }

  /**
   * Actualiza el valor del campo `rfc` en el estado.
   *
   * @param valor - El nuevo valor para `rfc`.
   */
  actualizarRfc(valor: string): void {
    this.update((state) => ({ ...state, rfc: valor }));
  }

  /**
   * Actualiza el valor del campo `nombre` en el estado.
   *
   * @param valor - El nuevo valor para `nombre`.
   */
  actualizarNombre(valor: string): void {
    this.update((state) => ({ ...state, nombre: valor }));
  }

  /**
   * Actualiza el valor del campo `apellidoPaterno` en el estado.
   *
   * @param valor - El nuevo valor para `apellidoPaterno`.
   */
  actualizarApellidoPaterno(valor: string): void {
    this.update((state) => ({ ...state, apellidoPaterno: valor }));
  }

  /**
   * Actualiza el valor del campo `apellidoMaterno` en el estado.
   *
   * @param valor - El nuevo valor para `apellidoMaterno`.
   */
  actualizarApellidoMaterno(valor: string): void {
    this.update((state) => ({ ...state, apellidoMaterno: valor }));
  }

  /**
   * Actualiza el valor del campo `telefono` en el estado.
   *
   * @param valor - El nuevo valor para `telefono`.
   */
  actualizarTelefono(valor: string): void {
    this.update((state) => ({ ...state, telefono: valor }));
  }

  /**
   * Actualiza el valor del campo `correoElectronico` en el estado.
   *
   * @param valor - El nuevo valor para `correoElectronico`.
   */
  actualizarCorreoElectronico(valor: string): void {
    this.update((state) => ({ ...state, correoElectronico: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceRfcTercero` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceRfcTercero`.
   */
  actualizarEnlaceRfcTercero(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceRfcTercero: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceRfc` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceRfc`.
   */
  actualizarEnlaceRfc(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceRfc: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceNombre` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceNombre`.
   */
  actualizarEnlaceNombre(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceNombre: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceApellidoPaterno` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceApellidoPaterno`.
   */
  actualizarEnlaceApellidoPaterno(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceApellidoPaterno: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceApellidoMaterno` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceApellidoMaterno`.
   */
  actualizarEnlaceApellidoMaterno(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceApellidoMaterno: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceCiudadEstado` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceCiudadEstado`.
   */
  actualizarEnlaceCiudadEstado(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceCiudadEstado: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceCargo` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceCargo`.
   */
  actualizarEnlaceCargo(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceCargo: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceTelefono` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceTelefono`.
   */
  actualizarEnlaceTelefono(valor: string): void {
    this.update((state) => ({ ...state, agregarEnlaceTelefono: valor }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceCorreoElectronico` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceCorreoElectronico`.
   */
  actualizarEnlaceCorreoElectronico(valor: string): void {
    this.update((state) => ({
      ...state,
      agregarEnlaceCorreoElectronico: valor,
    }));
  }

  /**
   * Actualiza el valor del campo `agregarEnlaceSuplente` en el estado.
   *
   * @param valor - El nuevo valor para `agregarEnlaceSuplente`.
   */
  actualizarEnlaceSuplente(valor: boolean): void {
    this.update((state) => ({ ...state, agregarEnlaceSuplente: valor }));
  }

  /**
   * Actualiza el valor del campo `2089` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2089`.
   */
  actualizar2089(valor: number | string): void {
    this.update((state) => ({ ...state, '2089': valor }));
  }

  /**
   * Actualiza el valor del campo `2090` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2090`.
   */
  actualizar2090(valor: number | string): void {
    this.update((state) => ({ ...state, '2090': valor }));
  }

  /**
   * Actualiza el valor del campo `2091` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2091`.
   */
  actualizar2091(valor: number | string): void {
    this.update((state) => ({ ...state, '2091': valor }));
  }

  /**
   * Actualiza el valor del campo `2042` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2042`.
   */
  actualizar2042(valor: number | string): void {
    this.update((state) => ({ ...state, '2042': valor }));
  }

  /**
   * Actualiza el valor del campo `2043` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2043`.
   */
  actualizar2043(valor: number | string): void {
    this.update((state) => ({ ...state, '2043': valor }));
  }

  /**
   * Actualiza el valor del campo `2044` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2044`.
   */
  actualizar2044(valor: number | string): void {
    this.update((state) => ({ ...state, '2044': valor }));
  }

  /**
   * Actualiza el valor del campo `fechaInicioComercio` en el estado.
   *
   * @param valor - El nuevo valor para `fechaInicioComercio`.
   */
  actualizarFechaInicioComercio(valor: string): void {
    this.update((state) => ({ ...state, fechaInicioComercio: valor }));
  }

  /**
   * Actualiza el valor del campo `fechaPago` en el estado.
   *
   * @param valor - El nuevo valor para `fechaPago`.
   */
  actualizarFechaPago(valor: string): void {
    this.update((state) => ({ ...state, fechaPago: valor }));
  }

  /**
   * Actualiza el valor del campo `monto` en el estado.
   *
   * @param valor - El nuevo valor para `monto`.
   */
  actualizarMonto(valor: string): void {
    this.update((state) => ({ ...state, monto: valor }));
  }

  /**
   * Actualiza el valor del campo `operacionesBancarias` en el estado.
   *
   * @param valor - El nuevo valor para `operacionesBancarias`.
   */
  actualizarOperacionesBancarias(valor: string): void {
    this.update((state) => ({ ...state, operacionesBancarias: valor }));
  }

  /**
   * Actualiza el valor del campo `llavePago` en el estado.
   *
   * @param valor - El nuevo valor para `llavePago`.
   */
  actualizarLlavePago(valor: string): void {
    this.update((state) => ({ ...state, llavePago: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaRFC` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaRFC`.
   */
  actualizarTransportistaRFC(valor: string): void {
    this.update((state) => ({ ...state, transportistaRFC: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaRFCModifTrans` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaRFCModifTrans`.
   */
  actualizarTransportistaRFCModifTrans(valor: string): void {
    this.update((state) => ({ ...state, transportistaRFCModifTrans: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaRazonSocial` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaRazonSocial`.
   */
  actualizarTransportistaRazonSocial(valor: string): void {
    this.update((state) => ({ ...state, transportistaRazonSocial: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaDomicilio` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaDomicilio`.
   */
  actualizarTransportistaDomicilio(valor: string): void {
    this.update((state) => ({ ...state, transportistaDomicilio: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaCaat` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaCaat`.
   */
  actualizarTransportistaCaat(valor: string): void {
    this.update((state) => ({ ...state, transportistaCaat: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaIdDomicilio` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaIdDomicilio`.
   */
  actualizarTransportistaIdDomicilio(valor: string): void {
    this.update((state) => ({ ...state, transportistaIdDomicilio: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaIdRFC` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaIdRFC`.
   */
  actualizarTransportistaIdRFC(valor: string): void {
    this.update((state) => ({ ...state, transportistaIdRFC: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaIdRazonSocial` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaIdRazonSocial`.
   */
  actualizarTransportistaIdRazonSocial(valor: string): void {
    this.update((state) => ({ ...state, transportistaIdRazonSocial: valor }));
  }

  /**
   * Actualiza el valor del campo `transportistaIdCaat` en el estado.
   *
   * @param valor - El nuevo valor para `transportistaIdCaat`.
   */
  actualizarTransportistaIdCaat(valor: string): void {
    this.update((state) => ({ ...state, transportistaIdCaat: valor }));
  }

  /**
   * Actualiza el carácter del miembro.
   * @param {string | number} valor - Valor del carácter del miembro.
   */
  actualizarMiembroCaracterDe(valor: string | number): void {
    this.update((state) => ({ ...state, miembroCaracterDe: valor }));
  }

  /**
   * Actualiza la obligación de tributar en México.
   * @param {number | string} valor - Valor de tributar en México.
   */
  actualizarMiembroTributarMexico(valor: number | string): void {
    this.update((state) => ({ ...state, miembroTributarMexico: valor }));
  }

  /**
   * Actualiza la nacionalidad del miembro.
   * @param {string | number} valor - Valor de la nacionalidad.
   */
  actualizarMiembroNacionalidad(valor: string | number): void {
    this.update((state) => ({ ...state, miembroNacionalidad: valor }));
  }

  /**
   * Actualiza el RFC del miembro.
   * @param {string} valor - Valor del RFC.
   */
  actualizarMiembroRFC(valor: string): void {
    this.update((state) => ({ ...state, miembroRfc: valor }));
  }

  /**
   * Actualiza el registro federal del miembro.
   * @param {string} valor - Valor del registro federal.
   */
  actualizarMiembroRegistroFederal(valor: string): void {
    this.update((state) => ({ ...state, miembroRegistroFederal: valor }));
  }

  /**
   * Actualiza el nombre completo del miembro.
   * @param {string} valor - Nombre completo del miembro.
   */
  actualizarMiembroNombreCompleto(valor: string): void {
    this.update((state) => ({ ...state, miembroNombreCompleto: valor }));
  }

  /**
   * Actualiza el tipo de persona muestra del miembro.
   * @param {string | number} valor - Valor del tipo de persona muestra.
   */
  actualizarMiembroTipoPersonaMuestra(valor: string | number): void {
    this.update((state) => ({ ...state, miembroTipoPersonaMuestra: valor }));
  }

  /**
   * Actualiza el nombre del miembro.
   * @param {string} valor - Nombre del miembro.
   */
  actualizarMiembroNombre(valor: string): void {
    this.update((state) => ({ ...state, miembroNombre: valor }));
  }

  /**
   * Actualiza el apellido paterno del miembro.
   * @param {string} valor - Apellido paterno del miembro.
   */
  actualizarMiembroApellidoPaterno(valor: string): void {
    this.update((state) => ({ ...state, miembroApellidoPaterno: valor }));
  }

  /**
   * Actualiza el apellido materno del miembro.
   * @param {string} valor - Apellido materno del miembro.
   */
  actualizarMiembroApellidoMaterno(valor: string): void {
    this.update((state) => ({ ...state, miembroApellidoMaterno: valor }));
  }

  /**
   * Actualiza el nombre de la empresa del miembro.
   * @param {string} valor - Nombre de la empresa.
   */
  actualizarMiembroNombreEmpresa(valor: string): void {
    this.update((state) => ({ ...state, miembroNombreEmpresa: valor }));
  }

  /**
   * Actualiza el valor del campo `subcontrataRFCBusqueda` en el estado.
   *
   * @param valor - El nuevo valor para `subcontrataRFCBusqueda`.
   */
  actualizarSubcontrataRFCBusqueda(valor: string): void {
    this.update((state) => ({ ...state, subcontrataRFCBusqueda: valor }));
  }

  /**
   * Actualiza el valor del campo `subcontrataRFC` en el estado.
   *
   * @param valor - El nuevo valor para `subcontrataRFC`.
   */
  actualizarSubcontrataRFC(valor: string): void {
    this.update((state) => ({ ...state, subcontrataRFC: valor }));
  }

  /**
   * Actualiza el valor del campo `subcontrataRazonSocial` en el estado.
   *
   * @param valor - El nuevo valor para `subcontrataRazonSocial`.
   */
  actualizarSubcontrataRazonSocial(valor: string): void {
    this.update((state) => ({ ...state, subcontrataRazonSocial: valor }));
  }

  /**
   * Actualiza el valor del campo `subcontrataEmpleados` en el estado.
   *
   * @param valor - El nuevo valor para `subcontrataEmpleados`.
   */
  actualizarSubcontrataEmpleados(valor: string): void {
    this.update((state) => ({ ...state, subcontrataEmpleados: valor }));
  }

  /**
   * Actualiza el valor del campo `subcontrataBimestre` en el estado.
   *
   * @param valor - El nuevo valor para `subcontrataBimestre`.
   */
  actualizarSubcontrataBimestre(valor: number): void {
    this.update((state) => ({ ...state, subcontrataBimestre: valor }));
  }

  /**
   * Actualiza el valor del campo `principales` en el estado.
   *
   * @param valor - El nuevo valor para `principales`.
   */
  actualizarPrincipales(valor: string | number): void {
    this.update((state) => ({ ...state, principales: valor }));
  }

  /**
   * Actualiza el valor del campo `municipio` en el estado.
   *
   * @param valor - El nuevo valor para `municipio`.
   */
  actualizarMunicipio(valor: string): void {
    this.update((state) => ({ ...state, municipio: valor }));
  }

  /**
   * Actualiza el valor del campo `tipoDeInstalacion` en el estado.
   *
   * @param valor - El nuevo valor para `tipoDeInstalacion`.
   */
  actualizarTipoDeInstalacion(valor: string | number): void {
    this.update((state) => ({ ...state, tipoDeInstalacion: valor }));
  }

  /**
   * Actualiza el valor del campo `entidadFederativa` en el estado.
   *
   * @param valor - El nuevo valor para `entidadFederativa`.
   */
  actualizarEntidadFederativa(valor: string): void {
    this.update((state) => ({ ...state, entidadFederativa: valor }));
  }

  /**
   * Actualiza el valor del campo `registroSESAT` en el estado.
   *
   * @param valor - El nuevo valor para `registroSESAT`.
   */
  actualizarRegistroSESAT(valor: string): void {
    this.update((state) => ({ ...state, registroSESAT: valor }));
  }

  /**
   * Actualiza el valor del campo `descripcion` en el estado.
   *
   * @param valor - El nuevo valor para `descripcion`.
   */
  actualizarDescripcion(valor: string): void {
    this.update((state) => ({ ...state, descripcion: valor }));
  }

  /**
   * Actualiza el valor del campo `codigoPostal` en el estado.
   *
   * @param valor - El nuevo valor para `codigoPostal`.
   */
  actualizarCodigoPostal(valor: string): void {
    this.update((state) => ({ ...state, codigoPostal: valor }));
  }

  /**
   * Actualiza el valor del campo `procesoProductivo` en el estado.
   *
   * @param valor - El nuevo valor para `procesoProductivo`.
   */
  actualizarProcesoProductivo(valor: string | number): void {
    this.update((state) => ({ ...state, procesoProductivo: valor }));
  }

  /**
   * Actualiza el valor del campo `goceDelInmueble` en el estado.
   *
   * @param valor - El nuevo valor para `goceDelInmueble`.
   */
  actualizarGoceDelInmueble(valor: string | number): void {
    this.update((state) => ({ ...state, goceDelInmueble: valor }));
  }

  /**
   * Actualiza el valor del campo `empresa` en el estado.
   *
   * @param valor - El nuevo valor para `empresa`.
   */
  actualizarEmpresa(valor: string | number): void {
    this.update((state) => ({ ...state, empresa: valor }));
  }

  /**
   * Actualiza el valor del campo `comercioExterior` en el estado.
   *
   * @param valor - El nuevo valor para `comercioExterior`.
   */
  actualizarComercioExterior(valor: string | number): void {
    this.update((state) => ({ ...state, comercioExterior: valor }));
  }

  /**
   * Actualiza el valor del campo `mutuo` en el estado.
   *
   * @param valor - El nuevo valor para `mutuo`.
   */
  actualizarMutuo(valor: string | number): void {
    this.update((state) => ({ ...state, mutuo: valor }));
  }

  /**
   * Actualiza el valor del campo `catseleccionados` en el estado.
   *
   * @param valor - El nuevo valor para `catseleccionados`.
   */
  actualizarCatseleccionados(valor: number): void {
    this.update((state) => ({ ...state, catseleccionados: valor }));
  }

  /**
   * Actualiza el valor del campo `servicio` en el estado.
   *
   * @param valor - El nuevo valor para `servicio`.
   */
  actualizarServicio(valor: number): void {
    this.update((state) => ({ ...state, servicio: valor }));
  }

  /**
   * Actualiza el valor del campo `190` en el estado.
   *
   * @param valor - El nuevo valor para el campo `190`.
   */
  actualizar190(valor: string | number): void {
    this.update((state) => ({ ...state, '190': valor }));
  }

  /**
   * Actualiza el valor del campo `191` en el estado.
   *
   * @param valor - El nuevo valor para el campo `191`.
   */
  actualizar191(valor: string | number): void {
    this.update((state) => ({ ...state, '191': valor }));
  }

  /**
   * Actualiza el valor del campo `199` en el estado.
   *
   * @param valor - El nuevo valor para el campo `199`.
   */
  actualizar199(valor: string | number): void {
    this.update((state) => ({ ...state, '199': valor }));
  }

  /**
   * Actualiza el valor del campo `empleados` en el estado.
   *
   * @param valor - El nuevo valor para `empleados`.
   */
  actualizarEmpleados(valor: string): void {
    this.update((state) => ({ ...state, empleados: valor }));
  }

  /**
   * Actualiza el valor del campo `bimestre` en el estado.
   *
   * @param valor - El nuevo valor para `bimestre`.
   */
  actualizarBimestre(valor: number): void {
    this.update((state) => ({ ...state, bimestre: valor }));
  }

  /**
   * Actualiza el valor del campo `2034` en el estado.
   *
   * @param valor - El nuevo valor para el campo `2034`.
   */
  actualizar2034(valor: string | number): void {
    this.update((state) => ({ ...state, '2034': valor }));
  }

  /**
   * Actualiza el valor del campo `236` en el estado.
   *
   * @param valor - El nuevo valor para el campo `236`.
   */
  actualizar236(valor: string | number): void {
    this.update((state) => ({ ...state, '236': valor }));
  }

  /**
   * Actualiza el valor del campo `237` en el estado.
   *
   * @param valor - El nuevo valor para el campo `237`.
   */
  actualizar237(valor: string | number): void {
    this.update((state) => ({ ...state, '237': valor }));
  }

  /**
   * Actualiza el valor del campo `238` en el estado.
   *
   * @param valor - El nuevo valor para el campo `238`.
   */
  actualizar238(valor: string | number): void {
    this.update((state) => ({ ...state, '238': valor }));
  }

  /**
   * Actualiza el valor del campo `239` en el estado.
   *
   * @param valor - El nuevo valor para el campo `239`.
   */
  actualizar239(valor: string | number): void {
    this.update((state) => ({ ...state, '239': valor }));
  }

  /**
   * Actualiza el valor del campo `240` en el estado.
   *
   * @param valor - El nuevo valor para el campo `240`.
   */
  actualizar240(valor: string | number): void {
    this.update((state) => ({ ...state, '240': valor }));
  }

  /**
   * Actualiza el valor del campo `241` en el estado.
   *
   * @param valor - El nuevo valor para el campo `241`.
   */
  actualizar241(valor: string | number): void {
    this.update((state) => ({ ...state, '241': valor }));
  }

  /**
   * Actualiza el valor del campo `243` en el estado.
   *
   * @param valor - El nuevo valor para el campo `243`.
   */
  actualizar243(valor: string | number): void {
    this.update((state) => ({ ...state, '243': valor }));
  }

  /**
   * Actualiza el valor del campo `244` en el estado.
   *
   * @param valor - El nuevo valor para el campo `244`.
   */
  actualizar244(valor: string | number): void {
    this.update((state) => ({ ...state, '244': valor }));
  }

  /**
   * Actualiza el valor del campo `245` en el estado.
   *
   * @param valor - El nuevo valor para el campo `245`.
   */
  actualizar245(valor: string | number): void {
    this.update((state) => ({ ...state, '245': valor }));
  }

  /**
   * Actualiza el valor del campo `indiqueTodos` en el estado.
   *
   * @param valor - El nuevo valor para `indiqueTodos`.
   */
  actualizarIndiqueTodos(valor: number): void {
    this.update((state) => ({ ...state, indiqueTodos: valor }));
  }

  /**
   * Actualiza el valor del campo `246` en el estado.
   *
   * @param valor - El nuevo valor para el campo `246`.
   */
  actualizar246(valor: string | number): void {
    this.update((state) => ({ ...state, '246': valor }));
  }

  /**
   * Actualiza el valor del campo `file1` en el estado.
   *
   * @param valor - El nuevo valor para `file1`.
   */
  actualizarFile1(valor: string): void {
    this.update((state) => ({ ...state, file1: valor }));
  }

  /**
   * Actualiza el valor del campo `file2` en el estado.
   *
   * @param valor - El nuevo valor para `file2`.
   */
  actualizarFile2(valor: string): void {
    this.update((state) => ({ ...state, file2: valor }));
  }

  /**
   * Actualiza el valor del campo `247` en el estado.
   *
   * @param valor - El nuevo valor para el campo `247`.
   */
  actualizar247(valor: string | number): void {
    this.update((state) => ({ ...state, '247': valor }));
  }

  /**
   * Actualiza el valor del campo `248` en el estado.
   *
   * @param valor - El nuevo valor para el campo `248`.
   */
  actualizar248(valor: string | number): void {
    this.update((state) => ({ ...state, '248': valor }));
  }

  /**
   * Actualiza el valor del campo `identificacion` en el estado.
   *
   * @param valor - El nuevo valor para `identificacion`.
   */
  actualizarIdentificacion(valor: string): void {
    this.update((state) => ({ ...state, identificacion: valor }));
  }

  /**
   * Actualiza el valor del campo `lugarDeRadicacion` en el estado.
   *
   * @param valor - El nuevo valor para `lugarDeRadicacion`.
   */
  actualizarLugarDeRadicacion(valor: string): void {
    this.update((state) => ({ ...state, lugarDeRadicacion: valor }));
  }

  /**
   * Actualiza el valor del campo `249` en el estado.
   *
   * @param valor - El nuevo valor para el campo `249`.
   */
  actualizar249(valor: string | number): void {
    this.update((state) => ({ ...state, '249': valor }));
  }

  /**
   * Actualiza el valor del campo `250` en el estado.
   *
   * @param valor - El nuevo valor para el campo `250`.
   */
  actualizar250(valor: string | number): void {
    this.update((state) => ({ ...state, '250': valor }));
  }

  /**
   * Actualiza el valor del campo `251` en el estado.
   *
   * @param valor - El nuevo valor para el campo `251`.
   */
  actualizar251(valor: string | number): void {
    this.update((state) => ({ ...state, '251': valor }));
  }

  /**
   * Actualiza el valor del campo `checkbox1` en el estado.
   *
   * @param valor - El nuevo valor para `checkbox1`.
   */
  actualizarCheckbox1(valor: boolean): void {
    this.update((state) => ({ ...state, checkbox1: valor }));
  }

  /**
   * Actualiza el valor del campo `checkbox2` en el estado.
   *
   * @param valor - El nuevo valor para `checkbox2`.
   */
  actualizarCheckbox2(valor: boolean): void {
    this.update((state) => ({ ...state, checkbox2: valor }));
  }

  /**
   * Actualiza el valor del campo `checkbox3` en el estado.
   *
   * @param valor - El nuevo valor para `checkbox3`.
   */
  actualizarCheckbox3(valor: boolean): void {
    this.update((state) => ({ ...state, checkbox3: valor }));
  }

  /**
   * Actualiza el valor del campo `actualmente2` en el estado.
   *
   * @param valor - El nuevo valor para `actualmente2`.
   */
  actualizarActualmente2(valor: string): void {
    this.update((state) => ({ ...state, actualmente2: valor }));
  }

  /**
   * Actualiza el valor del campo `actualmente1` en el estado.
   *
   * @param valor - El nuevo valor para `actualmente1`.
   */
  actualizarActualmente1(valor: string): void {
    this.update((state) => ({ ...state, actualmente1: valor }));
  }

  /**
   * Actualiza el valor del campo `numeroDeEmpleadosLista` en el estado.
   *
   * @param valor - El nuevo valor para `numeroDeEmpleadosLista`.
   */
  actualizarNumeroDeEmpleadosLista(valor: NumeroDeEmpleados[]): void {
    this.update((state) => ({ ...state, numeroDeEmpleadosLista: valor }));
  }

  /**
   * Actualiza el valor del campo `domiciliosDatos` en el estado.
   *
   * @param valor - El nuevo valor para `domiciliosDatos`.
   */
  actualizarDomiciliosDatos(valor: Domicilios[]): void {
    this.update((state) => ({ ...state, domiciliosDatos: valor }));
  }

  /**
   * Actualiza el valor del campo `listaSeccionSociosIC` en el estado.
   *
   * @param valor - El nuevo valor para `listaSeccionSociosIC`.
   */
  actualizarListaSeccionSociosIC(valor: SeccionSociosIC[]): void {
    this.update((state) => ({ ...state, listaSeccionSociosIC: valor }));
  }

  /**
   * Actualiza el valor del campo `enlaceOperativosLista` en el estado.
   *
   * @param valor - El nuevo valor para `enlaceOperativosLista`.
   */
  actualizarEnlaceOperativosLista(valor: EnlaceOperativo[]): void {
    this.update((state) => ({ ...state, enlaceOperativosLista: valor }));
  }

  /**
   * Actualiza el valor de la entidad federativa seleccionada.
   * @param valor - ID de la entidad.
   */
  actualizarEntidad(valor: number): void {
    this.update((state) => ({ ...state, entidad: valor }));
  }

  /**
   * Actualiza el campo 301 con un valor numérico o de texto.
   * @param valor - Valor del campo 301.
   */
  actualizar301(valor: number | string): void {
    this.update((state) => ({ ...state, '301': valor }));
  }

  /**
   * Actualiza el número IMMEX proporcionado.
   * @param valor - Número IMMEX como string.
   */
  actualizarNumeroIMMEX(valor: string): void {
    this.update((state) => ({ ...state, numeroIMMEX: valor }));
  }

  /**
   * Actualiza la modalidad IMMEX seleccionada.
   * @param valor - Modalidad IMMEX.
   */
  actualizarModalidadIMMEX(valor: string): void {
    this.update((state) => ({ ...state, modalidadIMMEX: valor }));
  }

  /**
   * Actualiza el campo 302 con un valor numérico o de texto.
   * @param valor - Valor del campo 302.
   */
  actualizar302(valor: number | string): void {
    this.update((state) => ({ ...state, '302': valor }));
  }

  /**
   * Actualiza el rubro de certificación.
   * @param valor - Texto que describe el rubro de certificación.
   */
  actualizarRubroCertificacion(valor: string): void {
    this.update((state) => ({ ...state, rubroCertificacion: valor }));
  }

  /**
   * Actualiza la fecha de fin de vigencia del rubro de certificación.
   * @param valor - Fecha en formato string.
   */
  actualizarFechaFinVigenciaRubro(valor: string): void {
    this.update((state) => ({ ...state, fechaFinVigenciaRubro: valor }));
  }

  /**
   * Actualiza el número de oficio relacionado con la certificación.
   * @param valor - Número de oficio como texto.
   */
  actualizarNumeroOficio(valor: string): void {
    this.update((state) => ({ ...state, numeroOficio: valor }));
  }

  /**
   * Actualiza el campo 306 con un valor numérico o de texto.
   * @param valor - Valor del campo 306.
   */
  actualizar306(valor: number | string): void {
    this.update((state) => ({ ...state, '306': valor }));
  }

  /**
   * Actualiza el campo 307 con un valor numérico o de texto.
   * @param valor - Valor del campo 307.
   */
  actualizar307(valor: number | string): void {
    this.update((state) => ({ ...state, '307': valor }));
  }

  /**
   * Actualiza el campo 308 con un valor numérico o de texto.
   * @param valor - Valor del campo 308.
   */
  actualizar308(valor: number | string): void {
    this.update((state) => ({ ...state, '308': valor }));
  }

  /**
   * Actualiza el nombre del inventario.
   * @param valor - Nombre del inventario como texto.
   */
  actualizarInventarioNombre(valor: string): void {
    this.update((state) => ({ ...state, inventarioNombre: valor }));
  }

  /**
   * Actualiza el valor del campo "anexo 24" del inventario.
   * @param valor - Valor booleano que indica si aplica el anexo.
   */
  actualizarInventarioAnexo(valor: boolean): void {
    this.update((state) => ({ ...state, inventarioAnexo: valor }));
  }

  /**
   * Actualiza el lugar de radicación del inventario.
   * @param valor - Lugar como texto.
   */
  actualizarInventarioLugar(valor: string): void {
    this.update((state) => ({ ...state, inventarioLugar: valor }));
  }

  /**
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
