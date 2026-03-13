import { DatosSolicitante, MercanciaFormulario, SolicitudFormulario } from '../models/autorizacion-importacion.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';


/**
 * Interfaz que define el estado del trámite 6402.
 * 
 * Esta interfaz contiene todas las propiedades necesarias para manejar el estado del trámite,
 * incluyendo datos del solicitante, formularios relacionados, y otros datos relevantes.
 */
export interface Tramite6402State {

  /**
   * Paso activo del trámite.
   * 
   * Representa el número del paso actual en el proceso del trámite.
   */
  pasoActivo: number;

  /**
   * Pestaña activa del trámite.
   * 
   * Representa el número de la pestaña actualmente activa en el proceso del trámite.
   */
  pestanaActiva: number;

  /**
   * Información del solicitante.
   * 
   * Contiene los datos personales y de contacto del solicitante del trámite.
   */
  datosSolicitante: DatosSolicitante;

  /**
   * Información del formulario de solicitud.
   */
  solicitudFormulario: SolicitudFormulario;

  /**
   * Información del formulario de mercancía.
   * 
   * Contiene los datos relacionados con la mercancía, como descripción, especificaciones,
   * marca, modelo, número de serie, número de parte, y tipo de mercancía.
   */
  mercanciaFormulario: MercanciaFormulario;

}
/**
 * Estado inicial del trámite 6402.
 * 
 * Esta función define el estado inicial del trámite, incluyendo datos del solicitante,
 * formulario de mercancías, formulario de domicilio, formulario de aviso, y otros datos relacionados.
 * 
 * @returns {Tramite6402State} El estado inicial del trámite.
 * 
 * 
 */
