import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
/** Tipo de endoso, puede ser cadena o número */
export interface Solicitud31101State {
  /** Tipo de garantía, valor numérico */
  tipoDeGarantia: number | string;

  /** Modalidad de la garantía, valor numérico */
  modalidadDeLaGarantia: number | string;

  /** Tipo de sector, valor en cadena */
  tipoSector: string | number;

  /** Concepto, valor numérico */
  concepto: number | string;

  /**
   * Identificador del concepto productivo seleccionado.
   * Puede ser un número (ID) o una cadena (descripción).
   */
  productivoConcepto: number | string;

  /**
   * Identificador del concepto de servicio seleccionado.
   * Puede ser un número (ID) o una cadena (descripción).
   */
  servicioConcepto: number | string;

  /** Número 3500, valor numérico */
  '3500': number | string;

  /** Número 3501, valor numérico */
  '3501': number | string;

  /** Número 3502, valor numérico */
  '3502': number | string;

  /** RFC de los datos generales */
  datosGeneralesRFC: string;

  /** Número 3503, valor numérico */
  '3503': number | string;

  /** Número 3504, valor numérico */
  '3504': number | string;

  /** Número 3505, valor numérico */
  '3505': number | string;

  /** Número 3506, valor numérico */
  '3506': number | string;

  /** Número 3507, valor numérico */
  '3507': number | string;

  /** Número 3508, valor numérico */
  '3508': number | string;

  /** Número 3509, valor numérico */
  '3509': number | string;

  /** Número 3511, valor numérico */
  '3511': number | string;

  /** Número 3512, valor numérico */
  '3512': number | string;

  /** Número 3513, valor numérico */
  '3513': number | string;

  /** Texto genérico 1, valor en cadena */
  textoGenerico1: string;

  /** Texto genérico 2, valor en cadena */
  textoGenerico2: string;

  /** Número 3514, valor numérico */
  '3514': number | string;

  /** Número 3515, valor numérico */
  '3515': number | string;

  /** Número 3516, valor numérico */
  '3516': number | string;

  /** Texto genérico 3, valor en cadena */
  textoGenerico3: string;

  /** Número 3517, valor numérico */
  '3517': number | string;

  /** Número 3518, valor numérico */
  '3518': number | string;

  /** Número 3519, valor numérico */
  '3519': number | string;

  /** Número 3520, valor numérico */
  '3520': number | string;

  /** Tipo de inversión, valor numérico */
  tipoInversion: number | string;

  /** Cantidad de inversión, valor en cadena */
  cantidadInversion: string;

  /** Descripción de la inversión, valor en cadena */
  descInversion: string;

  /** Número 3521, valor numérico */
  '3521': number | string;

  /** Número 3522, valor numérico */
  '3522': number | string;

  /** Clave de enumeración D0 */
  claveEnumeracionD0: boolean;

  /** Clave de enumeración D1 */
  claveEnumeracionD1: boolean;

  /** Clave de enumeración D2 */
  claveEnumeracionD2: boolean;

  /** Clave de enumeración D3 */
  claveEnumeracionD3: boolean;

  /** Clave de enumeración H */
  claveEnumeracionH: boolean;

  modalidadProgramaImmex: string | number;

  /** Texto genérico 4, valor en cadena */
  textoGenerico4: string;

  /** Texto genérico 5, valor en cadena */
  textoGenerico5: string;

  /** Número 3523, valor numérico */
  '3523': number | string;

  /**
   * Campo genérico '3524', puede ser número o cadena.
   */
  '3524': number | string;

  /**
   * Fecha de fin de vigencia 1.
   */
  fechaFinVigencia1: string;

  /**
   * Número de autorización 1.
   */
  numeroAutorizacion1: string;

  /**
   * Campo genérico '3525', puede ser número o cadena.
   */
  '3525': number | string;

  /**
   * Campo genérico '3526', puede ser número o cadena.
   */
  '3526': number | string;

  /**
   * Fecha de fin de vigencia 2.
   */
  fechaFinVigencia2: string;

  /**
   * Número de autorización 2.
   */
  numeroAutorizacion2: string;

  /**
   * Campo genérico '3527', puede ser número o cadena.
   */
  '3527': number | string;

  /** Número 3528, valor numérico */
  '3528': number | string;

  /** Número 3529, valor numérico */
  '3529': number | string;

  /** Texto genérico 6, valor en cadena */
  textoGenerico6: string;

  /** Texto genérico 7, valor en cadena */
  textoGenerico7: string;

  /** Número 3530, valor numérico */
  '3530': number | string;

  /** Número 3531, valor numérico */
  '3531': number | string;

