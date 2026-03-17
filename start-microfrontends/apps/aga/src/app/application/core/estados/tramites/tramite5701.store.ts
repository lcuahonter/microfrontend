import {
  Pedimento,
  ResponsablesDespacho,
} from '../../models/5701/tramite5701.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { LineaCaptura } from '../../models/5701/linea-captura.model';
import { Patente } from '../../models/5701/Patente.model';
import { TransporteDespacho } from '@ng-mf/data-access-user';

/**
 * Creacion del estado inicial para la interfaz de tramite 5701
 * @returns Solicitud5701
 */
export interface Solicitud5701State {
  idSolicitud: number | null;
  folioFirma: string;
  tipoSolicitud: number;
  descripcionTipoSolicitud: string;

  RFCImportadorExportador: string;
  rfcGenerico: boolean;
  nombre: string;
  descripcionNumeroRegistro: string;

  programa: boolean;
  descripcionProgramaFomento: string;
  blnProgramaFomento: boolean;

  /**
   * @description IMMEX: Industria Manufacturera, Maquiladora y de Servicios de Exportación
   */
  checkIMMEX: boolean;
  descripcionImmex: string;
  blnImmex: boolean;

  industriaAutomotriz: boolean;
  descripcionIndustrialAutomotriz: string;
  blnIndustriaAutomotriz: boolean;

  tipoEmpresaCertificada: string;
  idSocioComercial: string;
  socioComercial: boolean;
  blnSocioComercial: boolean;
  certificacionOEA: boolean;
  revision: boolean;
  blnRevisionOrigen: boolean;
  blnCertificacionA: string;
  blnCertificacionAA: string;
  blnCertificacionAAA: string;
  blnOEA: boolean;

  fechaInicio: string;
  horaInicio: string;
  fechaFinal: string;
  horaFinal: string;
  fechasSeleccionadas: string[];

  despacho: string;

  /**
   * @description LDA: Autrización para operar por un Ligar Distinto a la Aduana.
   */
  lda: boolean;
  autorizacionLDA: string;

  dd: boolean;
  autorizacionDDEX: string;

  idAduanaDespacho: string;
  aduanaDespacho: string;
  idSeccionDespacho: string;
  seccionAduanera: string;
  nombreRecinto: string;
  tipoDespacho: number;
  descripcionTipoDespacho: string;
  tipoOperacion: string;
  patente: Patente;
  patenteApoderado: Patente[];
  relacionSociedad: boolean;
  encargoConferido: boolean;
  domicilioDespacho: string;
  especifique: string;

  paisOrigen: string;
  paisProcedencia: string;
  descripcionGenerica: string;
  justificacion: string;

  pedimentos: Pedimento[];

  personasResponsablesDespacho: ResponsablesDespacho[];

  tipoTransporte: string;
  transporte: TransporteDespacho[];

  tipoTransporteArriboSalida: string;
  transporteArriboDatos: TransporteDespacho[];
  montoPagar: string;
  lineaCaptura: string;
  monto: string;
  lineasCaptura: LineaCaptura[];
  isMontoAceptable: boolean;
  rangoFechas: boolean;
  selectRangoDias: string[];
}

export interface Tercero5701State {
  nombreTercero: string;
  correoTercero: string;
}
export interface Terceros5701State {
  terceros: Tercero5701State[];
}

