import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
/** Tipo de endoso, puede ser cadena o número */
export interface Solicitud31301State {
  /** Tipo de endoso, puede ser cadena o número */
  tipoDeEndoso: string | number;

  /** Tipo de garantía, valor numérico */
  tipoDeGarantia: number;

  /** Modalidad de la garantía, valor numérico */
  modalidadDeLaGarantia: number;

  /** Tipo de sector, valor en cadena */
  tipoSector: string;

  /** Concepto, valor numérico */
  concepto: number;

  /** Número 3500, valor numérico */
  '3500': number;

  /** Número 3501, valor numérico */
  '3501': number;

  /** Número 3502, valor numérico */
  '3502': number;

  /** RFC de los datos generales */
  datosGeneralesRFC: string;

  /** Número 3503, valor numérico */
  '3503': number;

  /** Número 3504, valor numérico */
  '3504': number;

  /** Número 3505, valor numérico */
  '3505': number;

  /** Número 3506, valor numérico */
  '3506': number;

  /** Número 3507, valor numérico */
  '3507': number;

  /** Número 3508, valor numérico */
  '3508': number;

  /** Número 3509, valor numérico */
  '3509': number;

  /** Número 3511, valor numérico */
  '3511': number;

  /** Número 3512, valor numérico */
  '3512': number;

  /** Número 3513, valor numérico */
  '3513': number;

  /** Texto genérico 1, valor en cadena */
  textoGenerico1: string;

  /** Texto genérico 2, valor en cadena */
  textoGenerico2: string;

  /** Número 3514, valor numérico */
  '3514': number;

  /** Número 3515, valor numérico */
  '3515': number;

  /** Número 3516, valor numérico */
  '3516': number;

  /** Texto genérico 3, valor en cadena */
  textoGenerico3: string;

  /** Número 3517, valor numérico */
  '3517': number;

  /** Número 3518, valor numérico */
  '3518': number;

  /** Número 3519, valor numérico */
  '3519': number;

  /** Número 3520, valor numérico */
  '3520': number;

  /** Tipo de inversión, valor numérico */
  tipoInversion: number;

  /** Cantidad de inversión, valor en cadena */
  cantidadInversion: string;

  /** Descripción de la inversión, valor en cadena */
  descInversion: string;

  /** Número 3521, valor numérico */
  '3521': number;

  /** Número 3522, valor numérico */
  '3522': number;

  /** Clave de enumeración D0 */
  claveEnumeracionD0: string;

  /** Clave de enumeración D1 */
  claveEnumeracionD1: string;

  /** Clave de enumeración D2 */
  claveEnumeracionD2: string;

  /** Clave de enumeración D3 */
  claveEnumeracionD3: string;

  /** Clave de enumeración H */
  claveEnumeracionH: string;

  /** Texto genérico 4, valor en cadena */
  textoGenerico4: string;

  /** Texto genérico 5, valor en cadena */
  textoGenerico5: string;

  /** Número 3523, valor numérico */
  '3523': number;

  /** Número 3528, valor numérico */
  '3528': number;

  /** Número 3529, valor numérico */
  '3529': number;

  /** Texto genérico 6, valor en cadena */
  textoGenerico6: string;

  /** Texto genérico 7, valor en cadena */
  textoGenerico7: string;

  /** Número 3530, valor numérico */
  '3530': number;

  /** Número 3531, valor numérico */
  '3531': number;

  /** Texto genérico 9, valor en cadena */
  textoGenerico9: string;

  /** Texto genérico 10, valor numérico */
  textoGenerico10: number;

  /** Texto genérico 11, valor numérico */
  textoGenerico11: number;

  /** Texto genérico 12, valor numérico */
  textoGenerico12: number;

  /** Texto genérico 13, valor numérico */
  textoGenerico13: number;

  /** Texto genérico 14, valor numérico */
  textoGenerico14: number;

  /** Texto genérico 15, valor numérico */
  textoGenerico15: number;

  /** Texto genérico 16, valor numérico */
  textoGenerico16: number;

