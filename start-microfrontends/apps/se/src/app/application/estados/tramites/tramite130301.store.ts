import { Store, StoreConfig } from '@datorama/akita';
import { CertificadoKimberleyForma } from '@libs/shared/data-access-user/src/core/models/130301/solicitud-prorroga.model';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de Solicitud260211.
 */
export interface Solicitud130301State {
  /**
   * ID de la solicitud asociada al trámite.
   */
  idSolicitud: number;

  /**
   * El valor de partidasIdSolicitud.
   */
  partidasIdSolicitud?: string;

  /**
   * El valor de numeroFolioTramiteOriginal.
   */
  numeroFolioTramiteOriginal?: string;

  folio_tramite?: string;

  /**
   * El valor de solicitudOpcion.
   */
  solicitudOpcion?: string;

  /**
   * El valor de regimen.
   */
  regimen?: string;

  /**
   * El valor de clasificacionDelRegimen.
   */
  clasificacionDelRegimen?: string;

  /**
   * El valor de productoOpcion.
   */
  productoOpcion?: string;

  /**
   * El valor de descripcionMercancia.
   */
  descripcionMercancia?: string;

  /**
   * El valor de fraccionArancelaria.
   */
  fraccionArancelaria?: string;

  /**
   * El valor de umt.
   */
  umt?: string;

  /**
   * El valor de cantidad.
   */
  cantidad?: string;

  /**
   * El valor de valorFactura.
   */
  valorFactura?: string;

  /**
   * El valor de pais.
   */
  pais?: string;

  /**
   * El valor de usoEspecifico.
   */
  usoEspecifico?: string;

  /**
   * El valor de justificacionImportacionExportacion.
   */
  justificacionImportacionExportacion?: string;

  /**
   * El valor de observaciones.
   */
  observaciones?: string;

  /**
   * El valor de fechaInicioProrroga.
   */
  fechaInicioProrroga?: string;

  /**
   * El valor de fechaFinProrroga.
   */
  fechaFinProrroga?: string;

  /**
   * El valor de cantidadProrroga.
   */
  cantidadProrroga?: string;

  /**
   * El valor de representacionFederal.
   */
  representacionFederal?: string;

  /**
   * El valor de folioPermiso.
   */
  folioPermiso: string;

  /**
   * El valor de paisEmisorCertificado.
   */
  paisEmisorCertificado: string;
  /**
   * El valor de mixed.
   */
  mixed: boolean;
  /**
   * El valor de paisDeOrigen.
   */
  paisDeOrigen: string;
  /**
   * El valor de motivoJustificacion.
   */
  motivoJustificacion: string;
  /**
   * El valor de otrasDeclaraciones.
   */
  otrasDeclaraciones: string;

  /**
   * El valor de certificadoKimberleyForma.
   */
  certificadoKimberleyForma?: CertificadoKimberleyForma;

  /**
   * Estatus de la solicitud.
   */
  estatusSolicitud?: string;

  /**
   * RFC de inicio de sesión.
   * @type {string}
   */
  loginRfc: string;
}
/**
 * Función para crear el estado inicial de Solicitud130301State.
 * @returns {Solicitud130301State} El estado inicial de Solicitud130301State.
 */