export function createInitialState(): Tramite6402State {
  return {
    pasoActivo: 1,
    pestanaActiva: 2,
    solicitudFormulario: {
      cveAduana: '',
      cveSeccionAduanal: '',
      cveRecintoFiscalizado: '',
      cveTipoDocumento: '',
      estadoTipoDocumento: '',
      aduana: '',
      patente: '',
      pedimento: '',
      folioImportacionTemporal: '',
      folioFormatoOficial: '',
      checkProrroga: false,
      folioOficialProrroga: '',
      fechaImportacionTemporal: '',
      fechaVencimiento: '',
      descMercancia: '',
      marca: '',
      modelo: '',
      numeroSerie: '',
      tipo: '',
      cveMedioTrasporte: '',
      guiaMaster: '',
      guiaBl: '',
      numeroBl: '',
      rfcEmpresaTransportista: '',
      estadoMedioTransporte: '',
      cartaPorte: '',
      cvePaisProcedencia: '',
      guiaHouse: '',
      numeroBuque: '',
      numeroEquipo: '',
      fechaCartaPorte: '',
      tipContenedor: '',
      tranporteMarca: '',
      tranporteModelo: '',
      tranportePlaca: '',
      observaciones: '',
      conDestino: '',
      cveTipoDestino: '',
      cveTipoDocumentoReemplazada: '',
      numeroActaDescruccion: '',
      cveAduanaDestino: '',
      cvePatenteDestino: '',
      cvePedimentoDestino: '',
      folioVucemRetorno: '',
      folioFormatoOficialDestino: '',
      fechaDescruccionDestino: '',
      estadoTipoDocumentoDestino: '',
      autoridadPresentoAvisoDestruccion: '',
      folioFormatoOficialTemporalDestino: '',
    },
    datosSolicitante: {
      rfc: "",
      denominacion: "",
      actividadEconomica: "",
      correoElectronico: "",
      pais: "",
      codigoPostal: "",
      horaDestruccion: "",
      fechaDestruccion: "",
      entidadFederativa: "",
      municipio: "",
      localidad: "",
      colonia: "",
      calle: "",
      nExt: "",
      nInt: "",
      lada: "",
      telefono: "",
      adace: "",
    },
    mercanciaFormulario: {
      modalDescMercancia: '',
      espeMercancia: '',
      marcaMercancia: '',
      modeloMercancia: '',
      numSerieMercancia: '',
      numParteMercancia: '',
      tipoMercancia: ''
    }
  };
}
/**
 * Store para gestionar el estado del trámite 6402.
 * 
 * Este store utiliza Akita para manejar el estado del trámite, permitiendo actualizar y consultar
 * diferentes propiedades relacionadas con el trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite6402', resettable: true })
export class Tramite6402Store extends Store<Tramite6402State> {

  /**
   * Constructor del store.
   * 
   * Inicializa el store con el estado inicial definido en `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
 * Actualiza el paso activo del trámite.
 * 
 * @param {number} pasoActivo - El número del paso activo.
 */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  /**
   * Actualiza la pestaña activa del trámite.
   * 
   * @param {number} pestanaActiva - El número de la pestaña activa.
   */
  public setPestanaActiva(pestanaActiva: number): void {
    this.update((state) => ({
      ...state,
      pestanaActiva,
    }));
  }

  /**
   * Actualiza los datos del solicitante en el estado.
   * 
   * @param {DatosSolicitante} datosSolicitante - Objeto que contiene los datos del solicitante.
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante
    }));
  }

  /**
   * Actualiza la clave de la aduana en el formulario de solicitud.
   * 
   * @param {string} cveAduana - La clave de la aduana a actualizar.
   */
  public setCveAduana(cveAduana: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveAduana },
    }));
  }

  /**
   * Actualiza la clave de la sección aduanal en el formulario de solicitud.
   * 
   * @param {string} cveSeccionAduanal - La clave de la sección aduanal a actualizar.
   */
  public setCveSeccionAduanal(cveSeccionAduanal: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveSeccionAduanal },
    }));
  }

  /**
   * Actualiza la clave del recinto fiscalizado en el formulario de solicitud.
   * 
   * @param {string} cveRecintoFiscalizado - La clave del recinto fiscalizado a actualizar.
   */
  public setCveRecintoFiscalizado(cveRecintoFiscalizado: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveRecintoFiscalizado },
    }));
  }

  /**
   * Actualiza la clave del tipo de documento en el formulario de solicitud.
   * 
   * @param {string} cveTipoDocumento - La clave del tipo de documento a actualizar.
   */
  public setCveTipoDocumento(cveTipoDocumento: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveTipoDocumento },
    }));
  }

  /**
   * Actualiza el estado del tipo de documento en el formulario de solicitud.
   * 
   * @param {string} estadoTipoDocumento - El estado del tipo de documento a actualizar.
   */
  public setEstadoTipoDocumento(estadoTipoDocumento: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, estadoTipoDocumento },
    }));
  }

  /**
   * Actualiza la aduana en el formulario de solicitud.
   * 
   * @param {string} aduana - La aduana a actualizar.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, aduana },
    }));
  }

  /**
   * Actualiza la patente en el formulario de solicitud.
   * 
   * @param {string} patente - La patente a actualizar.
   */
  public setPatente(patente: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, patente },
    }));
  }

  /**
   * Actualiza el pedimento en el formulario de solicitud.
   * 
   * @param {string} pedimento - El pedimento a actualizar.
   */
  public setPedimento(pedimento: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, pedimento },
    }));
  }

  /**
   * Actualiza el folio de importación temporal en el formulario de solicitud.
   * 
   * @param {string} folioImportacionTemporal - El folio de importación temporal a actualizar.
   */
  public setFolioImportacionTemporal(folioImportacionTemporal: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, folioImportacionTemporal },
    }));
  }

  /**
   * Actualiza el folio del formato oficial en el formulario de solicitud.
   * 
   * @param {string} folioFormatoOficial - El folio del formato oficial a actualizar.
   */
  public setFolioFormatoOficial(folioFormatoOficial: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, folioFormatoOficial },
    }));
  }

  /**
   * Actualiza el check de prórroga en el formulario de solicitud.
   * 
   * @param {boolean} checkProrroga - El valor del check de prórroga a actualizar.
   */
  public setCheckProrroga(checkProrroga: boolean): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, checkProrroga },
    }));
  }

  /**
   * Actualiza el folio oficial de prórroga en el formulario de solicitud.
   * 
   * @param {string} folioOficialProrroga - El folio oficial de prórroga a actualizar.
   */
  public setFolioOficialProrroga(folioOficialProrroga: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, folioOficialProrroga },
    }));
  }

  /**
   * Actualiza la fecha de importación temporal en el formulario de solicitud.
   * 
   * @param {string} fechaImportacionTemporal - La fecha de importación temporal a actualizar.
   */
  public setFechaImportacionTemporal(fechaImportacionTemporal: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, fechaImportacionTemporal },
    }));
  }

  /**
   * Actualiza la fecha de vencimiento en el formulario de solicitud.
   * 
   * @param {string} fechaVencimiento - La fecha de vencimiento a actualizar.
   */
  public setFechaVencimiento(fechaVencimiento: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, fechaVencimiento },
    }));
  }

  /**
   * Actualiza la descripción de la mercancía en el formulario de solicitud.
   * 
   * @param {string} descMercancia - La descripción de la mercancía a actualizar.
   */
  public setDescMercancia(descMercancia: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, descMercancia },
    }));
  }

  /**
   * Actualiza la marca en el formulario de solicitud.
   * 
   * @param {string} marca - La marca a actualizar.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, marca },
    }));
  }

  /**
   * Actualiza el modelo en el formulario de solicitud.
   * 
   * @param {string} modelo - El modelo a actualizar.
   */
  public setModelo(modelo: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, modelo },
    }));
  }

  /**
   * Actualiza el número de serie en el formulario de solicitud.
   * 
   * @param {string} numeroSerie - El número de serie a actualizar.
   */
  public setNumeroSerie(numeroSerie: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, numeroSerie },
    }));
  }

  /**
   * Actualiza el tipo en el formulario de solicitud.
   * 
   * @param {string} tipo - El tipo a actualizar.
   */
  public setTipo(tipo: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, tipo },
    }));
  }

  /**
   * Establece el valor de `cveMedioTrasporte` en el estado de la solicitud de formulario.
   *
   * @param cveMedioTrasporte - El código del medio de transporte que se desea establecer.
   */
  public setCveMedioTrasporte(cveMedioTrasporte: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveMedioTrasporte },
    }));
  }

  /**
   * Actualiza la guía master en el formulario de solicitud.
   * 
   * @param {string} guiaMaster - La guía master a actualizar.
   */
  public setGuiaMaster(guiaMaster: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, guiaMaster },
    }));
  }

  /**
   * Actualiza la guía BL en el formulario de solicitud.
   * 
   * @param {string} guiaBl - La guía BL a actualizar.
   */
  public setGuiaBl(guiaBl: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, guiaBl },
    }));
  }

  /**
   * Actualiza el número BL en el formulario de solicitud.
   * 
   * @param {string} numeroBl - El número BL a actualizar.
   */
  public setNumeroBl(numeroBl: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, numeroBl },
    }));
  }

  /**
   * Actualiza el RFC de la empresa transportista en el formulario de solicitud.
   * 
   * @param {string} rfcEmpresaTransportista - El RFC de la empresa transportista a actualizar.
   */
  public setRfcEmpresaTransportista(rfcEmpresaTransportista: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, rfcEmpresaTransportista },
    }));
  }

  /**
   * Actualiza el estado del medio de transporte en el formulario de solicitud.
   * 
   * @param {string} estadoMedioTransporte - El estado del medio de transporte a actualizar.
   */
  public setEstadoMedioTransporte(estadoMedioTransporte: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, estadoMedioTransporte },
    }));
  }

  /**
   * Actualiza la carta porte en el formulario de solicitud.
   * 
   * @param {string} cartaPorte - La carta porte a actualizar.
   */
  public setCartaPorte(cartaPorte: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cartaPorte },
    }));
  }

  /**
   * Actualiza la clave del país de procedencia en el formulario de solicitud.
   * 
   * @param {string} cvePaisProcedencia - La clave del país de procedencia a actualizar.
   */
  public setCvePaisProcedencia(cvePaisProcedencia: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cvePaisProcedencia },
    }));
  }

  /**
   * Actualiza la guía house en el formulario de solicitud.
   * 
   * @param {string} guiaHouse - La guía house a actualizar.
   */
  public setGuiaHouse(guiaHouse: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, guiaHouse },
    }));
  }

  /**
   * Actualiza el número de buque en el formulario de solicitud.
   * 
   * @param {string} numeroBuque - El número de buque a actualizar.
   */
  public setNumeroBuque(numeroBuque: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, numeroBuque },
    }));
  }

  /**
   * Actualiza el número de equipo en el formulario de solicitud.
   * 
   * @param {string} numeroEquipo - El número de equipo a actualizar.
   */
  public setNumeroEquipo(numeroEquipo: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, numeroEquipo },
    }));
  }

  /**
   * Actualiza la fecha de la carta porte en el formulario de solicitud.
   * 
   * @param {string} fechaCartaPorte - La fecha de la carta porte a actualizar.
   */
  public setFechaCartaPorte(fechaCartaPorte: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, fechaCartaPorte },
    }));
  }

  /**
   * Actualiza el tipo de contenedor en el formulario de solicitud.
   * 
   * @param {string} tipContenedor - El tipo de contenedor a actualizar.
   */
  public setTipContenedor(tipContenedor: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, tipContenedor },
    }));
  }

  /**
   * Actualiza la marca del transporte en el formulario de solicitud.
   * 
   * @param {string} tranporteMarca - La marca del transporte a actualizar.
   */
  public setTranporteMarca(tranporteMarca: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, tranporteMarca },
    }));
  }

  /**
   * Actualiza el modelo del transporte en el formulario de solicitud.
   * 
   * @param {string} tranporteModelo - El modelo del transporte a actualizar.
   */
  public setTranporteModelo(tranporteModelo: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, tranporteModelo },
    }));
  }

  /**
   * Actualiza la placa del transporte en el formulario de solicitud.
   * 
   * @param {string} tranportePlaca - La placa del transporte a actualizar.
   */
  public setTranportePlaca(tranportePlaca: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, tranportePlaca },
    }));
  }

  /**
   * Actualiza las observaciones en el formulario de solicitud.
   * 
   * @param {string} observaciones - Las observaciones a actualizar.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, observaciones },
    }));
  }

  /**
   * Actualiza el destino en el formulario de solicitud.
   * 
   * @param {string} conDestino - El destino a actualizar.
   */
  public setConDestino(conDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, conDestino },
    }));
  }

  /**
   * Actualiza la clave del tipo de destino en el formulario de solicitud.
   * 
   * @param {string} cveTipoDestino - La clave del tipo de destino a actualizar.
   */
  public setCveTipoDestino(cveTipoDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveTipoDestino },
    }));
  }

  /**
   * Actualiza la clave del tipo de documento reemplazada en el formulario de solicitud.
   * 
   * @param {string} cveTipoDocumentoReemplazada - La clave del tipo de documento reemplazada a actualizar.
   */
  public setCveTipoDocumentoReemplazada(cveTipoDocumentoReemplazada: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveTipoDocumentoReemplazada },
    }));
  }

  /**
   * Actualiza el número de acta de destrucción en el formulario de solicitud.
   * 
   * @param {string} numeroActaDescruccion - El número de acta de destrucción a actualizar.
   */
  public setNumeroActaDescruccion(numeroActaDescruccion: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, numeroActaDescruccion },
    }));
  }

  /**
   * Actualiza la clave de la aduana de destino en el formulario de solicitud.
   * 
   * @param {string} cveAduanaDestino - La clave de la aduana de destino a actualizar.
   */
  public setCveAduanaDestino(cveAduanaDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cveAduanaDestino },
    }));
  }

  /**
   * Actualiza la clave de la patente de destino en el formulario de solicitud.
   * 
   * @param {string} cvePatenteDestino - La clave de la patente de destino a actualizar.
   */
  public setCvePatenteDestino(cvePatenteDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cvePatenteDestino },
    }));
  }

  /**
   * Actualiza la clave del pedimento de destino en el formulario de solicitud.
   * 
   * @param {string} cvePedimentoDestino - La clave del pedimento de destino a actualizar.
   */
  public setCvePedimentoDestino(cvePedimentoDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, cvePedimentoDestino },
    }));
  }

  /**
   * Actualiza el folio VUCEM de retorno en el formulario de solicitud.
   * 
   * @param {string} folioVucemRetorno - El folio VUCEM de retorno a actualizar.
   */
  public setFolioVucemRetorno(folioVucemRetorno: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, folioVucemRetorno },
    }));
  }

  /**
   * Actualiza el folio del formato oficial de destino en el formulario de solicitud.
   * 
   * @param {string} folioFormatoOficialDestino - El folio del formato oficial de destino a actualizar.
   */
  public setFolioFormatoOficialDestino(folioFormatoOficialDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, folioFormatoOficialDestino },
    }));
  }

  /**
   * Actualiza la fecha de destrucción de destino en el formulario de solicitud.
   * 
   * @param {string} fechaDescruccionDestino - La fecha de destrucción de destino a actualizar.
   */
  public setFechaDescruccionDestino(fechaDescruccionDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, fechaDescruccionDestino },
    }));
  }

  /**
   * Actualiza el estado del tipo de documento de destino en el formulario de solicitud.
   * 
   * @param {string} estadoTipoDocumentoDestino - El estado del tipo de documento de destino a actualizar.
   */
  public setEstadoTipoDocumentoDestino(estadoTipoDocumentoDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, estadoTipoDocumentoDestino },
    }));
  }

  /**
   * Actualiza la autoridad que presentó el aviso de destrucción en el formulario de solicitud.
   * 
   * @param {string} autoridadPresentoAvisoDestruccion - La autoridad que presentó el aviso de destrucción a actualizar.
   */
  public setAutoridadPresentoAvisoDestruccion(autoridadPresentoAvisoDestruccion: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, autoridadPresentoAvisoDestruccion },
    }));
  }

  /**
   * Actualiza el modal de descripción de mercancía en el formulario de mercancía.
   * 
   * @param {string} modalDescMercancia - El modal de descripción de mercancía a actualizar.
   */
  public setModalDescMercancia(modalDescMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, modalDescMercancia },
    }));
  }

  /**
   * Actualiza la especificación de mercancía en el formulario de mercancía.
   * 
   * @param {string} espeMercancia - La especificación de mercancía a actualizar.
   */
  public setEspeMercancia(espeMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, espeMercancia },
    }));
  }

  /**
   * Actualiza la marca de mercancía en el formulario de mercancía.
   * 
   * @param {string} marcaMercancia - La marca de mercancía a actualizar.
   */
  public setMarcaMercancia(marcaMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, marcaMercancia },
    }));
  }

  /**
   * Actualiza el modelo de mercancía en el formulario de mercancía.
   * 
   * @param {string} modeloMercancia - El modelo de mercancía a actualizar.
   */
  public setModeloMercancia(modeloMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, modeloMercancia },
    }));
  }

  /**
   * Actualiza el número de serie de mercancía en el formulario de mercancía.
   * 
   * @param {string} numSerieMercancia - El número de serie de mercancía a actualizar.
   */
  public setNumSerieMercancia(numSerieMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, numSerieMercancia },
    }));
  }

  /**
   * Actualiza el número de parte de mercancía en el formulario de mercancía.
   * 
   * @param {string} numParteMercancia - El número de parte de mercancía a actualizar.
   */
  public setNumParteMercancia(numParteMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, numParteMercancia },
    }));
  }

  /**
   * Actualiza el tipo de mercancía en el formulario de mercancía.
   * 
   * @param {string} tipoMercancia - El tipo de mercancía a actualizar.
   */
  public setTipoMercancia(tipoMercancia: string): void {
    this.update((state) => ({
      ...state,
      mercanciaFormulario: { ...state.mercanciaFormulario, tipoMercancia },
    }));
  }
  /**
   * Actualiza el valor del folio del formato oficial temporal de destino en el formulario de solicitud.
   * 
   * @param {string} folioFormatoOficialTemporalDestino - El folio del formato oficial temporal de destino a actualizar.
   */

    public setFolioFormatoOficialTemporalDestino(folioFormatoOficialTemporalDestino: string): void {
    this.update((state) => ({
      ...state,
      solicitudFormulario: { ...state.solicitudFormulario, folioFormatoOficialTemporalDestino },
    }));
  }

  

}
