import { Personas, ResponsablesDespacho } from '../models/5701/servicios-extraordinarios.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 5701
 * @returns Solicitud5701
 */
export interface Solicitud5701State {
  /**
   * Identificador único de la solicitud.
   */
  idSolicitud: string;

  /**
   * Tipo de solicitud.
   */
  tipoSolicitud: string;

  /**
   * RFC del importador/exportador.
   */
  rfcImportExport: string;

  /**
   * Nombre del importador/exportador.
   */
  nombreImportExport: string;

  /**
   * Número de registro.
   */
  nroRegistro: string;

  /**
   * Programa de fomento asociado.
   */
  programaFomento: string;

  /**
   * IMMEX asociado.
   */
  immex: string;

  /**
   * Valor del IMMEX.
   */
  immexValue: string;

  /**
   * Industria automotriz asociada.
   */
  industriaAutomotriz: string;

  /**
   * Tipo de empresa certificada.
   */
  tipoEmpresaCertificada: string;

  /**
   * Identificador del socio comercial.
   */
  idSocioComercial: string;

  /**
   * Indica si hay un socio comercial asociado.
   */
  socioComercial: boolean;

  /**
   * Indica si hay una operación económica autorizada.
   */
  opEconomicoAut: boolean;

  /**
   * Indica si se requiere revisión de origen.
   */
  revisionOrigen: boolean;

  /**
   * Fecha de inicio de la solicitud.
   */
  fechaInicio: string;

  /**
   * Hora de inicio de la solicitud.
   */
  horaInicio: string;

  /**
   * Fecha de finalización de la solicitud.
   */
  fechaFinal: string;

  /**
   * Hora de finalización de la solicitud.
   */
  horaFinal: string;

  /**
   * Fechas seleccionadas para la solicitud.
   */
  fechasSeleccionadas: string[];

  /**
   * Despacho asociado a la solicitud.
   */
  despacho: string;

  /**
   * RFC de autorización.
   */
  rfcAutorizacion: string;

  /**
   * DDEX de autorización.
   */
  ddexAutorizacion: string;

  /**
   * Identificador de la aduana.
   */
  idAduana: string;

  /**
   * Descripción de la aduana.
   */
  descripcionAduana: string;

  /**
   * Identificador de la sección aduanera.
   */
  idSeccionAduanera: string;

  /**
   * Sección aduanera asociada.
   */
  seccionAduanera: string;

  /**
   * Nombre del recinto fiscal.
   */
  nombreRecinto: string;

  /**
   * Tipo de despacho.
   */
  tipoDespacho: string;

  /**
   * Tipo de operación.
   */
  tipoOperacion: string;

  /**
   * Patente asociada.
   */
  patente: string;

  /**
   * Indica si hay relación de sociedad.
   */
  relacionSociedad: boolean;

  /**
   * Indica si hay encargo conferido.
   */
  encargoConferido: boolean;

  /**
   * Domicilio asociado.
   */
  domicilio: string;

  /**
   * País de origen.
   */
  paisOrigen: number;

  /**
   * País de procedencia.
   */
  paisProcedencia: number;

  /**
   * Descripción de la solicitud.
   */
  descripcion: string;

  /**
   * Justificación de la solicitud.
   */
  justificacion: string;

  /**
   * Identificador del pedimento.
   */
  idPedimento: number;

  /**
   * Patente del pedimento.
   */
  patentePedimento: number;

  /**
   * Número del pedimento.
   */
  pedimento: string;

  /**
   * Aduana asociada al pedimento.
   */
  aduana: number;

  /**
   * Tipo de pedimento.
   */
  tipoPedimento: string;

  /**
   * Número asociado al pedimento.
   */
  numero: number;

  /**
   * Comprobante de valor asociado.
   */
  comprobanteValor: string;

  /**
   * Indica si el pedimento ha sido validado.
   */
  pedimentoValidado: boolean;