export function createInitialState(): Solicitud130301State {
  return {
    /**
     * ID de la solicitud asociada al trámite.
     */
    idSolicitud: 0,

    /**
     * El valor de partidasIdSolicitud.
     */
    partidasIdSolicitud: '',

    /**
     * El valor de numeroFolioTramiteOriginal.
     */
    numeroFolioTramiteOriginal: '',

    folio_tramite:'',

    /**
     * El valor de solicitudOpcion.
     */
    solicitudOpcion: '',

    /**
     * El valor de regimen.
     */
    regimen: '',

    /**
     * El valor de clasificacionDelRegimen.
     */
    clasificacionDelRegimen: '',

    /**
     * El valor de productoOpcion.
     */
    productoOpcion: '',

    /**
     * El valor de descripcionMercancia.
     */
    descripcionMercancia: '',

    /**
     * El valor de fraccionArancelaria.
     */
    fraccionArancelaria: '',

    /**
     * El valor de umt.
     */
    umt: '',

    /**
     * El valor de cantidad.
     */
    cantidad: '',

    /**
     * El valor de valorFactura.
     */
    valorFactura: '',

    /**
     * El valor de pais.
     */
    pais: '',

    /**
     * El valor de usoEspecifico.
     */
    usoEspecifico: '',

    /**
     * El valor de justificacionImportacionExportacion.
     */
    justificacionImportacionExportacion: '',

    /**
     * El valor de observaciones.
     */
    observaciones: '',

    /**
     * El valor de fechaInicioProrroga.
     */
    fechaInicioProrroga: '',

    /**
     * El valor de fechaFinProrroga.
     */
    fechaFinProrroga: '',

    /**
     * El valor de cantidadProrroga.
     */
    cantidadProrroga: '',

    /**
     * El valor de representacionFederal.
     */
    representacionFederal: '',

    /**
     * El valor de certificadoKimberleyForma.
     */
    certificadoKimberleyForma: {
      certificadosEmitidos: '',
      numeroCertificadokimberley: '',
      nombreIngles: '',
      nombreExportador: '',
      direccionExportador: '',
      nombreImportador: '',
      direccionImportador: '',
      numeroEnLetra: '',
      numeroEnLetraIngles: '',
      numeroFactura: '',
      cantidadQuilates: '',
      valorDiamantes: '',
      paisEmisorCertificado: '',
      mixed: false,
      paisDeOrigen: '',
    },

    /**
     * El valor de folioPermiso.
     */
    folioPermiso: '',

    /**
     * El valor de paisEmisorCertificado.
     */
    paisEmisorCertificado: '',
    /**
     * El valor de mixed.
     */
    mixed: true,
    /**
     * El valor de paisDeOrigen.
     */
    paisDeOrigen: '',
    /**
     * El valor de motivoJustificacion.
     */
    motivoJustificacion: '',
    /**
     * El valor de otrasDeclaraciones.
     */
    otrasDeclaraciones: '',
    
    /**
     * Estatus de la solicitud.
     */
    estatusSolicitud: '',

    /**
     * RFC de inicio de sesión.
     */
    loginRfc: '',
  };
}