  /** Texto genérico 9, valor en cadena */
  textoGenerico9: string;

  /** Texto genérico 10, valor numérico */
  textoGenerico10: number | string;

  /** Texto genérico 11, valor numérico */
  textoGenerico11: number | string;

  /** Texto genérico 12, valor numérico */
  textoGenerico12: number | string;

  /** Texto genérico 13, valor numérico */
  textoGenerico13: number | string;

  /** Texto genérico 14, valor numérico */
  textoGenerico14: number | string;

  /** Texto genérico 15, valor numérico */
  textoGenerico15: number | string;

  /** Texto genérico 16, valor numérico */
  textoGenerico16: number | string;

  /** Texto genérico 17, valor numérico */
  textoGenerico17: number | string;

  /** Texto genérico 18, valor numérico */
  textoGenerico18: number | string;

  /** Texto genérico 19, valor numérico */
  textoGenerico19: number | string;

  /** Texto genérico 20, valor numérico */
  textoGenerico20: number | string;

  /** Texto genérico 21, valor numérico */
  textoGenerico21: number | string;

  /** Texto genérico 22, valor numérico */
  textoGenerico22: number | string;

  /** Texto genérico 23, valor numérico */
  textoGenerico23: number | string;

  /** Texto genérico 24, valor numérico */
  textoGenerico24: number | string;

  /** Alerta 2, valor booleano */
  alerta2: boolean;

  /** Póliza de fianza actual, valor numérico */
  polizaDeFianzaActual: number | string;

  /** Número de folio, valor en cadena */
  numeroFolio: string;

  /** RFC de la institución, valor en cadena */
  rfcInstitucion: string;

  /** Fecha de expedición, valor en cadena */
  fechaExpedicion: string;

  /** Fecha de inicio de vigencia no, valor en cadena */
  fechaInicioVigenciaNo: string;

  /** Fecha de fin de vigencia no, valor en cadena */
  fechaFinVigenciaNo: string;

  /** Fecha de inicio de vigencia, valor en cadena */
  fechaInicioVigencia: string;

  /** Fecha de fin de vigencia, valor en cadena */
  fechaFinVigencia: string;

  /** Importe total, valor en cadena */
  importeTotal: string;

  /** Razón social anterior, valor en cadena */
  razonSocialAnterior: string;

  /** Razón social actual, valor en cadena */
  razonSocialActual: string;

  /** RFC, valor en cadena */
  rfc: string;

  /** CURP, valor en cadena */
  curp: string;

  /** Nombre, valor en cadena */
  nombre: string;

  /** Apellido paterno, valor en cadena */
  apellidoPaterno: string;

  /** Apellido materno, valor en cadena */
  apellidoMaterno: string;

  /**
   * @description Carácter del miembro en la solicitud.
   */
  miembroCaracterDe: string | number;

  /**
   * @description Indica si el miembro tiene obligación de tributar en México.
   */
  miembroTributarMexico: number | string;

  /**
   * @description Nacionalidad del miembro.
   */
  miembroNacionalidad: string | number;

  /**
   * @description Registro Federal de Contribuyentes (RFC) del miembro.
   */
  miembroRfc: string;

  /**
   * @description Registro federal del miembro ante autoridades pertinentes.
   */
  miembroRegistroFederal: string;

  /**
   * @description Nombre completo del miembro.
   */
  miembroNombreCompleto: string;

  /**
   * @description Tipo de persona muestra en la solicitud.
   */
  miembroTipoPersonaMuestra: string | number;

  /**
   * @description Nombre del miembro.
   */
  miembroNombre: string;

  /**
   * @description Apellido paterno del miembro.
   */
  miembroApellidoPaterno: string;

  /**
   * @description Apellido materno del miembro.
   */
  miembroApellidoMaterno: string;

  /**
   * @description Nombre de la empresa del miembro.
   */
  miembroNombreEmpresa: string;

  /**
   * @description Entidad federativa correspondiente al miembro.
   */
  entidadFederativa: string | number;

  /** Descripción de las principales instalaciones, puede ser un texto o un número */
  instalacionesPrincipales: string | number;

  /** Nombre del municipio donde se encuentra la instalación */
  municipio: string;

  /** Tipo de instalación representado por un número */
  tipoDeInstalacion: number | string;

  /** Nombre de la entidad federativa donde se ubica */
  federativa: string;

  /** Número de registro en la Secretaría correspondiente */
  registroSE: string;

  /** Descripción detallada de la instalación */
  desceripe: string;

  /** Código postal de la ubicación */
  codigoPostal: string;