  /**
   * Lista de personas responsables del despacho.
   */
  personasResponsablesDespacho: ResponsablesDespacho[];

  /**
   * Lista de transportes asociados.
   */
  transporte: string[];

  /**
   * Monto a pagar.
   */
  montoPagar: string;

  /**
   * Línea de captura asociada.
   */
  lineaCaptura: string;

  /**
   * Monto modal asociado.
   */
  montoModal: string;

  /**
   * Lista de terceros relacionados.
   */
  tercerosRelacionados: Personas[];
}

/**
 * Crea el estado inicial para la solicitud 5701.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud5701State {
  return {
    idSolicitud: '',
    tipoSolicitud: '',
    rfcImportExport: '',
    nombreImportExport: '',
    nroRegistro: '',
    programaFomento: '',
    immex: '',
    immexValue: '',
    industriaAutomotriz: '',
    tipoEmpresaCertificada: '',
    idSocioComercial: '',
    socioComercial: false,
    opEconomicoAut: false,
    revisionOrigen: false,
    fechaInicio: '',
    horaInicio: '',
    fechaFinal: '',
    horaFinal: '',
    fechasSeleccionadas: [],
    despacho: '',
    rfcAutorizacion: '',
    ddexAutorizacion: '',
    idAduana: '',
    descripcionAduana: '',
    idSeccionAduanera: '',
    seccionAduanera: '',
    nombreRecinto: '',
    tipoDespacho: '',
    tipoOperacion: '',
    patente: '',
    relacionSociedad: false,
    encargoConferido: false,
    domicilio: '',
    paisOrigen: 0,
    paisProcedencia: 0,
    descripcion: '',
    justificacion: '',
    idPedimento: 0,
    patentePedimento: 0,
    pedimento: '',
    aduana: 0,
    tipoPedimento: '',
    numero: 0,
    comprobanteValor: '',
    pedimentoValidado: false,
    personasResponsablesDespacho: [],
    transporte: [],
    montoPagar: '',
    lineaCaptura: '',
    montoModal: '',
    tercerosRelacionados: [],
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite5701', resettable: true })
export class Tramite5701Store extends Store<Solicitud5701State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el tipo de solicitud en el estado.
   *
   * @param tipoSolicitud - El tipo de solicitud que se va a guardar.
   */
  public setTipoSolicitud(tipoSolicitud: string): void {
    this.update((state) => ({
      ...state,
      tipoSolicitud,
    }));
  }

  /**
   * @param rfcImportExport - RFC del importador/exportador.
   * @description Guarda el RFC del importador/exportador en el estado.
   */
  public setRfcImportExport(rfcImportExport: string): void {
    this.update((state) => ({
      ...state,
      rfcImportExport,
    }));
  }

  /**
   * 
   * @param nombreImportExport - Nombre del importador/exportador.
   * @description Guarda el nombre del importador/exportador en el estado.
   */
  public setNombreImportExport(nombreImportExport: string): void {
    this.update((state) => ({
      ...state,
      nombreImportExport,
    }));
  }

  /**
   * @param nroRegistro - Número de registro.
   * @description Guarda el número de registro en el estado.
   */
  public setNroRegistro(nroRegistro: string): void {
    this.update((state) => ({
      ...state,
      nroRegistro,
    }));
  }

  /**
   * @param programaFomento - Programa de fomento asociado.
   * @description Guarda el programa de fomento en el estado.
   */
  public setProgramaFomento(programaFomento: string): void {
    this.update((state) => ({
      ...state,
      programaFomento,
    }));
  }

  /**
   * 
   * @param immex - IMMEX asociado.
   * @description Guarda el IMMEX en el estado.
   */
  public setImmex(immex: string): void {
    this.update((state) => ({
      ...state,
      immex,
    }));
  }

  /**
   * 
   * @param immexValue - Valor del IMMEX.
   * @description Guarda el valor del IMMEX en el estado.
   */
  public setImmexValue(immexValue: string): void {
    this.update((state) => ({
      ...state,
      immexValue,
    }));
  }

  /**
   * 
   * @param industriaAutomotriz - Industria automotriz asociada.
   * @description Guarda la industria automotriz en el estado.
   */
  public setIndustriaAutomotriz(industriaAutomotriz: string): void {
    this.update((state) => ({
      ...state,
      industriaAutomotriz,
    }));
  }

  /**
   * 
   * @param tipoEmpresaCertificada - Tipo de empresa certificada.
   * @description Guarda el tipo de empresa certificada en el estado.
   */
  public setTipoEmpresaCertificada(tipoEmpresaCertificada: string | null): void {
    this.update((state) => ({
      ...state,
      tipoEmpresaCertificada: tipoEmpresaCertificada || '',
    }));
  }

  /**
   * 
   * @param idSocioComercial - Identificador del socio comercial.
   * @description Guarda el ID del socio comercial en el estado.
   */
  public setIdSocioComercial(idSocioComercial: string): void {
    this.update((state) => ({
      ...state,
      idSocioComercial,
    }));
  }