  /** Texto genérico 17, valor numérico */
  textoGenerico17: number;

  /** Texto genérico 18, valor numérico */
  textoGenerico18: number;

  /** Texto genérico 19, valor numérico */
  textoGenerico19: number;

  /** Texto genérico 20, valor numérico */
  textoGenerico20: number;

  /** Texto genérico 21, valor numérico */
  textoGenerico21: number;

  /** Texto genérico 22, valor numérico */
  textoGenerico22: number;

  /** Texto genérico 23, valor numérico */
  textoGenerico23: number;

  /** Texto genérico 24, valor numérico */
  textoGenerico24: number;

  /** Alerta 1, valor booleano */
  alerta1: boolean;

  /** Alerta 2, valor booleano */
  alerta2: boolean;

  /** Póliza de fianza actual, valor numérico */
  polizaDeFianzaAnterior: number | string;

  /** Número de folio, valor en cadena */
  numeroFolioAnterior: string;

  /** RFC de la institución, valor en cadena */
  rfcInstitucionAnterior: string;

  /** Fecha de expedición, valor en cadena */
  fechaExpedicionAnterior: string;

  /** Fecha de inicio de vigencia no, valor en cadena */
  fechaInicioVigenciaNoAnterior: string;

  /** Fecha de fin de vigencia no, valor en cadena */
  fechaFinVigenciaNoAnterior: string;

  /** Fecha de inicio de vigencia, valor en cadena */
  fechaInicioVigenciaAnterior: string;

  /** Fecha de fin de vigencia, valor en cadena */
  fechaFinVigenciaAnterior: string;

  /** Importe total, valor en cadena */
  importeTotalAnterior: string;

  /** Póliza de fianza actual, valor numérico */
  polizaDeFianzaActual: number | string;

  /** Número de folio, valor en cadena */
  numeroFolioActual: string;

  /** RFC de la institución, valor en cadena */
  rfcInstitucionActual: string;

  /** Fecha de expedición, valor en cadena */
  fechaExpedicionActual: string;

  /** Fecha de inicio de vigencia no, valor en cadena */
  fechaInicioVigenciaNoActual: string;

  /** Fecha de fin de vigencia no, valor en cadena */
  fechaFinVigenciaNoActual: string;

  /** Fecha de inicio de vigencia, valor en cadena */
  fechaInicioVigenciaActual: string;

  /** Fecha de fin de vigencia, valor en cadena */
  fechaFinVigenciaActual: string;

  /**
   * Monto en el que se amplía, valor en cadena
   */
  montoAmpliaActual: string;
  /**
   * Monto garantizado de ampliacion, valor en cadena
   */
  montoGarantizadoActual: string;

  /** Póliza de fianza actual, valor numérico */
  polizaDeFianza: number | string;

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
}

/**
 * Función que crea el estado inicial de la solicitud.
 * Esta función devuelve un objeto vacío que representa el estado inicial
 * de la solicitud, el cual puede ser modificado posteriormente.
 *
 * @returns {Solicitud31301State} Estado inicial de la solicitud.
 */