  /** Identificador del proceso productivo, puede ser un número o una descripción */
  procesoProductivo: number | string;

  /**
   * Póliza de fianza actual, puede ser número o cadena.
   */
  polizaFianzaActual: string | number;

  /**
   * Folio de la fianza.
   */
  folioFianza: string;

  /**
   * RFC de la institución afianzadora.
   */
  rfcAfianzadora: string;

  /**
   * Fecha de expedición de la fianza.
   */
  fechaExpedicionFianza: string;

  /**
   * Fecha de inicio de vigencia de la fianza.
   */
  fecInicioVigenciaFianza: string;

  /**
   * Fecha de fin de vigencia de la fianza.
   */
  fecFinVigenciaFianza: string;

  /**
   * Importe total de la fianza.
   */
  fianzaImporteTotal: string;
}

/**
 * Función que crea el estado inicial de la solicitud.
 * Esta función devuelve un objeto vacío que representa el estado inicial
 * de la solicitud, el cual puede ser modificado posteriormente.
 *
 * @returns {Solicitud31101State} Estado inicial de la solicitud.
 */
export function createInitialSolicitudState(): Solicitud31101State {
  return {
    tipoDeGarantia: 0,
    modalidadDeLaGarantia: 0,
    tipoSector: '',
    concepto: '',
    productivoConcepto: '',
    servicioConcepto: '',
    '3500': 0,
    '3501': 0,
    '3502': 0,
    datosGeneralesRFC: '',
    '3503': 0,
    '3504': 0,
    '3505': 0,
    '3506': 0,
    '3507': 0,
    '3508': 0,
    '3509': 0,
    '3511': 0,
    '3512': 0,
    '3513': 0,
    textoGenerico1: '',
    textoGenerico2: '',
    '3514': 0,
    '3515': 0,
    '3516': 0,
    textoGenerico3: '',
    '3517': 0,
    '3518': 0,
    '3519': 0,
    '3520': 0,
    tipoInversion: '',
    cantidadInversion: '',
    descInversion: '',
    '3521': 0,
    '3522': 0,
    claveEnumeracionD0: false,
    claveEnumeracionD1: false,
    claveEnumeracionD2: false,
    claveEnumeracionD3: false,
    claveEnumeracionH: false,
    modalidadProgramaImmex: '',
    textoGenerico4: '',
    textoGenerico5: '',
    '3523': 0,
    '3524': 0,
    fechaFinVigencia1: '',
    numeroAutorizacion1: '',
    '3525': 0,
    '3526': 0,
    fechaFinVigencia2: '',
    numeroAutorizacion2: '',
    '3527': 0,
    '3528': 0,
    '3529': 0,
    textoGenerico6: '',
    textoGenerico7: '',
    '3530': 0,
    '3531': 0,
    textoGenerico9: '',
    textoGenerico10: '',
    textoGenerico11: '',
    textoGenerico12: '',
    textoGenerico13: '',
    textoGenerico14: '',
    textoGenerico15: '',
    textoGenerico16: '',
    textoGenerico17: '',
    textoGenerico18: '',
    textoGenerico19: '',
    textoGenerico20: '',
    textoGenerico21: '',
    textoGenerico22: '',
    textoGenerico23: '',
    textoGenerico24: '',
    alerta2: false,
    polizaDeFianzaActual: '',
    numeroFolio: '',
    rfcInstitucion: '',
    fechaExpedicion: '',
    fechaInicioVigenciaNo: '',
    fechaFinVigenciaNo: '',
    fechaInicioVigencia: '',
    fechaFinVigencia: '',
    importeTotal: '',
    razonSocialAnterior: '',
    razonSocialActual: '',
    rfc: '',
    curp: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
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
    entidadFederativa: '',
    instalacionesPrincipales: 0,
    municipio: '',
    tipoDeInstalacion: '',
    federativa: '',
    registroSE: '',
    desceripe: '',
    codigoPostal: '',
    procesoProductivo: 0,
    polizaFianzaActual: '',
    folioFianza: '',
    rfcAfianzadora: '',
    fechaExpedicionFianza: '',
    fecInicioVigenciaFianza: '',
    fecFinVigenciaFianza: '',
    fianzaImporteTotal: '',
  };
}
@Injectable({
  providedIn: 'root', // Este servicio es proporcionado en el nivel raíz de la aplicación
})
@StoreConfig({
  name: 'solicitud31101', // Nombre de la configuración para el store
  resettable: true, // Habilita la opción de restablecer el estado del store
})
export class Solicitud31101Store extends Store<Solicitud31101State> {
  constructor() {
    // Llama al constructor de la clase padre Store con el estado inicial
    super(createInitialSolicitudState());
  }