/**
 * 
 * @param socioComercial - Indica si hay un socio comercial asociado.
 * @description Guarda el estado del socio comercial en el estado.
 */
  public setSocioComercial(socioComercial: boolean): void {
    this.update((state) => ({
      ...state,
      socioComercial,
    }));
  }
/**
 * 
 * @param opEconomicoAut - Indica si hay una operación económica autorizada.
 * @description Guarda el estado de la operación económica autorizada en el estado.
 */
  public setOpEconomicoAut(opEconomicoAut: boolean): void {
    this.update((state) => ({
      ...state,
      opEconomicoAut,
    }));
  }
/**
 * 
 * @param revisionOrigen - Indica si se requiere revisión de origen.
 * @description Guarda el estado de la revisión de origen en el estado.
 */
  public setRevisionOrigen(revisionOrigen: boolean): void {
    this.update((state) => ({
      ...state,
      revisionOrigen,
    }));
  }

  /**
   * 
   * @param fechaInicio - Fecha de inicio de la solicitud.
   * @description Guarda la fecha de inicio en el estado.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio,
    }));
  }

  /**
   * 
   * @param horaInicio - Hora de inicio de la solicitud.
   * @description Guarda la hora de inicio en el estado.
   */
  public setHoraInicio(horaInicio: string): void {
    this.update((state) => ({
      ...state,
      horaInicio,
    }));
  }

  /**
   * 
   * @param fechaFinal - Fecha de finalización de la solicitud.
   * @description Guarda la fecha de finalización en el estado.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({
      ...state,
      fechaFinal,
    }));
  }

  /**
   * 
   * @param horaFinal - Hora de finalización de la solicitud.
   * @description Guarda la hora de finalización en el estado.
   */
  public setHoraFinal(horaFinal: string): void {
    this.update((state) => ({
      ...state,
      horaFinal,
    }));
  }

  /**
   * 
   * @param fechasSeleccionadas - Fechas seleccionadas para la solicitud.
   * @description Guarda las fechas seleccionadas en el estado.
   */
  public setFechasSeleccionadas(fechasSeleccionadas: string[]): void {
    this.update((state) => ({
      ...state,
      fechasSeleccionadas,
    }));
  }

  /**
   * 
   * @param despacho - Despacho asociado a la solicitud.
   * @description Guarda el despacho en el estado.
   */
  public setDespacho(despacho: string): void {
    this.update((state) => ({
      ...state,
      despacho,
    }));
  }

  /**
   * 
   * @param rfcAutorizacion - RFC de autorización.
   * @description Guarda el RFC de autorización en el estado.
   *    */
  public setRfcAutorizacion(rfcAutorizacion: string): void {
    this.update((state) => ({
      ...state,
      rfcAutorizacion,
    }));
  }

  /**
   * 
   * @param ddexAutorizacion - DDEX de autorización.
   * @description Guarda el DDEX de autorización en el estado.
   */
  public setDdexAutorizacion(ddexAutorizacion: string): void {
    this.update((state) => ({
      ...state,
      ddexAutorizacion,
    }));
  }

  /**
   * 
   * @param idAduana - Identificador de la aduana.
   * @description Guarda el ID de la aduana en el estado.
   */
  public setIdAduana(idAduana: string): void {
    this.update((state) => ({
      ...state,
      idAduana,
    }));
  }

  /**
   * 
   * @param descripcionAduana - Descripción de la aduana.
   * @description Guarda la descripción de la aduana en el estado.
   */
  public setDescripcionAduana(descripcionAduana: string): void {
    this.update((state) => ({
      ...state,
      descripcionAduana,
    }));
  }

  /**
   * 
   * @param idSeccionAduanera - Identificador de la sección aduanera.
   * @description Guarda el ID de la sección aduanera en el estado.
   */
  public setIdSeccionAduanera(idSeccionAduanera: string): void {
    this.update((state) => ({
      ...state,
      idSeccionAduanera,
    }));
  }

  /**
   * @description Guarda la sección aduanera en el estado.
   * @param seccionAduanera - Sección aduanera asociada.
   */
  public setSeccionAduanera(seccionAduanera: string): void {
    this.update((state) => ({
      ...state,
      seccionAduanera,
    }));
  }

  /**
   * @param nombreRecinto - Nombre del recinto fiscal.
   * @description Guarda el nombre del recinto fiscal en el estado.
   */
  public setNombreRecinto(nombreRecinto: string): void {
    this.update((state) => ({
      ...state,
      nombreRecinto,
    }));
  }

  /**
   * 
   * @param tipoDespacho - Tipo de despacho.
   * @description Guarda el tipo de despacho en el estado.
   */
  public setTipoDespacho(tipoDespacho: string): void {
    this.update((state) => ({
      ...state,
      tipoDespacho,
    }));
  }