/**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite130301', resettable: true })
export class Tramite130301Store extends Store<Solicitud130301State> {
  /**
   * Crea una instancia de Tramite31601Store.
   * Inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el estado de idSolicitud.
   * @param idSolicitud - El valor de idSolicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Establece el estado de partidasIdSolicitud.
   * @param partidasIdSolicitud - El valor de partidasIdSolicitud.
   */
  public setPartidasIdSolicitud(partidasIdSolicitud: string): void {
    this.update((state) => ({
      ...state,
      partidasIdSolicitud,
    }));

  }

  /**
   * Establece el estado de numeroFolioTramiteOriginal.
   * @param numeroFolioTramiteOriginal - El valor de numeroFolioTramiteOriginal.
   */
  public setNumeroFolioTramiteOriginal(
    numeroFolioTramiteOriginal: string
  ): void {
    this.update((state) => ({
      ...state,
      numeroFolioTramiteOriginal,
    }));
  }

  

  /**
   * Establece el estado de solicitudOpcion.
   * @param solicitudOpcion - El valor de solicitudOpcion.
   */
  public setSolicitudOpcion(solicitudOpcion: string): void {
    this.update((state) => ({
      ...state,
      solicitudOpcion,
    }));
  }

  /**
   * Establece el estado de regimen.
   * @param regimen - El valor de regimen.
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Establece el estado de clasificacionDelRegimen.
   * @param clasificacionDelRegimen - El valor de clasificacionDelRegimen.
   */
  public setClasificacionDelRegimen(clasificacionDelRegimen: string): void {
    this.update((state) => ({
      ...state,
      clasificacionDelRegimen,
    }));
  }

  /**
   * Establece el estado de productoOpcion.
   * @param productoOpcion - El valor de productoOpcion.
   */
  public setProductoOpcion(productoOpcion: string): void {
    this.update((state) => ({
      ...state,
      productoOpcion,
    }));
  }

  /**
   * Establece el estado de descripcionMercancia.
   * @param descripcionMercancia - El valor de descripcionMercancia.
   */
  public setDescripcionMercancia(descripcionMercancia: string): void {
    this.update((state) => ({
      ...state,
      descripcionMercancia,
    }));
  }

  /**
   * Establece el estado de fraccionArancelaria.
   * @param fraccionArancelaria - El valor de fraccionArancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Establece el estado de umt.
   * @param umt - El valor de umt.
   */
  public setUmt(umt: string): void {
    this.update((state) => ({
      ...state,
      umt,
    }));
  }

  /**
   * Establece el estado de cantidad.
   * @param cantidad - El valor de cantidad.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Establece el estado de valorFactura.
   * @param valorFactura - El valor de valorFactura.
   */
  public setValorFactura(valorFactura: string): void {
    this.update((state) => ({
      ...state,
      valorFactura,
    }));
  }

  /**
   * Establece el estado de pais.
   * @param pais - El valor de pais.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Establece el estado de usoEspecifico.
   * @param usoEspecifico - El valor de usoEspecifico.
   */
  public setUsoEspecifico(usoEspecifico: string): void {
    this.update((state) => ({
      ...state,
      usoEspecifico,
    }));
  }

  /**
   * Establece el estado de justificacionImportacionExportacion.
   * @param justificacionImportacionExportacion - El valor de justificacionImportacionExportacion.
   */
  public setJustificacionImportacionExportacion(
    justificacionImportacionExportacion: string
  ): void {
    this.update((state) => ({
      ...state,
      justificacionImportacionExportacion,
    }));
  }

  /**
   * Establece el estado de observaciones.
   * @param observaciones - El valor de observaciones.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Establece el estado de fechaInicioProrroga.
   * @param fechaInicioProrroga - El valor de fechaInicioProrroga.
   */
  public setFechaInicioProrroga(fechaInicioProrroga: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioProrroga,
    }));
  }

  /**
   * Establece el estado de fechaFinProrroga.
   * @param fechaFinProrroga - El valor de fechaFinProrroga.
   */
  public setFechaFinProrroga(fechaFinProrroga: string): void {
    this.update((state) => ({
      ...state,
      fechaFinProrroga,
    }));
  }

  /**
   * Establece el estado de cantidadProrroga.
   * @param cantidadProrroga - El valor de cantidadProrroga.
   */
  public setCantidadProrroga(cantidadProrroga: string): void {
    this.update((state) => ({
      ...state,
      cantidadProrroga,
    }));
  }

  /**
   * Establece el estado de representacionFederal.
   * @param representacionFederal - El valor de representacionFederal.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Establece el estado de folioPermiso.
   * @param folioPermiso - El valor de folioPermiso.
   */
  public setFolioPermiso(folioPermiso: string): void {
    this.update((state) => ({
      ...state,
      folioPermiso,
    }));
  }

  /**
   * Establece el estado de paisEmisorCertificado.
   * @param paisEmisorCertificado - El valor de paisEmisorCertificado.
   */
  public setPaisEmisorCertificado(paisEmisorCertificado: string): void {
    this.update((state) => ({
      ...state,
      paisEmisorCertificado,
    }));
  }

  /**
   * Establece el estado de certificadoKimberleyForma.
   * @param certificadoKimberleyForma - El valor de certificadoKimberleyForma.
   */
  public setCertificadoKimberleyForma(
    certificadoKimberleyForma: CertificadoKimberleyForma
  ): void {
    this.update((state) => ({
      ...state,
      certificadoKimberleyForma,
    }));
  }

  /**
   * Establece el estado de mixed.
   * @param mixed - El valor de mixed.
   */
  public setMixed(mixed: boolean): void {
    this.update((state) => ({
      mixed,
      paisEmisorCertificado: state.paisEmisorCertificado,
      paisDeOrigen: state.paisDeOrigen,
      motivoJustificacion: state.motivoJustificacion,
      otrasDeclaraciones: state.otrasDeclaraciones,
    }));
  }
  /**
   * Establece el estado de paisDeOrigen.
   * @param paisDeOrigen - El valor de paisDeOrigen.
   */
  public setPaisDeOrigen(paisDeOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisDeOrigen,
    }));
  }
  /**
   * Establece el estado de motivoJustificacion.
   * @param motivoJustificacion - El valor de motivoJustificacion.
   */
  public setMotivoJustificacion(motivoJustificacion: string): void {
    this.update((state) => ({
      ...state,
      motivoJustificacion,
    }));
  }
  /**
   * Establece el estado de otrasDeclaraciones.
   * @param otrasDeclaraciones - El valor de otrasDeclaraciones.
   */
  public setOtrasDeclaraciones(otrasDeclaraciones: string): void {
    this.update((state) => ({
      ...state,
      otrasDeclaraciones,
    }));
  }

  /**
   * Establece el estado de estatusSolicitud.
   * @param estatusSolicitud - El valor de estatusSolicitud.
   */
  public setEstatusSolicitud(estatusSolicitud: string): void {
    this.update((state) => ({
      ...state,
      estatusSolicitud,
    }));
  }

  /**
   * Establece el estado de loginRfc.
   * @param loginRfc - El valor de loginRfc.
   */
  public setLoginRfc(loginRfc: string): void {
    this.update((state) => ({
      ...state,
      loginRfc,
    }));
  }
  /**
   * Guarda la fecha de pago en el estado.
   * @param fechaPago
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }
  /**
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