  /** Actualiza el tipo de garantía en el estado */
  actualizarTipoDeGarantia(tipoDeGarantia: number | string): void {
    this.update((state) => ({ ...state, tipoDeGarantia }));
  }

  /** Actualiza la modalidad de la garantía en el estado */
  actualizarModalidadDeLaGarantia(
    modalidadDeLaGarantia: number | string
  ): void {
    this.update((state) => ({ ...state, modalidadDeLaGarantia }));
  }

  /** Actualiza el tipo de sector en el estado */
  actualizarTipoSector(tipoSector: string | number): void {
    this.update((state) => ({ ...state, tipoSector }));
  }

  /** Actualiza el concepto en el estado */
  actualizarConcepto(concepto: number | string): void {
    this.update((state) => ({ ...state, concepto }));
  }

  /**
 * Actualiza el concepto productivo en el estado global.
 *
 * @param productivoConcepto - Valor del concepto productivo (puede ser un número como ID o una cadena como descripción).
 */
  actualizarProductivoConcepto(productivoConcepto: number | string): void {
    this.update((state) => ({ ...state, productivoConcepto }));
  }

  /**
 * Actualiza el concepto de servicio en el estado global.
 *
 * @param servicioConcepto - Valor del concepto de servicio (puede ser un número como ID o una cadena como descripción).
 */
  actualizarServicioConcepto(servicioConcepto: number | string): void {
    this.update((state) => ({ ...state, servicioConcepto }));
  }

  /** Actualiza el valor de 3500 en el estado */
  actualizar3500(valor: number | string): void {
    this.update((state) => ({ ...state, '3500': valor }));
  }

  /** Actualiza el valor de 3501 en el estado */
  actualizar3501(valor: number | string): void {
    this.update((state) => ({ ...state, '3501': valor }));
  }

  /** Actualiza el valor de 3502 en el estado */
  actualizar3502(valor: number | string): void {
    this.update((state) => ({ ...state, '3502': valor }));
  }

  /** Actualiza los datos generales del RFC en el estado */
  actualizarDatosGeneralesRFC(datosGeneralesRFC: string): void {
    this.update((state) => ({ ...state, datosGeneralesRFC }));
  }

  /** Actualiza el valor de 3503 en el estado */
  actualizar3503(valor: number | string): void {
    this.update((state) => ({ ...state, '3503': valor }));
  }

  /** Actualiza el valor de 3504 en el estado */
  actualizar3504(valor: number | string): void {
    this.update((state) => ({ ...state, '3504': valor }));
  }

  /** Actualiza el valor de 3505 en el estado */
  actualizar3505(valor: number | string): void {
    this.update((state) => ({ ...state, '3505': valor }));
  }

  /** Actualiza el valor de 3506 en el estado */
  actualizar3506(valor: number | string): void {
    this.update((state) => ({ ...state, '3506': valor }));
  }

  /** Actualiza el valor de 3507 en el estado */
  actualizar3507(valor: number | string): void {
    this.update((state) => ({ ...state, '3507': valor }));
  }

  /** Actualiza el valor de 3508 en el estado */
  actualizar3508(valor: number | string): void {
    this.update((state) => ({ ...state, '3508': valor }));
  }

  /** Actualiza el valor de 3509 en el estado */
  actualizar3509(valor: number | string): void {
    this.update((state) => ({ ...state, '3509': valor }));
  }

  /** Actualiza el valor de 3511 en el estado */
  actualizar3511(valor: number | string): void {
    this.update((state) => ({ ...state, '3511': valor }));
  }

  /** Actualiza el valor de 3512 en el estado */
  actualizar3512(valor: number | string): void {
    this.update((state) => ({ ...state, '3512': valor }));
  }

  /** Actualiza el valor de 3513 en el estado */
  actualizar3513(valor: number | string): void {
    this.update((state) => ({ ...state, '3513': valor }));
  }

