import { Injectable } from '@angular/core';
import { MercanciaTabla } from '../models/medio-transporte.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';




/**
 * Interfaz que define la estructura del estado de la solicitud.
 */
export interface Solicitud220502State {
  [key: string]: unknown;
  /** Cantidad de certificados autorizados pendientes. */
  certificadosAutorizados: number | string;

  /** Hora programada para la inspección. */
  horaDeInspeccion: number | string;

  /** Identificador numérico de la aduana de ingreso. */
  aduanaDeIngreso: number | string;

  /** Identificador numérico de la oficina de Sanidad Agropecuaria. */
  sanidadAgropecuaria: number | string;

  /** Identificador numérico del punto de inspección. */
  puntoDeInspeccion: number | string;

  /** Fecha programada para la inspección en formato de cadena (ej. 'YYYY-MM-DD'). */
  fechaDeInspeccion: string;

  /** Fecha real en la que se realizó la inspección en formato de cadena (ej. 'YYYY-MM-DD'). */
  fechaInspeccion: string;

  /** Nombre del solicitante o responsable. */
  nombre: string;

  /** Primer apellido del solicitante o responsable. */
  primerapellido: string;

  /** Segundo apellido del solicitante o responsable. */
  segundoapellido: string;

  /** Descripción de la mercancía objeto del trámite. */
  mercancia: string;

  /** Identificador numérico del tipo de contenedor. */
  tipocontenedor: number | string;

  /** Identificador numérico del medio de transporte. */
  transporteIdMedio: number | string;

  /** Identificación del transporte (placa, número económico, etc.). */
  identificacionTransporte: string;

  /**
   * Indica si la solicitud está relacionada con transporte ferroviario.
   * Puede ser un valor numérico (0 o 1) o una cadena ('sí'/'no').
   */
  esSolicitudFerros: string | number;

  /** Total de guías amparadas por la solicitud. */
  totalDeGuiasAmparadas: string;

  /**
   * Indica si está exento de pago.
   */
  exentoPagoNo: number | string;
  /**
   * Justificación del pago.
   */
  justificacion: number | string;
  /**
   * Clave de referencia del pago.
   */
  claveReferencia: string;
  /**
   * Cadena de dependencia.
   */
  cadenaDependencia: string;
  /**
   * Banco asociado al pago.
   */
  banco: number |string;
  /**
   * Llave de pago.
   */
  llavePago: string;
  /**
   * Importe del pago.
   */
  importePago: string;
  /**
   * Fecha del pago.
   */
  fetchapago: string;

  /**
   * Aduana de ingreso.
   */
  aduanaIngreso: number | string;
  /**
   * Oficina de inspección.
   */
  oficinaInspeccion: number |string;
  /**
   * Punto de inspección.
   */
  puntoInspeccion: number |string;

  /** Nombre o identificador del ferrocarril utilizado para el transporte. */
  ferrocarril: string;

  /**
   * Número de guía.
   */
  numeroguia: string;
  /**
   * Régimen aduanero.
   */
  regimen: number |string;
  /**
   * Coordenadas de la ubicación.
   */
  coordenadas: string;
  /**
   * Tipo de movilización.
   */
  movilizacion: number |string;
  /**
   * Tipo de transporte.
   */
  transporte: string;
  /**
   * Punto de inspección.
   */
  punto: number;
  /**
   * Nombre de la empresa.
   */
  nombreEmpresa: number |string;
  /**
   * Folio de la solicitud.
   */
  foliodel: string;

  /**
   * Fracción arancelaria de la mercancía.
   */
  fraccionArancelaria: string;
  /**
   * Descripción de la fracción arancelaria.
   */
  descripcionFraccion: string;
  /**
   * Número de identificación de la mercancía (NICO).
   */
  nico: string;
  /**
   * Descripción de la mercancía.
   */
  descripcion: string;
  /**
   * Unidad de medida tarifaria de la mercancía.
   */
  unidaddeMedidaDeUMT: string;
  /**
   * Cantidad total de la unidad de medida tarifaria.
   */
  cantidadTotalUMT: string;
  /**
   * Saldo pendiente de la solicitud.
   */
  saldoPendiente: string;
  /**
   * Saldo a capturar.
   */
  saldoACapturar: string;
   id_solicitud:string
   mercanciaLista: MercanciaTabla[]
}

/**
 * Función para crear el estado inicial de la solicitud.
 *
 * @returns Estado inicial de la solicitud.
 */