export function createInitialSolicitudState(): Solicitud31301State {
  return {
    tipoDeEndoso: '',
    tipoDeGarantia: 0,
    modalidadDeLaGarantia: 0,
    tipoSector: '',
    concepto: 0,
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
    tipoInversion: 0,
    cantidadInversion: '',
    descInversion: '',
    '3521': 0,
    '3522': 0,
    claveEnumeracionD0: '',
    claveEnumeracionD1: '',
    claveEnumeracionD2: '',
    claveEnumeracionD3: '',
    claveEnumeracionH: '',
    textoGenerico4: '',
    textoGenerico5: '',
    '3523': 0,
    '3528': 0,
    '3529': 0,
    textoGenerico6: '',
    textoGenerico7: '',
    '3530': 0,
    '3531': 0,
    textoGenerico9: '',
    textoGenerico10: 0,
    textoGenerico11: 0,
    textoGenerico12: 0,
    textoGenerico13: 0,
    textoGenerico14: 0,
    textoGenerico15: 0,
    textoGenerico16: 0,
    textoGenerico17: 0,
    textoGenerico18: 0,
    textoGenerico19: 0,
    textoGenerico20: 0,
    textoGenerico21: 0,
    textoGenerico22: 0,
    textoGenerico23: 0,
    textoGenerico24: 0,
    alerta1: false,
    alerta2: false,
    polizaDeFianza: '',
    numeroFolio: '',
    rfcInstitucion: '',
    fechaExpedicion: '',
    fechaInicioVigenciaNo: '',
    fechaFinVigenciaNo: '',
    fechaInicioVigencia: '',
    fechaFinVigencia: '',
    importeTotal: '',
    polizaDeFianzaAnterior: '',
    numeroFolioAnterior: '',
    rfcInstitucionAnterior: '',
    fechaExpedicionAnterior: '',
    fechaInicioVigenciaNoAnterior: '',
    fechaFinVigenciaNoAnterior: '',
    fechaInicioVigenciaAnterior: '',
    fechaFinVigenciaAnterior: '',
    importeTotalAnterior: '',
    polizaDeFianzaActual: '',
    numeroFolioActual: '',
    rfcInstitucionActual: '',
    fechaExpedicionActual: '',
    fechaInicioVigenciaNoActual: '',
    fechaFinVigenciaNoActual: '',
    fechaInicioVigenciaActual: '',
    fechaFinVigenciaActual: '',
    montoAmpliaActual: '',
    montoGarantizadoActual: '',
    razonSocialAnterior: '',
    razonSocialActual: '',
    rfc: '',
    curp: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
  };
}
@Injectable({
  providedIn: 'root', // Este servicio es proporcionado en el nivel raíz de la aplicación
})
@StoreConfig({
  name: 'solicitud31301', // Nombre de la configuración para el store
  resettable: true, // Habilita la opción de restablecer el estado del store
})
export class Solicitud31301Store extends Store<Solicitud31301State> {
  constructor() {
    // Llama al constructor de la clase padre Store con el estado inicial
    super(createInitialSolicitudState());
  }

  /** Actualiza el tipo de endoso en el estado */
  actualizarTipoDeEndoso(tipoDeEndoso: string | number): void {
    this.update((state) => ({ ...state, tipoDeEndoso }));
  }

  /** Actualiza el tipo de garantía en el estado */
  actualizarTipoDeGarantia(tipoDeGarantia: number): void {
    this.update((state) => ({ ...state, tipoDeGarantia }));
  }

  /** Actualiza la modalidad de la garantía en el estado */
  actualizarModalidadDeLaGarantia(modalidadDeLaGarantia: number): void {
    this.update((state) => ({ ...state, modalidadDeLaGarantia }));
  }

  /** Actualiza el tipo de sector en el estado */
  actualizarTipoSector(tipoSector: string): void {
    this.update((state) => ({ ...state, tipoSector }));
  }

  /** Actualiza el concepto en el estado */
  actualizarConcepto(concepto: number): void {
    this.update((state) => ({ ...state, concepto }));
  }

  /** Actualiza el valor de 3500 en el estado */
  actualizar3500(valor: number): void {
    this.update((state) => ({ ...state, '3500': valor }));
  }

  /** Actualiza el valor de 3501 en el estado */
  actualizar3501(valor: number): void {
    this.update((state) => ({ ...state, '3501': valor }));
  }

  /** Actualiza el valor de 3502 en el estado */
  actualizar3502(valor: number): void {
    this.update((state) => ({ ...state, '3502': valor }));
  }

  /** Actualiza los datos generales del RFC en el estado */
  actualizarDatosGeneralesRFC(datosGeneralesRFC: string): void {
    this.update((state) => ({ ...state, datosGeneralesRFC }));
  }

  /** Actualiza el valor de 3503 en el estado */
  actualizar3503(valor: number): void {
    this.update((state) => ({ ...state, '3503': valor }));
  }

  /** Actualiza el valor de 3504 en el estado */
  actualizar3504(valor: number): void {
    this.update((state) => ({ ...state, '3504': valor }));
  }