  /** Actualiza el valor del texto genérico 1 en el estado */
  actualizarTextoGenerico1(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico1: valor }));
  }

  /** Actualiza el valor del texto genérico 2 en el estado */
  actualizarTextoGenerico2(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico2: valor }));
  }

  /** Actualiza el valor de 3514 en el estado */
  actualizar3514(valor: number | string): void {
    this.update((state) => ({ ...state, '3514': valor }));
  }

  /** Actualiza el valor de 3515 en el estado */
  actualizar3515(valor: number | string): void {
    this.update((state) => ({ ...state, '3515': valor }));
  }

  /** Actualiza el valor de 3516 en el estado */
  actualizar3516(valor: number | string): void {
    this.update((state) => ({ ...state, '3516': valor }));
  }

  /** Actualiza el valor del texto genérico 3 en el estado */
  actualizarTextoGenerico3(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico3: valor }));
  }

  /** Actualiza el valor de 3517 en el estado */
  actualizar3517(valor: number | string): void {
    this.update((state) => ({ ...state, '3517': valor }));
  }

  /** Actualiza el valor de 3518 en el estado */
  actualizar3518(valor: number | string): void {
    this.update((state) => ({ ...state, '3518': valor }));
  }

  /** Actualiza el valor de 3519 en el estado */
  actualizar3519(valor: number | string): void {
    this.update((state) => ({ ...state, '3519': valor }));
  }

  /** Actualiza el valor de 3520 en el estado */
  actualizar3520(valor: number | string): void {
    this.update((state) => ({ ...state, '3520': valor }));
  }

  /** Actualiza el tipo de inversión en el estado */
  actualizarTipoInversion(valor: number | string): void {
    this.update((state) => ({ ...state, tipoInversion: valor }));
  }

  /** Actualiza la cantidad de inversión en el estado */
  actualizarCantidadInversion(valor: string): void {
    this.update((state) => ({ ...state, cantidadInversion: valor }));
  }

  /** Actualiza la descripción de la inversión en el estado */
  actualizarDescInversion(valor: string): void {
    this.update((state) => ({ ...state, descInversion: valor }));
  }

  /** Actualiza el valor de 3521 en el estado */
  actualizar3521(valor: number | string): void {
    this.update((state) => ({ ...state, '3521': valor }));
  }

  /** Actualiza el valor de 3522 en el estado */
  actualizar3522(valor: number | string): void {
    this.update((state) => ({ ...state, '3522': valor }));
  }

  /** Actualiza la clave de enumeración D0 en el estado */
  actualizarClaveEnumeracionD0(valor: boolean): void {
    this.update((state) => ({ ...state, claveEnumeracionD0: valor }));
  }

  /** Actualiza la clave de enumeración D1 en el estado */
  actualizarClaveEnumeracionD1(valor: boolean): void {
    this.update((state) => ({ ...state, claveEnumeracionD1: valor }));
  }

  /** Actualiza la clave de enumeración D2 en el estado */
  actualizarClaveEnumeracionD2(valor: boolean): void {
    this.update((state) => ({ ...state, claveEnumeracionD2: valor }));
  }

  /** Actualiza la clave de enumeración D3 en el estado */
  actualizarClaveEnumeracionD3(valor: boolean): void {
    this.update((state) => ({ ...state, claveEnumeracionD3: valor }));
  }

  /** Actualiza la clave de enumeración H en el estado */
  actualizarClaveEnumeracionH(valor: boolean): void {
    this.update((state) => ({ ...state, claveEnumeracionH: valor }));
  }

  actualizarModalidadProgramaImmex(valor: string | number): void {
    this.update((state) => ({ ...state, modalidadProgramaImmex: valor }));
  }

  /** Actualiza el valor del texto genérico 4 en el estado */
  actualizarTextoGenerico4(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico4: valor }));
  }

  /** Actualiza el valor del texto genérico 5 en el estado */
  actualizarTextoGenerico5(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico5: valor }));
  }

  /** Actualiza el valor de 3523 en el estado */
  actualizar3523(valor: number | string): void {
    this.update((state) => ({ ...state, '3523': valor }));
  }

  /**
   * Actualiza el valor del campo '3524'.
   * @param valor Nuevo valor (número o cadena).
   */
  actualizar3524(valor: number | string): void {
    this.update((state) => ({ ...state, '3524': valor }));
  }

  /**
   * Actualiza el valor del campo '3525'.
   * @param valor Nuevo valor (número o cadena).
   */
  actualizar3525(valor: number | string): void {
    this.update((state) => ({ ...state, '3525': valor }));
  }

  /**
   * Actualiza el valor del campo '3526'.
   * @param valor Nuevo valor (número o cadena).
   */
  actualizar3526(valor: number | string): void {
    this.update((state) => ({ ...state, '3526': valor }));
  }

  /**
   * Actualiza el valor del campo '3527'.
   * @param valor Nuevo valor (número o cadena).
   */
  actualizar3527(valor: number | string): void {
    this.update((state) => ({ ...state, '3527': valor }));
  }

  /**
   * Actualiza la fecha de fin de vigencia 1.
   * @param valor Nueva fecha en formato string.
   */
  actualizarFechaFinVigencia1(valor: string): void {
    this.update((state) => ({ ...state, fechaFinVigencia1: valor }));
  }

  /**
   * Actualiza el número de autorización 1.
   * @param valor Nuevo valor de autorización.
   */
  actualizarNumeroAutorizacion1(valor: string): void {
    this.update((state) => ({ ...state, numeroAutorizacion1: valor }));
  }

  /**
   * Actualiza la fecha de fin de vigencia 2.
   * @param valor Nueva fecha en formato string.
   */
  actualizarFechaFinVigencia2(valor: string): void {
    this.update((state) => ({ ...state, fechaFinVigencia2: valor }));
  }

  /**
   * Actualiza el número de autorización 2.
   * @param valor Nuevo valor de autorización.
   */
  actualizarNumeroAutorizacion2(valor: string): void {
    this.update((state) => ({ ...state, numeroAutorizacion2: valor }));
  }

  /** Actualiza el valor de 3528 en el estado */
  actualizar3528(valor: number | string): void {
    this.update((state) => ({ ...state, '3528': valor }));
  }

  /** Actualiza el valor de 3529 en el estado */
  actualizar3529(valor: number | string): void {
    this.update((state) => ({ ...state, '3529': valor }));
  }

  /** Actualiza el valor del texto genérico 6 en el estado */
  actualizarTextoGenerico6(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico6: valor }));
  }

  /** Actualiza el valor del texto genérico 7 en el estado */
  actualizarTextoGenerico7(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico7: valor }));
  }

  /** Actualiza el valor de 3530 en el estado */
  actualizar3530(valor: number | string): void {
    this.update((state) => ({ ...state, '3530': valor }));
  }

  /** Actualiza el valor de 3531 en el estado */
  actualizar3531(valor: number | string): void {
    this.update((state) => ({ ...state, '3531': valor }));
  }

  /** Actualiza el valor del texto genérico 9 en el estado */
  actualizarTextoGenerico9(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico9: valor }));
  }

  /** Actualiza el valor del texto genérico 10 en el estado */
  actualizarTextoGenerico10(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico10: valor }));
  }

  /** Actualiza el valor del texto genérico 11 en el estado */
  actualizarTextoGenerico11(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico11: valor }));
  }

  /** Actualiza el valor del texto genérico 12 en el estado */
  actualizarTextoGenerico12(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico12: valor }));
  }

  /** Actualiza el valor del texto genérico 13 en el estado */
  actualizarTextoGenerico13(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico13: valor }));
  }

  /** Actualiza el valor del texto genérico 14 en el estado */
  actualizarTextoGenerico14(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico14: valor }));
  }

  /** Actualiza el valor del texto genérico 15 en el estado */
  actualizarTextoGenerico15(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico15: valor }));
  }

  /** Actualiza el valor del texto genérico 16 en el estado */
  actualizarTextoGenerico16(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico16: valor }));
  }

  /** Actualiza el valor del texto genérico 17 en el estado */
  actualizarTextoGenerico17(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico17: valor }));
  }

  /** Actualiza el valor del texto genérico 18 en el estado */
  actualizarTextoGenerico18(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico18: valor }));
  }

  /** Actualiza el valor del texto genérico 19 en el estado */
  actualizarTextoGenerico19(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico19: valor }));
  }

  /** Actualiza el valor del texto genérico 20 en el estado */
  actualizarTextoGenerico20(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico20: valor }));
  }

  /** Actualiza el valor del texto genérico 21 en el estado */
  actualizarTextoGenerico21(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico21: valor }));
  }

  /** Actualiza el valor del texto genérico 22 en el estado */
  actualizarTextoGenerico22(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico22: valor }));
  }

  /** Actualiza el valor del texto genérico 23 en el estado */
  actualizarTextoGenerico23(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico23: valor }));
  }

  /** Actualiza el valor del texto genérico 24 en el estado */
  actualizarTextoGenerico24(valor: number | string): void {
    this.update((state) => ({ ...state, textoGenerico24: valor }));
  }

  /** Actualiza el valor de alerta2 en el estado */
  actualizarAlerta2(valor: boolean): void {
    this.update((state) => ({ ...state, alerta2: valor }));
  }

  /** Actualiza el valor de la póliza de fianza actual en el estado */
  actualizarPolizaDeFianzaActual(polizaDeFianzaActual: number | string): void {
    this.update((state) => ({
      ...state,
      polizaDeFianzaActual,
    }));
  }

  /** Actualiza el número de folio en el estado */
  actualizarNumeroFolio(numeroFolio: string): void {
    this.update((state) => ({
      ...state,
      numeroFolio,
    }));
  }

  /** Actualiza el RFC de la institución en el estado */
  actualizarRfcInstitucion(rfcInstitucion: string): void {
    this.update((state) => ({
      ...state,
      rfcInstitucion,
    }));
  }

  /** Actualiza la fecha de expedición en el estado */
  actualizarFechaExpedicion(fechaExpedicion: string): void {
    this.update((state) => ({
      ...state,
      fechaExpedicion,
    }));
  }

  /** Actualiza la fecha de inicio de vigencia no en el estado */
  actualizarFechaInicioVigenciaNo(fechaInicioVigenciaNo: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigenciaNo,
    }));
  }

  /** Actualiza la fecha de fin de vigencia no en el estado */
  actualizarFechaFinVigenciaNo(fechaFinVigenciaNo: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigenciaNo,
    }));
  }

  /** Actualiza la fecha de inicio de vigencia en el estado */
  actualizarFechaInicioVigencia(fechaInicioVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigencia,
    }));
  }

  /** Actualiza la fecha de fin de vigencia en el estado */
  actualizarFechaFinVigencia(fechaFinVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigencia,
    }));
  }

  /** Actualiza el importe total en el estado */
  actualizarImporteTotal(importeTotal: string): void {
    this.update((state) => ({
      ...state,
      importeTotal,
    }));
  }

  /** Actualiza la razón social anterior en el estado */
  actualizarRazonSocialAnterior(razonSocialAnterior: string): void {
    this.update((state) => ({
      ...state,
      razonSocialAnterior,
    }));
  }

  /** Actualiza la razón social actual en el estado */
  actualizarRazonSocialActual(razonSocialActual: string): void {
    this.update((state) => ({
      ...state,
      razonSocialActual,
    }));
  }

  /** Actualiza el RFC en el estado */
  actualizarRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /** Actualiza el CURP en el estado */
  actualizarCurp(curp: string): void {
    this.update((state) => ({
      ...state,
      curp,
    }));
  }

  /** Actualiza el nombre en el estado */
  actualizarNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /** Actualiza el apellido paterno en el estado */
  actualizarApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /** Actualiza el apellido materno en el estado */
  actualizarApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }
  /**
   * @description Actualiza el carácter del miembro.
   * @param {string | number} valor - Valor del carácter del miembro.
   */
  actualizarMiembroCaracterDe(valor: string | number): void {
    this.update((state) => ({ ...state, miembroCaracterDe: valor }));
  }

  /**
   * @description Actualiza la obligación de tributar en México.
   * @param {number | string} valor - Valor de tributar en México.
   */
  actualizarMiembroTributarMexico(valor: number | string): void {
    this.update((state) => ({ ...state, miembroTributarMexico: valor }));
  }

  /**
   * @description Actualiza la nacionalidad del miembro.
   * @param {string | number} valor - Valor de la nacionalidad.
   */
  actualizarMiembroNacionalidad(valor: string | number): void {
    this.update((state) => ({ ...state, miembroNacionalidad: valor }));
  }

  /**
   * @description Actualiza el RFC del miembro.
   * @param {string} valor - Valor del RFC.
   */
  actualizarMiembroRFC(valor: string): void {
    this.update((state) => ({ ...state, miembroRfc: valor }));
  }

  /**
   * @description Actualiza el registro federal del miembro.
   * @param {string} valor - Valor del registro federal.
   */
  actualizarMiembroRegistroFederal(valor: string): void {
    this.update((state) => ({ ...state, miembroRegistroFederal: valor }));
  }

  /**
   * @description Actualiza el nombre completo del miembro.
   * @param {string} valor - Nombre completo del miembro.
   */
  actualizarMiembroNombreCompleto(valor: string): void {
    this.update((state) => ({ ...state, miembroNombreCompleto: valor }));
  }

  /**
   * @description Actualiza el tipo de persona muestra del miembro.
   * @param {string | number} valor - Valor del tipo de persona muestra.
   */
  actualizarMiembroTipoPersonaMuestra(valor: string | number): void {
    this.update((state) => ({ ...state, miembroTipoPersonaMuestra: valor }));
  }

  /**
   * @description Actualiza el nombre del miembro.
   * @param {string} valor - Nombre del miembro.
   */
  actualizarMiembroNombre(valor: string): void {
    this.update((state) => ({ ...state, miembroNombre: valor }));
  }

  /**
   * @description Actualiza el apellido paterno del miembro.
   * @param {string} valor - Apellido paterno del miembro.
   */
  actualizarMiembroApellidoPaterno(valor: string): void {
    this.update((state) => ({ ...state, miembroApellidoPaterno: valor }));
  }

  /**
   * @description Actualiza el apellido materno del miembro.
   * @param {string} valor - Apellido materno del miembro.
   */
  actualizarMiembroApellidoMaterno(valor: string): void {
    this.update((state) => ({ ...state, miembroApellidoMaterno: valor }));
  }

  /**
   * @description Actualiza el nombre de la empresa del miembro.
   * @param {string} valor - Nombre de la empresa.
   */
  actualizarMiembroNombreEmpresa(valor: string): void {
    this.update((state) => ({ ...state, miembroNombreEmpresa: valor }));
  }

  /**
   * @description Actualiza la entidad federativa del miembro.
   * @param {string | number} valor - Valor de la entidad federativa.
   */
  actualizarEntidadFederativa(valor: string | number): void {
    this.update((state) => ({ ...state, entidadFederativa: valor }));
  }

  /** Actualiza el valor de las instalaciones principales */
  actualizarInstalacionesPrincipales(valor: string | number): void {
    this.update((state) => ({ ...state, instalacionesPrincipales: valor }));
  }

  /** Establece el municipio donde se encuentra la instalación */
  actualizarMunicipio(valor: string): void {
    this.update((state) => ({ ...state, municipio: valor }));
  }

  /** Define el tipo de instalación según un identificador numérico */
  actualizarTipoDeInstalacion(valor: number | string): void {
    this.update((state) => ({ ...state, tipoDeInstalacion: valor }));
  }

  /** Establece la entidad federativa donde está ubicada la instalación */
  actualizarFederativa(valor: string): void {
    this.update((state) => ({ ...state, federativa: valor }));
  }

  /** Actualiza el número de registro en la Secretaría correspondiente */
  actualizarRegistroSE(valor: string): void {
    this.update((state) => ({ ...state, registroSE: valor }));
  }

  /** Modifica la descripción detallada de la instalación */
  actualizarDesceripe(valor: string): void {
    this.update((state) => ({ ...state, desceripe: valor }));
  }

  /** Asigna el código postal de la ubicación */
  actualizarCodigoPostal(valor: string): void {
    this.update((state) => ({ ...state, codigoPostal: valor }));
  }

  /** Especifica el proceso productivo relacionado con la instalación */
  actualizarProcesoProductivo(valor: string | number): void {
    this.update((state) => ({ ...state, procesoProductivo: valor }));
  }

  /**
   * Actualiza el número o identificador de la póliza de fianza actual.
   * @param polizaFianzaActual Nuevo valor de la póliza (número o string).
   */
  actualizarPolizaFianzaActual(polizaFianzaActual: string | number): void {
    this.update((state) => ({ ...state, polizaFianzaActual }));
  }

  /**
   * Actualiza el folio de la fianza.
   * @param folioFianza Nuevo folio de fianza.
   */
  actualizarFolioFianza(folioFianza: string): void {
    this.update((state) => ({ ...state, folioFianza }));
  }

  /**
   * Actualiza el RFC de la institución afianzadora.
   * @param rfcAfianzadora Nuevo RFC de la afianzadora.
   */
  actualizarRfcAfianzadora(rfcAfianzadora: string): void {
    this.update((state) => ({ ...state, rfcAfianzadora }));
  }

  /**
   * Actualiza la fecha de expedición de la fianza.
   * @param fechaExpedicionFianza Nueva fecha de expedición en formato string.
   */
  actualizarFechaExpedicionFianza(fechaExpedicionFianza: string): void {
    this.update((state) => ({ ...state, fechaExpedicionFianza }));
  }

  /**
   * Actualiza la fecha de inicio de vigencia de la fianza.
   * @param fecInicioVigenciaFianza Nueva fecha de inicio en formato string.
   */
  actualizarFecInicioVigenciaFianza(fecInicioVigenciaFianza: string): void {
    this.update((state) => ({ ...state, fecInicioVigenciaFianza }));
  }

  /**
   * Actualiza la fecha de fin de vigencia de la fianza.
   * @param fecFinVigenciaFianza Nueva fecha de fin en formato string.
   */
  actualizarFecFinVigenciaFianza(fecFinVigenciaFianza: string): void {
    this.update((state) => ({ ...state, fecFinVigenciaFianza }));
  }

  /**
   * Actualiza el importe total de la fianza.
   * @param fianzaImporteTotal Nuevo importe total de la fianza.
   */
  actualizarFianzaImporteTotal(fianzaImporteTotal: string): void {
    this.update((state) => ({ ...state, fianzaImporteTotal }));
  }

  /**
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