export function crearEstadoInicial(): Solicitud220502State {
  return {
    certificadosAutorizados: '',
    horaDeInspeccion: '',
    aduanaDeIngreso: '',
    sanidadAgropecuaria: '',
    puntoDeInspeccion: '',
    fechaDeInspeccion: '',
    fechaInspeccion: '',
    nombre: '',
    primerapellido: '',
    segundoapellido: '',
    mercancia: '',
    tipocontenedor: '',
    transporteIdMedio: 0,
    identificacionTransporte: '',
    esSolicitudFerros: '',
    totalDeGuiasAmparadas: '',
    exentoPagoNo: -1,
    justificacion: -1,
    claveReferencia: '',
    cadenaDependencia: '',
    banco: -1,
    llavePago: '',
    importePago: '',
    fetchapago: '',
    ferrocarril: '',
    numeroguia: '',
    regimen: -1,
    coordenadas: '',
    movilizacion: -1,
    transporte: '',
    punto: -1,
    nombreEmpresa: -1,
    foliodel: '',
    aduanaIngreso: -1,
    oficinaInspeccion: -1,
    puntoInspeccion: -1,

    fraccionArancelaria: '',
    descripcionFraccion: '',
    nico: '',
    descripcion: '',
    unidaddeMedidaDeUMT: '',
    cantidadTotalUMT: '',
    saldoPendiente: '',
    saldoACapturar: '',
    id_solicitud:'',
    mercanciaLista:[],
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Solicitud220502Store', resettable: true })
export class Solicitud220502Store extends Store<Solicitud220502State> {
  /**
   * Constructor de la clase Solicitud220502Store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(crearEstadoInicial());
  }
  /**
 * Actualiza el identificador de la solicitud en el estado.
 *
 * @param id_solicitud - Identificador único de la solicitud.
 */
public setIdSolicitud(id_solicitud: string): void {
  this.update((state) => ({
    ...state,
    id_solicitud,
  }));
}

  /**
   * Actualiza el número de certificados autorizados en el estado.
   *
   * @param certificadosAutorizados - Cantidad de certificados autorizados.
   */
  public setCertificadosAutorizados(
    certificadosAutorizados: number | string
  ): void {
    this.update((state) => ({
      ...state,
      certificadosAutorizados,
    }));
  }

  /**
   * Actualiza la hora de inspección en el estado.
   *
   * @param horaDeInspeccion - Hora en la que se realizará la inspección.
   */
  public setHoraDeInspeccion(horaDeInspeccion: number | string): void {
    this.update((state) => ({
      ...state,
      horaDeInspeccion,
    }));
  }

  /**
   * Actualiza el código de la aduana de ingreso en el estado.
   *
   * @param aduanaDeIngreso - Código de la aduana de ingreso.
   */
  public setAduanaDeIngreso(aduanaDeIngreso: number | string): void {
    this.update((state) => ({
      ...state,
      aduanaDeIngreso,
    }));
  }

  /**
   * Actualiza el valor de sanidad agropecuaria en el estado.
   *
   * @param sanidadAgropecuaria - Valor de sanidad agropecuaria.
   */
  public setSanidadAgropecuaria(sanidadAgropecuaria: number | string): void {
    this.update((state) => ({
      ...state,
      sanidadAgropecuaria,
    }));
  }

  /**
   * Actualiza el punto de inspección en el estado.
   *
   * @param puntoDeInspeccion - Código del punto de inspección.
   */
  public setPuntoDeInspeccion(puntoDeInspeccion: number | string): void {
    this.update((state) => ({
      ...state,
      puntoDeInspeccion,
    }));
  }

  /**
   * Actualiza la fecha de inspección en el estado.
   *
   * @param fechaDeInspeccion - Fecha en la que se realizará la inspección.
   */
  public setFechaDeInspeccion(fechaDeInspeccion: string): void {
    this.update((state) => ({
      ...state,
      fechaDeInspeccion,
    }));
  }

  /**
   * Actualiza la fecha de inspección en el estado.
   *
   * @param fechaInspeccion - Fecha en la que se realizará la inspección.
   */
  public setFechaInspeccion(fechaInspeccion: string): void {
    this.update((state) => ({
      ...state,
      fechaInspeccion,
    }));
  }

  /**
   * Actualiza el nombre del solicitante en el estado.
   *
   * @param nombre - Nombre del solicitante.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Actualiza el primer apellido del solicitante en el estado.
   *
   * @param primerapellido - Primer apellido del solicitante.
   */
  public setPrimerapellido(primerapellido: string): void {
    this.update((state) => ({
      ...state,
      primerapellido,
    }));
  }

  /**
   * Actualiza el segundo apellido del solicitante en el estado.
   *
   * @param segundoapellido - Segundo apellido del solicitante.
   */
  public setSegundoapellido(segundoapellido: string): void {
    this.update((state) => ({
      ...state,
      segundoapellido,
    }));
  }

  /**
   * Actualiza la mercancía declarada en el estado.
   *
   * @param mercancia - Descripción de la mercancía.
   */
  public setMercancia(mercancia: string): void {
    this.update((state) => ({
      ...state,
      mercancia,
    }));
  }

  /**
   * Actualiza el tipo de contenedor en el estado.
   *
   * @param tipocontenedor - Código del tipo de contenedor.
   */
  public setTipocontenedor(tipocontenedor: number | string): void {
    this.update((state) => ({
      ...state,
      tipocontenedor,
    }));
  }

  /**
   * Actualiza el medio de transporte en el estado.
   *
   * @param transporteIdMedio - Identificador del medio de transporte.
   */
  public setTransporteIdMedio(transporteIdMedio: string | number): void {
    this.update((state) => ({
      ...state,
      transporteIdMedio,
    }));
  }

  /**
   * Actualiza la identificación del transporte en el estado.
   *
   * @param identificacionTransporte - Identificación del transporte.
   */
  public setIdentificacionTransporte(identificacionTransporte: string): void {
    this.update((state) => ({
      ...state,
      identificacionTransporte,
    }));
  }

  /**
   * Actualiza si la solicitud es ferroviaria en el estado.
   *
   * @param esSolicitudFerros - Indica si la solicitud está relacionada con transporte ferroviario.
   */
  public setEsSolicitudFerros(esSolicitudFerros: string | number): void {
    this.update((state) => ({
      ...state,
      esSolicitudFerros,
    }));
  }

  /**
   * Actualiza el total de guías amparadas en el estado.
   *
   * @param totalDeGuiasAmparadas - Cantidad total de guías amparadas.
   */
  public setTotalDeGuiasAmparadas(totalDeGuiasAmparadas: string): void {
    this.update((state) => ({
      ...state,
      totalDeGuiasAmparadas,
    }));
  }

  /**
   * Establece la justificación del pago.
   * @param justificacion Justificación del pago.
   * @returns void
   */
  public setJustificacion(justificacion: number | string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * Establece la clave de referencia del pago.
   * @param claveReferencia Clave de referencia del pago.
   * @returns void
   */
  public setClaveReferencia(claveReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveReferencia,
    }));
  }

  /**
   * Establece la cadena de dependencia.
   * @param cadenaDependencia Cadena de dependencia.
   * @returns void
   */
  public setCadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia,
    }));
  }

  /**
   * Establece el banco asociado al pago.
   * @param banco Banco asociado al pago.
   * @returns void
   */
  public setBanco(banco: number |string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Establece la clave de pago.
   * @param llavePago Clave de pago.
   * @returns void
   */
  public setIlavePago(llavePago: string): void {
    this.update((state) => ({
      ...state,
      llavePago,
    }));
  }

  /**
   * Establece el importe del pago.
   * @param importePago Importe del pago.
   * @returns void
   */
  public setImportePago(importePago: string): void {
    this.update((state) => ({
      ...state,
      importePago,
    }));
  }

  /**
   * Establece la fecha del pago.
   * @param fetchapago Fecha del pago.
   * @returns void
   */
  public setFetchaPago(fetchapago: string): void {
    this.update((state) => ({
      ...state,
      fetchapago,
    }));
  }

  /**
   * Establece si se debe mostrar el formulario para agregar mercancía.
   * @param value Indica si se debe mostrar el formulario para agregar mercancía.
   * @returns void
   */
  public setMostrarAgregarMercancia(value: boolean): void {
    this.update((state) => ({
      ...state,
      mostrarAgregarMercancia: value,
    }));
  }

  /**
   * Establece si está exento de pago.
   * @param exentoPagoNo Indica si está exento de pago.
   * @returns void
   */
  public setExentoPagoNo(exentoPagoNo: string | number): void {
    this.update((state) => ({
      ...state,
      exentoPagoNo,
    }));
  }

  /**
   * Establece la fracción arancelaria de la mercancía.
   * @param fraccionArancelaria Fracción arancelaria de la mercancía.
   * @returns void
   */
  public setSaldoACapturar(saldoACapturar: string): void {
    this.update((state) => ({
      ...state,
      saldoACapturar,
    }));
  }

  /**
   * Establece la aduana de ingreso.
   * @param aduanaIngreso Aduana de ingreso.
   * @returns void
   */
  public setAduanaIngreso(aduanaIngreso: number|string): void {
    this.update((state) => ({
      ...state,
      aduanaIngreso,
    }));
  }

  /**
   * Establece la oficina de inspección.
   * @param oficinaInspeccion Oficina de inspección.
   * @returns void
   */
  public setOficinaInspeccion(oficinaInspeccion: number |string): void {
    this.update((state) => ({
      ...state,
      oficinaInspeccion,
    }));
  }

  /**
   * Establece el punto de inspección.
   * @param puntoInspeccion Punto de inspección.
   * @returns void
   */
  public setPuntoInspeccion(puntoInspeccion: number|string): void {
    this.update((state) => ({
      ...state,
      puntoInspeccion,
    }));
  }

  /**
   * Actualiza el valor del ferrocarril en el estado de la solicitud.
   *
   * @param ferrocarril - Nombre o identificador del ferrocarril a establecer.
   */
  public setFerrocarril(ferrocarril: string): void {
    this.update((state) => ({
      ...state,
      ferrocarril,
    }));
  }
  /**
   * Establece el número de guía.
   * @param numeroguia Número de guía.
   * @returns void
   */
  public setNumeroguia(numeroguia: string): void {
    this.update((state) => ({
      ...state,
      numeroguia,
    }));
  }

  /**
   * Establece el tipo de movilización.
   * @param movilizacion Tipo de movilización.
   * @returns void
   */
  public setMovilizacion(movilizacion: number |string): void {
    this.update((state) => ({
      ...state,
      movilizacion,
    }));
  }

  /**
   * Establece el régimen aduanero.
   * @param regimen Régimen aduanero.
   * @returns void
   */
  public setRegimen(regimen: number|string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Establece Folio de la solicitud.
   * @param foliodel Folio de la solicitud.
   * @returns void
   */
  public setFoliodel(foliodel: string): void {
    this.update((state) => ({
      ...state,
      foliodel,
    }));
  }

  /**
   * Establece las coordenadas de la ubicación.
   * @param coordenadas Coordenadas de la ubicación.
   * @returns void
   */
  public setCoordenadas(coordenadas: string): void {
    this.update((state) => ({
      ...state,
      coordenadas,
    }));
  }

  /**
   * Establece el tipo de transporte.
   * @param transporte Tipo de transporte.
   * @returns void
   */
  public setTransporte(transporte: string): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }

  /**
   * Establece el nombre de la empresa.
   * @param nombreEmpresa Nombre de la empresa.
   * @returns void
   */
  public setNombreEmpresa(nombreEmpresa: number |string): void {
    this.update((state) => ({
      ...state,
      nombreEmpresa,
    }));
  }

  /**
   * Establece el punto de inspección.
   * @param punto Punto de inspección.
   * @returns void
   */
  public setPunto(punto: number): void {
    this.update((state) => ({
      ...state,
      punto,
    }));
  }

  /**
   * Actualiza la fracción arancelaria de la mercancía.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza la descripción de la fracción arancelaria.
   */
  public setDescripcionFraccion(descripcionFraccion: string): void {
    this.update((state) => ({
      ...state,
      descripcionFraccion,
    }));
  }

  /**
   * Actualiza el número de identificación de la mercancía (NICO).
   */
  public setNico(nico: string): void {
    this.update((state) => ({
      ...state,
      nico,
    }));
  }

  /**
   * Actualiza la descripción de la mercancía.
   */
  public setDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      descripcion,
    }));
  }

  /**
   * Actualiza la unidad de medida tarifaria de la mercancía.
   */
  public setUnidaddeMedidaDeUMT(unidaddeMedidaDeUMT: string): void {
    this.update((state) => ({
      ...state,
      unidaddeMedidaDeUMT,
    }));
  }

  /**
   * Actualiza la cantidad total de la unidad de medida tarifaria.
   */
  public setCantidadTotalUMT(cantidadTotalUMT: string): void {
    this.update((state) => ({
      ...state,
      cantidadTotalUMT,
    }));
  }

  /**
   * Actualiza el saldo pendiente de la solicitud.
   */
  public setSaldoPendiente(saldoPendiente: string): void {
    this.update((state) => ({
      ...state,
      saldoPendiente,
    }));
  }
  /**
 * Actualiza la lista de mercancías en el estado.
 *
 * @param mercanciaLista - Nueva lista de mercancías.
 */
public setMercanciaLista(
  mercanciaLista: MercanciaTabla[]
): void {
  this.update((state) => ({
    ...state,
    mercanciaLista,
  }))}

  /**
   * Restaura el estado al valor inicial.
   */
  public limpiarSeccion(): void {
    this.reset();
  }
}