  /** Actualiza el valor de 3505 en el estado */
  actualizar3505(valor: number): void {
    this.update((state) => ({ ...state, '3505': valor }));
  }

  /** Actualiza el valor de 3506 en el estado */
  actualizar3506(valor: number): void {
    this.update((state) => ({ ...state, '3506': valor }));
  }

  /** Actualiza el valor de 3507 en el estado */
  actualizar3507(valor: number): void {
    this.update((state) => ({ ...state, '3507': valor }));
  }

  /** Actualiza el valor de 3508 en el estado */
  actualizar3508(valor: number): void {
    this.update((state) => ({ ...state, '3508': valor }));
  }

  /** Actualiza el valor de 3509 en el estado */
  actualizar3509(valor: number): void {
    this.update((state) => ({ ...state, '3509': valor }));
  }

  /** Actualiza el valor de 3511 en el estado */
  actualizar3511(valor: number): void {
    this.update((state) => ({ ...state, '3511': valor }));
  }

  /** Actualiza el valor de 3512 en el estado */
  actualizar3512(valor: number): void {
    this.update((state) => ({ ...state, '3512': valor }));
  }

  /** Actualiza el valor de 3513 en el estado */
  actualizar3513(valor: number): void {
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
  actualizar3514(valor: number): void {
    this.update((state) => ({ ...state, '3514': valor }));
  }

  /** Actualiza el valor de 3515 en el estado */
  actualizar3515(valor: number): void {
    this.update((state) => ({ ...state, '3515': valor }));
  }

  /** Actualiza el valor de 3516 en el estado */
  actualizar3516(valor: number): void {
    this.update((state) => ({ ...state, '3516': valor }));
  }

  /** Actualiza el valor del texto genérico 3 en el estado */
  actualizarTextoGenerico3(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico3: valor }));
  }

  /** Actualiza el valor de 3517 en el estado */
  actualizar3517(valor: number): void {
    this.update((state) => ({ ...state, '3517': valor }));
  }

  /** Actualiza el valor de 3518 en el estado */
  actualizar3518(valor: number): void {
    this.update((state) => ({ ...state, '3518': valor }));
  }

  /** Actualiza el valor de 3519 en el estado */
  actualizar3519(valor: number): void {
    this.update((state) => ({ ...state, '3519': valor }));
  }

  /** Actualiza el valor de 3520 en el estado */
  actualizar3520(valor: number): void {
    this.update((state) => ({ ...state, '3520': valor }));
  }

  /** Actualiza el tipo de inversión en el estado */
  actualizarTipoInversion(valor: number): void {
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
  actualizar3521(valor: number): void {
    this.update((state) => ({ ...state, '3521': valor }));
  }

  /** Actualiza el valor de 3522 en el estado */
  actualizar3522(valor: number): void {
    this.update((state) => ({ ...state, '3522': valor }));
  }

  /** Actualiza la clave de enumeración D0 en el estado */
  actualizarClaveEnumeracionD0(valor: string): void {
    this.update((state) => ({ ...state, claveEnumeracionD0: valor }));
  }

  /** Actualiza la clave de enumeración D1 en el estado */
  actualizarClaveEnumeracionD1(valor: string): void {
    this.update((state) => ({ ...state, claveEnumeracionD1: valor }));
  }

  /** Actualiza la clave de enumeración D2 en el estado */
  actualizarClaveEnumeracionD2(valor: string): void {
    this.update((state) => ({ ...state, claveEnumeracionD2: valor }));
  }

  /** Actualiza la clave de enumeración D3 en el estado */
  actualizarClaveEnumeracionD3(valor: string): void {
    this.update((state) => ({ ...state, claveEnumeracionD3: valor }));
  }

  /** Actualiza la clave de enumeración H en el estado */
  actualizarClaveEnumeracionH(valor: string): void {
    this.update((state) => ({ ...state, claveEnumeracionH: valor }));
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
  actualizar3523(valor: number): void {
    this.update((state) => ({ ...state, '3523': valor }));
  }

  /** Actualiza el valor de 3528 en el estado */
  actualizar3528(valor: number): void {
    this.update((state) => ({ ...state, '3528': valor }));
  }

  /** Actualiza el valor de 3529 en el estado */
  actualizar3529(valor: number): void {
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
  actualizar3530(valor: number): void {
    this.update((state) => ({ ...state, '3530': valor }));
  }

  /** Actualiza el valor de 3531 en el estado */
  actualizar3531(valor: number): void {
    this.update((state) => ({ ...state, '3531': valor }));
  }

  /** Actualiza el valor del texto genérico 9 en el estado */
  actualizarTextoGenerico9(valor: string): void {
    this.update((state) => ({ ...state, textoGenerico9: valor }));
  }

  /** Actualiza el valor del texto genérico 10 en el estado */
  actualizarTextoGenerico10(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico10: valor }));
  }

  /** Actualiza el valor del texto genérico 11 en el estado */
  actualizarTextoGenerico11(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico11: valor }));
  }

  /** Actualiza el valor del texto genérico 12 en el estado */
  actualizarTextoGenerico12(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico12: valor }));
  }

  /** Actualiza el valor del texto genérico 13 en el estado */
  actualizarTextoGenerico13(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico13: valor }));
  }

  /** Actualiza el valor del texto genérico 14 en el estado */
  actualizarTextoGenerico14(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico14: valor }));
  }

  /** Actualiza el valor del texto genérico 15 en el estado */
  actualizarTextoGenerico15(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico15: valor }));
  }

  /** Actualiza el valor del texto genérico 16 en el estado */
  actualizarTextoGenerico16(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico16: valor }));
  }

  /** Actualiza el valor del texto genérico 17 en el estado */
  actualizarTextoGenerico17(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico17: valor }));
  }

  /** Actualiza el valor del texto genérico 18 en el estado */
  actualizarTextoGenerico18(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico18: valor }));
  }

  /** Actualiza el valor del texto genérico 19 en el estado */
  actualizarTextoGenerico19(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico19: valor }));
  }

  /** Actualiza el valor del texto genérico 20 en el estado */
  actualizarTextoGenerico20(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico20: valor }));
  }

  /** Actualiza el valor del texto genérico 21 en el estado */
  actualizarTextoGenerico21(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico21: valor }));
  }

  /** Actualiza el valor del texto genérico 22 en el estado */
  actualizarTextoGenerico22(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico22: valor }));
  }

  /** Actualiza el valor del texto genérico 23 en el estado */
  actualizarTextoGenerico23(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico23: valor }));
  }

  /** Actualiza el valor del texto genérico 24 en el estado */
  actualizarTextoGenerico24(valor: number): void {
    this.update((state) => ({ ...state, textoGenerico24: valor }));
  }

  /** Actualiza el valor de alerta1 en el estado */
  actualizarAlerta1(valor: boolean): void {
    this.update((state) => ({ ...state, alerta1: valor }));
  }

  /** Actualiza el valor de alerta2 en el estado */
  actualizarAlerta2(valor: boolean): void {
    this.update((state) => ({ ...state, alerta2: valor }));
  }

  /** Actualiza el valor de la póliza de fianza actual en el estado */
  actualizarpolizaDeFianza(polizaDeFianza: number | string): void {
    this.update((state) => ({
      ...state,
      polizaDeFianza,
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

  /** Actualiza la póliza de fianza anterior en el estado */
  actualizarPolizaDeFianzaAnterior(
    polizaDeFianzaAnterior: number | string
  ): void {
    this.update((state) => ({ ...state, polizaDeFianzaAnterior }));
  }

  /** Actualiza el número de folio anterior en el estado */
  actualizarNumeroFolioAnterior(numeroFolioAnterior: string): void {
    this.update((state) => ({ ...state, numeroFolioAnterior }));
  }

  /** Actualiza el RFC de la institución anterior en el estado */
  actualizarRfcInstitucionAnterior(rfcInstitucionAnterior: string): void {
    this.update((state) => ({ ...state, rfcInstitucionAnterior }));
  }

  /** Actualiza la fecha de expedición anterior en el estado */
  actualizarFechaExpedicionAnterior(fechaExpedicionAnterior: string): void {
    this.update((state) => ({ ...state, fechaExpedicionAnterior }));
  }

  /** Actualiza la fecha de inicio de vigencia no anterior en el estado */
  actualizarFechaInicioVigenciaNoAnterior(
    fechaInicioVigenciaNoAnterior: string
  ): void {
    this.update((state) => ({ ...state, fechaInicioVigenciaNoAnterior }));
  }

  /** Actualiza la fecha de fin de vigencia no anterior en el estado */
  actualizarFechaFinVigenciaNoAnterior(
    fechaFinVigenciaNoAnterior: string
  ): void {
    this.update((state) => ({ ...state, fechaFinVigenciaNoAnterior }));
  }

  /** Actualiza la fecha de inicio de vigencia anterior en el estado */
  actualizarFechaInicioVigenciaAnterior(
    fechaInicioVigenciaAnterior: string
  ): void {
    this.update((state) => ({ ...state, fechaInicioVigenciaAnterior }));
  }

  /** Actualiza la fecha de fin de vigencia anterior en el estado */
  actualizarFechaFinVigenciaAnterior(fechaFinVigenciaAnterior: string): void {
    this.update((state) => ({ ...state, fechaFinVigenciaAnterior }));
  }

  /** Actualiza el importe total anterior en el estado */
  actualizarImporteTotalAnterior(importeTotalAnterior: string): void {
    this.update((state) => ({ ...state, importeTotalAnterior }));
  }

  /** Actualiza la póliza de fianza actual en el estado */
  actualizarPolizaDeFianzaActual(polizaDeFianzaActual: number | string): void {
    this.update((state) => ({ ...state, polizaDeFianzaActual }));
  }

  /** Actualiza el número de folio actual en el estado */
  actualizarNumeroFolioActual(numeroFolioActual: string): void {
    this.update((state) => ({ ...state, numeroFolioActual }));
  }

  /** Actualiza el RFC de la institución actual en el estado */
  actualizarRfcInstitucionActual(rfcInstitucionActual: string): void {
    this.update((state) => ({ ...state, rfcInstitucionActual }));
  }

  /** Actualiza la fecha de expedición actual en el estado */
  actualizarFechaExpedicionActual(fechaExpedicionActual: string): void {
    this.update((state) => ({ ...state, fechaExpedicionActual }));
  }

  /** Actualiza la fecha de inicio de vigencia no actual en el estado */
  actualizarFechaInicioVigenciaNoActual(
    fechaInicioVigenciaNoActual: string
  ): void {
    this.update((state) => ({ ...state, fechaInicioVigenciaNoActual }));
  }

  /** Actualiza la fecha de fin de vigencia no actual en el estado */
  actualizarFechaFinVigenciaNoActual(fechaFinVigenciaNoActual: string): void {
    this.update((state) => ({ ...state, fechaFinVigenciaNoActual }));
  }

  /** Actualiza la fecha de inicio de vigencia actual en el estado */
  actualizarFechaInicioVigenciaActual(fechaInicioVigenciaActual: string): void {
    this.update((state) => ({ ...state, fechaInicioVigenciaActual }));
  }

  /** Actualiza la fecha de fin de vigencia actual en el estado */
  actualizarFechaFinVigenciaActual(fechaFinVigenciaActual: string): void {
    this.update((state) => ({ ...state, fechaFinVigenciaActual }));
  }

  /** Actualiza el monto de ampliación actual en el estado */
  actualizarMontoAmpliaActual(montoAmpliaActual: string): void {
    this.update((state) => ({ ...state, montoAmpliaActual }));
  }

  /** Actualiza el monto garantizado actual en el estado */
  actualizarMontoGarantizadoActual(montoGarantizadoActual: string): void {
    this.update((state) => ({ ...state, montoGarantizadoActual }));
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
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