export function createInitialState(): Solicitud5701State {
  return {
    idSolicitud: 0,
    folioFirma: '',
    descripcionTipoSolicitud: '',
    tipoSolicitud: -1,
    RFCImportadorExportador: '',
    rfcGenerico: false,
    nombre: '',
    descripcionNumeroRegistro: '',
    programa: false,
    descripcionProgramaFomento: '',
    blnProgramaFomento: false,
    checkIMMEX: false,
    descripcionImmex: '',
    industriaAutomotriz: false,
    descripcionIndustrialAutomotriz: '',
    blnIndustriaAutomotriz: false,
    tipoEmpresaCertificada: '',
    idSocioComercial: '',
    socioComercial: false,
    blnImmex: false,
    blnSocioComercial: false,
    certificacionOEA: false,
    revision: false,
    blnRevisionOrigen: false,
    blnCertificacionA: '',
    blnCertificacionAA: '',
    blnCertificacionAAA: '',
    blnOEA: false,
    fechaInicio: '',
    horaInicio: '',
    fechaFinal: '',
    horaFinal: '',
    fechasSeleccionadas: [],
    despacho: '',
    lda: false,
    autorizacionLDA: '',
    dd: false,
    autorizacionDDEX: '',
    idAduanaDespacho: '-1',
    aduanaDespacho: '',
    idSeccionDespacho: '-1',
    seccionAduanera: '',
    nombreRecinto: '-1',
    tipoDespacho: -1,
    descripcionTipoDespacho: '',
    tipoOperacion: '-1',
    patente: {} as Patente,
    patenteApoderado: [],
    relacionSociedad: false,
    encargoConferido: false,
    domicilioDespacho: '',
    especifique: '',
    paisOrigen: '',
    paisProcedencia: '',
    descripcionGenerica: '',
    justificacion: '',
    pedimentos: [],
    personasResponsablesDespacho: [],
    tipoTransporte: '',
    transporte: [],
    tipoTransporteArriboSalida: '',
    transporteArriboDatos: [],
    montoPagar: '',
    lineaCaptura: '',
    monto: '',
    lineasCaptura: [],
    isMontoAceptable: false,
    rangoFechas: false,
    selectRangoDias: [],
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
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Guarda el tipo de solicitud en el estado.
   *
   * @param tipoSolicitud - El tipo de solicitud que se va a guardar.
   */
  public setTipoSolicitud(tipoSolicitud: number): void {
    this.update((state) => ({
      ...state,
      tipoSolicitud,
    }));
  }

  /**
 * Guarda el folio de la firma en el estado.
 * @param folioFirma - El folio de la firma que se va a guardar.
 */
  public setFolioFirma(folioFirma: string): void {
    this.update((state) => ({
      ...state,
      folioFirma,
    }));
  }

  /**
   * Guarda la descripción del tipo de solicitud en el estado.
   *
   * @param descripcionTipoSolicitud - La descripción del tipo de solicitud que se va a guardar.
   */
  public setDescripcionTipoSolicitud(descripcionTipoSolicitud: string): void {
    this.update((state) => ({
      ...state,
      descripcionTipoSolicitud,
    }));
  }

  /**
   * Guarda el RFC del importador/exportador en el estado.
   *
   * @param RFCImportadorExportador - El RFC del importador/exportador que se va a guardar.
   */
  public setRFCImportadorExportador(RFCImportadorExportador: string): void {
    this.update((state) => ({
      ...state,
      RFCImportadorExportador,
    }));
  }

  /**
   * Guarda la certificacion IMMEX en el estado.
   *
   * @param blnImmex - El valor booleano que indica si esta certificado o no.
   */
  public setBlnImmex(blnImmex: boolean): void {
    this.update((state) => ({
      ...state,
      blnImmex,
    }));
  }

  /**
   * Guarda el RFC generico en el estado.
   *
   * @param rfcGenerico - El valor booleano que indica si es un RFC generico o no.
   */
  public setRfcGenerico(rfcGenerico: boolean): void {
    this.update((state) => ({
      ...state,
      rfcGenerico,
    }));
  }

  /**
   * Guarda el nombre en el estado.
   *
   * @param nombre - El nombre que se va a guardar.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Guarda la descripcion del numero de registro en el estado.
   *
   * @param descripcionNumeroRegistro - La descripcion del numero de registro que se va a guardar.
   */
  public setDescripcionNumeroRegistro(descripcionNumeroRegistro: string): void {
    this.update((state) => ({
      ...state,
      descripcionNumeroRegistro,
    }));
  }

  /**
   * Guarda el programa en el estado.
   *
   * @param programa - El valor booleano que indica si es un programa o no.
   */
  public setPrograma(programa: boolean): void {
    this.update((state) => ({
      ...state,
      programa,
    }));
  }

  /**
   * Guarda la descripcion del programa de fomento en el estado.
   *
   * @param descripcionProgramaFomento - La descripcion del programa de fomento que se va a guardar.
   */
  public setDescripcionProgramaFomento(
    descripcionProgramaFomento: string
  ): void {
    this.update((state) => ({
      ...state,
      descripcionProgramaFomento,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de fomento o no.
   *
   * @param blnProgramaFomento - El valor booleano que indica si es un programa de fomento o no.
   */
  public setBlnProgramaFomento(blnProgramaFomento: boolean): void {
    this.update((state) => ({
      ...state,
      blnProgramaFomento,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa IMMEX o no.
   *
   * @param checkIMMEX - El valor booleano que indica si es un programa IMMEX o no.
   */
  public setCheckIMMEX(checkIMMEX: boolean): void {
    this.update((state) => ({
      ...state,
      checkIMMEX,
    }));
  }

  /**
   * Guarda la descripcion del programa IMMEX en el estado.
   *
   * @param descripcionImmex - La descripcion del programa IMMEX que se va a guardar.
   */
  public setDescripcionImmex(descripcionImmex: string): void {
    this.update((state) => ({
      ...state,
      descripcionImmex,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de industria automotriz o no.
   *
   * @param industriaAutomotriz - El valor booleano que indica si es un programa de industria automotriz o no.
   */
  public setIndustriaAutomotriz(industriaAutomotriz: boolean): void {
    this.update((state) => ({
      ...state,
      industriaAutomotriz,
    }));
  }

  /**
   * Guarda la descripcion del programa de industria automotriz en el estado.
   *
   * @param descripcionIndustrialAutomotriz - La descripcion del programa de industria automotriz que se va a guardar.
   */
  public setDescripcionIndustriaAutomotriz(
    descripcionIndustrialAutomotriz: string
  ): void {
    this.update((state) => ({
      ...state,
      descripcionIndustrialAutomotriz,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de industria automotriz o no.
   *
   * @param blnIndustriaAutomotriz - El valor booleano que indica si es un programa de industria automotriz o no.
   */
  public setBlnIndustriaAutomotriz(blnIndustriaAutomotriz: boolean): void {
    this.update((state) => ({
      ...state,
      blnIndustriaAutomotriz,
    }));
  }

  /**
   * Guarda el tipo de empresa certificada en el estado.
   *
   * @param tipoEmpresaCertificada - El tipo de empresa certificada que se va a guardar.
   */
  public setTipoEmpresaCertificada(tipoEmpresaCertificada: string): void {
    this.update((state) => ({
      ...state,
      tipoEmpresaCertificada,
    }));
  }

  /**
   * Guarda el ID del socio comercial en el estado.
   *
   * @param idSocioComercial - El ID del socio comercial que se va a guardar.
   */
  public setIdSocioComercial(idSocioComercial: string): void {
    this.update((state) => ({
      ...state,
      idSocioComercial,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un socio comercial o no.
   *
   * @param socioComercial - El valor booleano que indica si es un socio comercial o no.
   */
  public setSocioComercial(socioComercial: boolean): void {
    this.update((state) => ({
      ...state,
      socioComercial,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un socio comercial o no.
   *
   * @param blnSocioComercial - El valor booleano que indica si es un socio comercial o no.
   */
  public setBlnSocioComercial(blnSocioComercial: boolean): void {
    this.update((state) => ({
      ...state,
      blnSocioComercial,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion OEA o no.
   *
   * @param certificacionOEA - El valor booleano que indica si es un programa de certificacion OEA o no.
   */
  public setCertificacionOEA(certificacionOEA: boolean): void {
    this.update((state) => ({
      ...state,
      certificacionOEA,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion OEA o no.
   *
   * @param revision - El valor booleano que indica si es un programa de certificacion OEA o no.
   */
  public setRevision(revision: boolean): void {
    this.update((state) => ({
      ...state,
      revision,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion OEA o no.
   *
   * @param blnRevisionOrigen - El valor booleano que indica si es un programa de certificacion OEA o no.
   */
  public setBlnRevisionOrigen(blnRevisionOrigen: boolean): void {
    this.update((state) => ({
      ...state,
      blnRevisionOrigen,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion A o no.
   *
   * @param blnCertificacionA - El valor booleano que indica si es un programa de certificacion A o no.
   */
  public setBlnCertificacionA(blnCertificacionA: string): void {
    this.update((state) => ({
      ...state,
      blnCertificacionA,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion AA o no.
   *
   * @param blnCertificacionAA - El valor booleano que indica si es un programa de certificacion AA o no.
   */
  public setBlnCertificacionAA(blnCertificacionAA: string): void {
    this.update((state) => ({
      ...state,
      blnCertificacionAA,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion AAA o no.
   *
   * @param blnCertificacionAAA - El valor booleano que indica si es un programa de certificacion AAA o no.
   */
  public setBlnCertificacionAAA(blnCertificacionAAA: string): void {
    this.update((state) => ({
      ...state,
      blnCertificacionAAA,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de certificacion OEA o no.
   *
   * @param blnOEA - El valor booleano que indica si es un programa de certificacion OEA o no.
   */
  public setBlnOEA(blnOEA: boolean): void {
    this.update((state) => ({
      ...state,
      blnOEA,
    }));
  }

  /**
   * Guarda la fecha de inicio en el estado.
   *
   * @param fechaInicio - La fecha de inicio que se va a guardar.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio,
    }));
  }

  /**
   * Guarda la hora de inicio en el estado.
   *
   * @param horaInicio - La hora de inicio que se va a guardar.
   */
  public setHoraInicio(horaInicio: string): void {
    this.update((state) => ({
      ...state,
      horaInicio,
    }));
  }

  /**
   * Guarda la fecha final en el estado.
   *
   * @param fechaFinal - La fecha final que se va a guardar.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({
      ...state,
      fechaFinal,
    }));
  }

  /**
   * Guarda la hora final en el estado.
   *
   * @param horaFinal - La hora final que se va a guardar.
   */
  public setHoraFinal(horaFinal: string): void {
    this.update((state) => ({
      ...state,
      horaFinal,
    }));
  }

  /**
   * Guarda el rango de fechas en el estado.
   *
   * @param rangoFechas - El valor booleano que indica si es un rango de fechas o no.
   */
  public setFechasSeleccionadas(fechasSeleccionadas: string[]): void {
    this.update((state) => ({
      ...state,
      fechasSeleccionadas,
    }));
  }

  /**
   * Guarda el despacho en el estado.
   *
   * @param despacho - El despacho que se va a guardar.
   */
  public setDespacho(despacho: string): void {
    this.update((state) => ({
      ...state,
      despacho,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de LDA o no.
   *
   * @param lda - El valor booleano que indica si es un programa de LDA o no.
   */
  public setLDA(lda: boolean): void {
    this.update((state) => ({
      ...state,
      lda,
    }));
  }

  /**
   * Guarda la autorizacion LDA en el estado.
   *
   * @param autorizacionLDA - La autorizacion LDA que se va a guardar.
   */
  public setAutorizacionLDA(autorizacionLDA: string): void {
    this.update((state) => ({
      ...state,
      autorizacionLDA,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un programa de DD o no.
   *
   * @param dd - El valor booleano que indica si es un programa de DD o no.
   */
  public setDD(dd: boolean): void {
    this.update((state) => ({
      ...state,
      dd,
    }));
  }

  /**
   * Guarda la autorizacion DD en el estado.
   *
   * @param autorizacionDDEX - La autorizacion DD que se va a guardar.
   */
  public setAutorizacionDDEX(autorizacionDDEX: string): void {
    this.update((state) => ({
      ...state,
      autorizacionDDEX,
    }));
  }

  /**
   * Guarda el ID de la aduana de despacho en el estado.
   *
   * @param idAduanaDespacho - El ID de la aduana de despacho que se va a guardar.
   */
  public setIdAduanaDespacho(idAduanaDespacho: string): void {
    this.update((state) => ({
      ...state,
      idAduanaDespacho,
    }));
  }

  /**
   * Guarda la aduana de despacho en el estado.
   *
   * @param aduanaDespacho - La aduana de despacho que se va a guardar.
   */
  public setAduanaDespacho(aduanaDespacho: string): void {
    this.update((state) => ({
      ...state,
      aduanaDespacho,
    }));
  }

  /**
   * Guarda el ID de la seccion de despacho en el estado.
   *
   * @param idSeccionDespacho - El ID de la seccion de despacho que se va a guardar.
   */
  public setIdSeccionDespacho(idSeccionDespacho: string): void {
    this.update((state) => ({
      ...state,
      idSeccionDespacho,
    }));
  }

  /**
   * Guarda la seccion aduanera en el estado.
   *
   * @param seccionAduanera - La seccion aduanera que se va a guardar.
   */
  public setSeccionAduanera(seccionAduanera: string): void {
    this.update((state) => ({
      ...state,
      seccionAduanera,
    }));
  }

  /**
   * Guarda el nombre del recinto en el estado.
   *
   * @param nombreRecinto - El nombre del recinto que se va a guardar.
   */
  public setNombreRecinto(nombreRecinto: string): void {
    this.update((state) => ({
      ...state,
      nombreRecinto,
    }));
  }

  /**
   * Guarda el tipo de despacho en el estado.
   *
   * @param tipoDespacho - El tipo de despacho que se va a guardar.
   */
  public setTipoDespacho(tipoDespacho: number): void {
    this.update((state) => ({
      ...state,
      tipoDespacho,
    }));
  }

  /**
   * Guarda la descripcion del tipo de despacho en el estado.
   *
   * @param descripcionTipoDespacho - La descripcion del tipo de despacho que se va a guardar.
   */
  public setDescripcionTipoDespacho(descripcionTipoDespacho: string): void {
    this.update((state) => ({
      ...state,
      descripcionTipoDespacho,
    }));
  }

  /**
   * Guarda el tipo de operacion en el estado.
   *
   * @param tipoOperacion - El tipo de operacion que se va a guardar.
   */
  public setTipoOperacion(tipoOperacion: string): void {
    this.update((state) => ({
      ...state,
      tipoOperacion,
    }));
  }

  /**
   * Guarda la patente en el estado.
   *
   * @param patente - La patente que se va a guardar.
   */
  public setPatente(patente: Patente): void {
    this.update((state) => ({
      ...state,
      patente,
    }));
  }

  /**
   * Guarda la patente del apoderado en el estado.
   *
   * @param patenteApoderado - La patente del apoderado que se va a guardar.
   */
  public setPatenteApoderado(patenteApoderado: Patente[]): void {
    this.update((state) => ({
      ...state,
      patenteApoderado,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es una relacion de sociedad o no.
   *
   * @param relacionSociedad - El valor booleano que indica si es una relacion de sociedad o no.
   */
  public setRelacionSociedad(relacionSociedad: boolean): void {
    this.update((state) => ({
      ...state,
      relacionSociedad,
    }));
  }

  /**
   * Guarda el valor booleano que indica si es un encargo conferido o no.
   *
   * @param encargoConferido - El valor booleano que indica si es un encargo conferido o no.
   */
  public setEncargoConferido(encargoConferido: boolean): void {
    this.update((state) => ({
      ...state,
      encargoConferido,
    }));
  }

  /**
   * Guarda el domicilio de despacho en el estado.
   *
   * @param domicilioDespacho - El domicilio de despacho que se va a guardar.
   */
  public setDomicilioDespacho(domicilioDespacho: string): void {
    this.update((state) => ({
      ...state,
      domicilioDespacho,
    }));
  }

  /**
   * Guarda la descripción del domilicio especificado.
   *
   * @param especifique - Domicilio especificado.
   */
  public setEspecifique(especifique: string): void {
    this.update((state) => ({
      ...state,
      especifique,
    }));
  }

  /**
   * Guarda el pais de origen en el estado.
   *
   * @param paisOrigen - El pais de origen que se va a guardar.
   */
  public setPaisOrigen(paisOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisOrigen,
    }));
  }

  /**
   * Guarda el pais de procedencia en el estado.
   *
   * @param paisProcedencia - El pais de procedencia que se va a guardar.
   */
  public setPaisProcedencia(paisProcedencia: string): void {
    this.update((state) => ({
      ...state,
      paisProcedencia,
    }));
  }

  /**
   * Guarda la descripcion generica en el estado.
   *
   * @param descripcionGenerica - La descripcion generica que se va a guardar.
   */
  public setDescripcionGenerica(descripcionGenerica: string): void {
    this.update((state) => ({
      ...state,
      descripcionGenerica,
    }));
  }

  /**
   * Guarda la justificacion en el estado.
   *
   * @param justificacion - La justificacion que se va a guardar.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * Guarda el pedimento en el estado.
   *
   * @param pedimentos - El pedimento que se va a guardar.
   */
  public setPedimentos(pedimentos: Pedimento[]): void {
    this.update((state) => ({
      ...state,
      pedimentos,
    }));
  }

  /**
   * Guarda la lista de personas responsables de despacho en el estado.
   * @param personasResponsablesDespacho - Lista de personas responsables de despacho.
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
   * Guarda el tipo de transporte en el estado.
   *
   * @param tipoTransporte - El tipo de transporte que se va a guardar.
   */
  public setTipoTransporte(tipoTransporte: string): void {
    this.update((state) => ({
      ...state,
      tipoTransporte,
    }));
  }

  /**
   * Guarda el transporte en el estado.
   *
   * @param transporte - El transporte que se va a guardar.
   */
  public setTransporte(transporte: TransporteDespacho[]): void {
    this.update((state) => ({
      ...state,
      transporte: Array.isArray(transporte) ? transporte : [transporte],
    }));
  }

  /**
   * Guarda el tipo de transporte de arribo/salida en el estado.
   *
   * @param tipoTransporteArriboSalida - El tipo de transporte de arribo/salida que se va a guardar.
   */
  public setTipoTransporteArriboSalida(
    tipoTransporteArriboSalida: string
  ): void {
    this.update((state) => ({
      ...state,
      tipoTransporteArriboSalida,
    }));
  }

  /**
   * Guarda el transporte de arribo/salida en el estado.
   *
   * @param transporteArriboDatos - El transporte de arribo/salida que se va a guardar.
   */
  public setTransporteArriboDatos(
    transporteArriboDatos: TransporteDespacho[]
  ): void {
    this.update((state) => ({
      ...state,
      transporteArriboDatos: Array.isArray(transporteArriboDatos)
        ? transporteArriboDatos
        : [transporteArriboDatos],
    }));
  }

  /**
   * Guarda el monto a pagar en el estado.
   *
   * @param montoPagar - El monto a pagar que se va a guardar.
   */
  public setMontoPagar(montoPagar: string): void {
    this.update((state) => ({
      ...state,
      montoPagar,
    }));
  }

  /**
   * Guarda la linea de captura en el estado.
   *
   * @param lineaCaptura - La linea de captura que se va a guardar.
   */
  public setLineaCaptura(lineaCaptura: string): void {
    this.update((state) => ({
      ...state,
      lineaCaptura,
    }));
  }

  /**
   * Guarda el monto en el estado.
   *
   * @param monto - El monto que se va a guardar.
   */
  public setMonto(monto: string): void {
    this.update((state) => ({
      ...state,
      monto,
    }));
  }

  /**
   * Guarda el valor booleano que indica si el monto es aceptable o no.
   *
   * @param isMontoAceptable - El valor booleano que indica si el monto es aceptable o no.
   */
  public setIsMontoAceptable(isMontoAceptable: boolean): void {
    this.update((state) => ({
      ...state,
      isMontoAceptable,
    }));
  }

  /**
   * Guarda las lineas de captura en el estado.
   */
  public setLineasCaptura(lineasCaptura: LineaCaptura[]): void {
    this.update((state) => ({
      ...state,
      lineasCaptura: Array.isArray(lineasCaptura)
        ? lineasCaptura
        : [lineasCaptura],
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
