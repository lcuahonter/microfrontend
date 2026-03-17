import { Injectable } from '@angular/core';
import { MercanciaTabla } from '../models/medio-transporte.model';

import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';


/**
 * Interfaz que define la estructura del estado de la solicitud.
 */
export interface Solicitud220501State {
  [key: string]: unknown;
  /**
   * Medio de transporte utilizado.
   */
  medioDeTransporte: number | string;
   fechaDeInspeccion: string;
 /** Descripción de la mercancía objeto del trámite. */
  mercancia: string;
  /** Cantidad de certificados autorizados pendientes. */
  certificadosAutorizados: number | string;
  /**
   * Identificación del transporte.
   */
  identificacionTransporte: string;
  /** Segundo apellido del solicitante o responsable. */
  segundoapellido: string;
  /**
   * Indica si es una solicitud de ferros.
   */
  esSolicitudFerros: string | number;
  /**
   * Total de guías asociadas a la solicitud.
   */
  totalGuias: string;
  /**
   * Folio de la solicitud.
   */
  foliodel: string;
  /**
   * Aduana de ingreso.
   */
  aduanaIngreso: number|string;
  /**
   * Oficina de inspección.
   */
  oficinaInspeccion: number|string;
  /**
   * Punto de inspección.
   */
  puntoInspeccion: number|string;
  /**
   * Clave UCON.
   */
  claveUCON: string;
  /**
   * Establecimiento TIF.
   */
  establecimientoTIF: string;
  /**
   * Nombre del solicitante.
   */
  nombre: string;
   mercanciaLista: MercanciaTabla[]
  /**
   * Número de guía.
   */
  numeroguia: string;
  /**
   * Régimen aduanero.
   */
  regimen: number|string;
  /**
   * Datos de la mercancía capturados.
   */
  capturaDatosMercancia: string | number;
  /**
   * Coordenadas de la ubicación.
   */
  coordenadas: string;
  /**
   * Tipo de movilización.
   */
  movilizacion: number|string;
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
  nombreEmpresa: number|string;
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
  banco: number|string;
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
  id_solicitud: string;
  /**
   * Saldo a capturar.
   */
  saldoACapturar: string;

  /**
   * Datos de la mercancía capturados en la tabla.
   * @type {string[]}
   */
  mercanciaTablaDatos: string[];
  /** Primer apellido del solicitante o responsable. */
  primerapellido: string;
 /** Fecha real en la que se realizó la inspección en formato de cadena (ej. 'YYYY-MM-DD'). */
  fechaInspeccion: string;
  /**
   * Indica si se debe mostrar la sección.
   * @type {boolean}
   */
  mostrarSeccion: boolean;
  /** Identificador numérico de la aduana de ingreso. */
  aduanaDeIngreso: number | string;

  /** Identificador numérico de la oficina de Sanidad Agropecuaria. */
  sanidadAgropecuaria: number | string;

  /** Identificador numérico del punto de inspección. */
  puntoDeInspeccion: number | string;
  /** Hora programada para la inspección. */
  horaDeInspeccion: number | string;

  /** Total de guías amparadas por la solicitud. */
  totalDeGuiasAmparadas: string;
  /** Identificador numérico del tipo de contenedor. */
  tipocontenedor: number | string;
  /**
   * Certificado número.
   * @type {string}
   */
  certificadoNumero: string;

  /** Identificador numérico del medio de transporte. */
  transporteIdMedio: number | string;
  /**
   * Resultado del cálculo.
   * @type {string}
   */
  calculoResultado: string;
  
  /** Nombre o identificador del ferrocarril utilizado para el transporte. */
  ferrocarril: string;
}

/**
 * Función para crear el estado inicial de la solicitud.
 *
 * @returns Estado inicial de la solicitud.
 */
export function crearEstadoInicial(): Solicitud220501State {
  return {
    medioDeTransporte: '',
        mercanciaLista:[],
  ferrocarril: '',
      certificadosAutorizados: '',
      segundoapellido: '',
        primerapellido: '',
           aduanaDeIngreso: '',
    sanidadAgropecuaria: '',
    transporteIdMedio: 0,
    puntoDeInspeccion: '',
      id_solicitud:'',
    identificacionTransporte: '',
        totalDeGuiasAmparadas: '',
    esSolicitudFerros: '',
     horaDeInspeccion: '',
    totalGuias: '',
    foliodel: '',
      tipocontenedor: '',
  mercancia: '',
        fechaInspeccion: '',
    aduanaIngreso: -1,
    oficinaInspeccion: -1,
    puntoInspeccion: -1,
    claveUCON: '',
    establecimientoTIF: '',
    nombre: '',
    numeroguia: '',
    fechaDeInspeccion:'',
    regimen: -1,
    capturaDatosMercancia: -1,
    coordenadas: '',
    movilizacion: -1,
    transporte: '',
    punto: -1,
    nombreEmpresa: -1,
    exentoPagoNo: -1,
    justificacion: -1,
    claveReferencia: '',
    cadenaDependencia: '',
    banco: -1,
    llavePago: '',
    importePago: '',
    fetchapago: '',
    fraccionArancelaria: '',
    descripcionFraccion: '',
    nico: '',
    descripcion: '',
    unidaddeMedidaDeUMT: '',
    cantidadTotalUMT: '',
    saldoPendiente: '',
    saldoACapturar: '',

    mercanciaTablaDatos: [],
    mostrarSeccion: true,
    certificadoNumero: '',
    calculoResultado: ''
  };
}