/**
 * 
 * @param tipoOperacion - Tipo de operación.
 * @description Guarda el tipo de operación en el estado.
 */
  public setTipoOperacion(tipoOperacion: string): void {
    this.update((state) => ({
      ...state,
      tipoOperacion,
    }));
  }

  /**
   * 
   * @param patente - Patente asociada.
   * @description Guarda la patente en el estado.
   */
  public setPatente(patente: string): void {
    this.update((state) => ({
      ...state,
      patente,
    }));
  }

  /**
   * 
   * @param relacionSociedad - Indica si hay relación de sociedad.
   * @description Guarda el estado de la relación de sociedad en el estado.
   */
  public setRelacionSociedad(relacionSociedad: boolean): void {
    this.update((state) => ({
      ...state,
      relacionSociedad,
    }));
  }

  /**
   * 
   * @param encargoConferido - Indica si hay encargo conferido.
   * @description Guarda el estado del encargo conferido en el estado.
   */
  public setEncargoConferido(encargoConferido: boolean): void {
    this.update((state) => ({
      ...state,
      encargoConferido,
    }));
  }

  /**
   * 
   * @param domicilio - Domicilio asociado.
   * @description Guarda el domicilio en el estado.
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * 
   * @param paisOrigen - País de origen.
   * @description Guarda el país de origen en el estado.
   */
  public setPaisOrigen(paisOrigen: number): void {
    this.update((state) => ({
      ...state,
      paisOrigen,
    }));
  }
  /**
   * 
   * @param paisProcedencia - País de procedencia.
   * @description Guarda el país de procedencia en el estado.
   */
  public setPaisProcedencia(paisProcedencia: number): void {
    this.update((state) => ({
      ...state,
      paisProcedencia,
    }));
  }

  /**
   * 
   * @param descripcion - Descripción de la solicitud.
   * @description Guarda la descripción de la solicitud en el estado.
   */
  public setDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      descripcion,
    }));
  }

  /**
   * 
   * @param justificacion - Justificación de la solicitud.
   * @description Guarda la justificación de la solicitud en el estado.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * 
   * @param idPedimento - Identificador del pedimento.
   * @description Guarda el ID del pedimento en el estado.
   */
  public setidPedimento(idPedimento: number): void {
    this.update((state) => ({
      ...state,
      idPedimento,
    }));
  }

  /**
   * 
   * @param patentePedimento - Patente del pedimento.
   * @description Guarda la patente del pedimento en el estado.
   */
  public setPatentePedimento(patentePedimento: number): void {
    this.update((state) => ({
      ...state,
      patentePedimento,
    }));
  }

  /**
   * 
   * @param pedimento - Identificador del pedimento.
   * @description Guarda el pedimento en el estado. 
   */
  public setPedimento(pedimento: string): void {
    this.update((state) => ({
      ...state,
      pedimento,
    }));
  }
/**
 * 
 * @param aduana - Aduana asociada al pedimento.
 * @description Guarda la aduana en el estado.
 */
  public setAduana(aduana: number): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * 
   * @param tipoPedimento - Tipo de pedimento.
   * @description Guarda el tipo de pedimento en el estado.
   */
  public setTipoPedimento(tipoPedimento: string): void {
    this.update((state) => ({
      ...state,
      tipoPedimento,
    }));
  }
/**
 * 
 * @param numero - Número asociado al pedimento.
 * @description Guarda el número asociado al pedimento en el estado.
 */
  public setNumero(numero: number): void {
    this.update((state) => ({
      ...state,
      numero,
    }));
  }

  /**
   * 
   * @param comprobanteValor - Comprobante de valor asociado.
   * @description Guarda el comprobante de valor en el estado.
   */
  public setComprobanteValor(comprobanteValor: string): void {
    this.update((state) => ({
      ...state,
      comprobanteValor,
    }));
  }
  /**
   * 
   * @param pedimentoValidado - Indica si el pedimento ha sido validado.
   * @description Guarda el estado de validación del pedimento en el estado.
   */
  public setPedimentoValidado(pedimentoValidado: boolean): void {
    this.update((state) => ({
      ...state,
      pedimentoValidado,
    }));
  }
/**
 * 
 * @param personasResponsablesDespacho - Lista de personas responsables del despacho.
 * @description Guarda la lista de personas responsables del despacho en el estado.
 */
  public setPersonasResponsablesDespacho(
    personasResponsablesDespacho: ResponsablesDespacho[]
  ): void {
    this.update((state) => ({
      ...state,
      personasResponsablesDespacho,
    }));
  }

  /**
   * 
   * @param transporte - Lista de transportes asociados.
   * @description Guarda la lista de transportes en el estado.
   */
  public setTransporte(transporte: string[]): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }
  /**
   * 
   * @param montoPagar - Monto a pagar.
   * @description Guarda el monto a pagar en el estado.
   */
  public setMontoPagar(montoPagar: string): void {
    this.update((state) => ({
      ...state,
      montoPagar,
    }));
  }

  /**
   * 
   * @param lineaCaptura - Línea de captura asociada.
   * @description Guarda la línea de captura en el estado.
   */
  public setLineaCaptura(lineaCaptura: string): void {
    this.update((state) => ({
      ...state,
      lineaCaptura,
    }));
  }

  /**
   * 
   * @param montoModal - Monto modal asociado.
   * @description Guarda el monto modal en el estado.
   */
  public setMonto(montoModal: string): void {
    this.update((state) => ({
      ...state,
      montoModal,
    }));
  }

  /**
   * 
   * @param tercerosRelacionados - Lista de terceros relacionados.
   * @description Guarda la lista de terceros relacionados en el estado.
   */
  public setTercerosRelacionados(tercerosRelacionados: Personas[]): void {
    this.update((state) => ({
      ...state,
      tercerosRelacionados,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