/**
 * Clase que representa el store de la solicitud 220501.
 * Extiende la clase Store de Akita para manejar el estado de la solicitud.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Store para la gestión del estado de la solicitud 220501.
 * Utiliza Akita para el manejo del estado y la reactividad.
 */
@StoreConfig({ name: 'Solicitud220501Store', resettable: true })
/**
 * Clase que representa el store de la solicitud 220501.
 */
export class Solicitud220501Store extends Store<Solicitud220501State> {
  /**
   * Constructor de la clase Solicitud220501Store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(crearEstadoInicial());
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
   * Establece el medio de transporte utilizado.
   * @param medioDeTransporte Medio de transporte utilizado.
   * @returns void
   */
  public setMedioDeTransporte(medioDeTransporte: number | string): void {
    this.update((state) => ({
      ...state,
      medioDeTransporte,
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
   * Establece la identificación del transporte.
   * @param identificacionTransporte Identificación del transporte.
   * @returns void
   */
  public setIdentificacionTransporte(identificacionTransporte: string): void {
    this.update((state) => ({
      ...state,
      identificacionTransporte,
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
   * Establece la esSolicitudFerros.
   * @param esSolicitudFerros Indica si es una solicitud de ferros.
   * @returns void
   */
  public setEsSolicitudFerros(esSolicitudFerros: string | number): void {
    this.update((state) => ({
      ...state,
      esSolicitudFerros,
    }));
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
   * Establece total de guías asociadas a la solicitud.
   * @param totalGuias Total de guías asociadas a la solicitud.
   * @returns void
   */
  public setTotalGuias(totalGuias: string): void {
    this.update((state) => ({
      ...state,
      totalGuias,
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
   * Establece la aduana de ingreso.
   * @param aduanaIngreso Aduana de ingreso.
   * @returns void
   */
  public setAduanaIngreso(aduanaIngreso: number |string): void {
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
  public setOficinaInspeccion(oficinaInspeccion: number|string): void {
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
   * Establece la clave UCON.
   * @param claveUCON Clave UCON.
   * @returns void
   */
  public setClaveUCON(claveUCON: string): void {
    this.update((state) => ({
      ...state,
      claveUCON,
    }));
  }

  /**
   * Establece el establecimiento TIF.
   * @param establecimientoTIF Establecimiento TIF.
   * @returns void
   */
  public setEstablecimientoTIF(establecimientoTIF: string): void {
    this.update((state) => ({
      ...state,
      establecimientoTIF,
    }));
  }

  /**
   * Establece el nombre del solicitante.
   * @param nombre Nombre del solicitante.
   * @returns void
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
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
   * Establece los datos de la mercancía capturados.
   * @param capturaDatosMercancia Datos de la mercancía capturados.
   * @returns void
   */
  public setCapturaDatosMercancia(
    capturaDatosMercancia: string | number
  ): void {
    this.update((state) => ({
      ...state,
      capturaDatosMercancia,
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
   * Establece el tipo de movilización.
   * @param movilizacion Tipo de movilización.
   * @returns void
   */
  public setMovilizacion(movilizacion: number|string): void {
    this.update((state) => ({
      ...state,
      movilizacion,
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
   * Establece el nombre de la empresa.
   * @param nombreEmpresa Nombre de la empresa.
   * @returns void
   */
  public setNombreEmpresa(nombreEmpresa: number|string): void {
    this.update((state) => ({
      ...state,
      nombreEmpresa,
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
  public setBanco(banco: number|string): void {
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
   * Establece la fracción arancelaria de la mercancía.
   * @param fraccionArancelaria Fracción arancelaria de la mercancía.
   * @returns void
   */
  public setSaldoACapturar(saldoACapturar: string): void{
    this.update((state) => ({
      ...state,
      saldoACapturar,
    }));
  }

  /**
   * Restaura el estado al valor inicial.
   */
  public limpiarSeccion(): void {
    this.reset();
  }

  /**
   * Establece la mercancía en el estado.
   * @param mercanciaTablaDatos Datos de la mercancía.
   * @returns void
   */
  public setMercanciaTablaDatos(mercanciaTablaDatos: string[]): void {
    this.update((state) => ({
      ...state,
      mercanciaTablaDatos,
    }));
  }

  /**
   * Actualiza el estado de la solicitud con los nuevos datos proporcionados.
   * @param nuevoDatos Nuevos datos para actualizar el estado de la solicitud.
   */
  public setSagarpaState(nuevoDatos: Solicitud220501State): void {
    this.update(nuevoDatos);
  }

  /**
   * Establece si se debe mostrar la sección.
   * @param mostrarSeccion Indica si se debe mostrar la sección.
   * @returns void
   */
  public setMostrarSeccion(mostrarSeccion: boolean): void {
    this.update((state) => ({
      ...state,
      mostrarSeccion,
    }));
  }

  /**
   * Establece el certificado número.
   * @param certificadoNumero Certificado número.
   * @returns void
   */
  public setCertificadoNumero(certificadoNumero: string): void {
    this.update((state) => ({
      ...state,
      certificadoNumero,
    }));
  }

  /**
   * Establece el resultado del cálculo.
   * @param calculoResultado Resultado del cálculo.
   * @returns void
   */
  public setCalculoResultado(calculoResultado: string): void {
    this.update((state) => ({
      ...state,
      calculoResultado,
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
  }));
}

}
