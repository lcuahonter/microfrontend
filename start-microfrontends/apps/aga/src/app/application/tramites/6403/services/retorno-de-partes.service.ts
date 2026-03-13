import { CatalogoLista, DatosSolicitante, RespuestaConsulta,SolicitudTablaDatos } from '../models/retorno-de-partes.model';
import { Tramite6403State,Tramite6403Store } from '../estados/tramite6403.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Servicio para gestionar las operaciones relacionadas con el aviso de traslado.
 * 
 * Este servicio proporciona métodos para obtener datos como catálogos, tablas de aviso,
 * tablas de mercancías, y otros datos necesarios para el trámite 6403.
 */
@Injectable({
  providedIn: 'root'
})
export class RetornoDePartesService {
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los recursos.
   */
  constructor(private http: HttpClient, private tramite6403Store: Tramite6403Store) {
    // Constructor
  }
  /**
     * Actualiza el estado global del formulario con los datos proporcionados.
     * @param DATOS Objeto con los datos del formulario de tipo Solicitud6403State.
     */
  actualizarEstadoFormulario(DATOS: Tramite6403State): void {
  // Guard clause to prevent errors if data is missing
  if (!DATOS?.solicitudFormulario || !DATOS?.mercanciaFormulario) {
    // Optionally log or handle the missing data here
    return;
  }

  // solicitudFormulario
  this.tramite6403Store.setCveAduana(DATOS.solicitudFormulario.cveAduana);
  this.tramite6403Store.setCveSeccionAduanal(DATOS.solicitudFormulario.cveSeccionAduanal);
  this.tramite6403Store.setCveRecintoFiscalizado(DATOS.solicitudFormulario.cveRecintoFiscalizado);
  this.tramite6403Store.setCveTipoDocumento(DATOS.solicitudFormulario.cveTipoDocumento);
  this.tramite6403Store.setEstadoTipoDocumento(DATOS.solicitudFormulario.estadoTipoDocumento);
  this.tramite6403Store.setAduana(DATOS.solicitudFormulario.aduana);
  this.tramite6403Store.setPatente(DATOS.solicitudFormulario.patente);
  this.tramite6403Store.setPedimento(DATOS.solicitudFormulario.pedimento);
  this.tramite6403Store.setFolioImportacionTemporal(DATOS.solicitudFormulario.folioImportacionTemporal);
  this.tramite6403Store.setFolioFormatoOficial(DATOS.solicitudFormulario.folioFormatoOficial);
  this.tramite6403Store.setCheckProrroga(DATOS.solicitudFormulario.checkProrroga);
  this.tramite6403Store.setFolioOficialProrroga(DATOS.solicitudFormulario.folioOficialProrroga);
  this.tramite6403Store.setFechaImportacionTemporal(DATOS.solicitudFormulario.fechaImportacionTemporal);
  this.tramite6403Store.setFechaVencimiento(DATOS.solicitudFormulario.fechaVencimiento);
  this.tramite6403Store.setDescMercancia(DATOS.solicitudFormulario.descMercancia);
  this.tramite6403Store.setMarca(DATOS.solicitudFormulario.marca);
  this.tramite6403Store.setModelo(DATOS.solicitudFormulario.modelo);
  this.tramite6403Store.setNumeroSerie(DATOS.solicitudFormulario.numeroSerie);
  this.tramite6403Store.setTipo(DATOS.solicitudFormulario.tipo);
  this.tramite6403Store.setCveMedioTrasporte(DATOS.solicitudFormulario.cveMedioTrasporte);
  this.tramite6403Store.setGuiaMaster(DATOS.solicitudFormulario.guiaMaster);
  this.tramite6403Store.setGuiaBl(DATOS.solicitudFormulario.guiaBl);
  this.tramite6403Store.setNumeroBl(DATOS.solicitudFormulario.numeroBl);
  this.tramite6403Store.setRfcEmpresaTransportista(DATOS.solicitudFormulario.rfcEmpresaTransportista);
  this.tramite6403Store.setEstadoMedioTransporte(DATOS.solicitudFormulario.estadoMedioTransporte);
  this.tramite6403Store.setCartaPorte(DATOS.solicitudFormulario.cartaPorte);
  this.tramite6403Store.setCvePaisProcedencia(DATOS.solicitudFormulario.cvePaisProcedencia);
  this.tramite6403Store.setGuiaHouse(DATOS.solicitudFormulario.guiaHouse);
  this.tramite6403Store.setNumeroBuque(DATOS.solicitudFormulario.numeroBuque);
  this.tramite6403Store.setNumeroEquipo(DATOS.solicitudFormulario.numeroEquipo);
  this.tramite6403Store.setFechaCartaPorte(DATOS.solicitudFormulario.fechaCartaPorte);
  this.tramite6403Store.setTipContenedor(DATOS.solicitudFormulario.tipContenedor);
  this.tramite6403Store.setTranporteMarca(DATOS.solicitudFormulario.tranporteMarca);
  this.tramite6403Store.setTranporteModelo(DATOS.solicitudFormulario.tranporteModelo);
  this.tramite6403Store.setTranportePlaca(DATOS.solicitudFormulario.tranportePlaca);
  this.tramite6403Store.setObservaciones(DATOS.solicitudFormulario.observaciones);
  this.tramite6403Store.setConDestino(DATOS.solicitudFormulario.conDestino);
  this.tramite6403Store.setCveTipoDestino(DATOS.solicitudFormulario.cveTipoDestino);
  this.tramite6403Store.setCveTipoDocumentoReemplazada(DATOS.solicitudFormulario.cveTipoDocumentoReemplazada);
  this.tramite6403Store.setNumeroActaDescruccion(DATOS.solicitudFormulario.numeroActaDescruccion);
  this.tramite6403Store.setCveAduanaDestino(DATOS.solicitudFormulario.cveAduanaDestino);
  this.tramite6403Store.setCvePatenteDestino(DATOS.solicitudFormulario.cvePatenteDestino);
  this.tramite6403Store.setCvePedimentoDestino(DATOS.solicitudFormulario.cvePedimentoDestino);
  this.tramite6403Store.setFolioVucemRetorno(DATOS.solicitudFormulario.folioVucemRetorno);
  this.tramite6403Store.setFolioFormatoOficialDestino(DATOS.solicitudFormulario.folioFormatoOficialDestino);
  this.tramite6403Store.setFechaDescruccionDestino(DATOS.solicitudFormulario.fechaDescruccionDestino);
  this.tramite6403Store.setEstadoTipoDocumentoDestino(DATOS.solicitudFormulario.estadoTipoDocumentoDestino);
  this.tramite6403Store.setAutoridadPresentoAvisoDestruccion(DATOS.solicitudFormulario.autoridadPresentoAvisoDestruccion);
  this.tramite6403Store.setTablaPartesReemplazadasDatos(DATOS.tablaPartesReemplazadasDatos || []);

  // mercanciaFormulario
  this.tramite6403Store.setModalDescMercancia(DATOS.mercanciaFormulario.modalDescMercancia);
  this.tramite6403Store.setEspeMercancia(DATOS.mercanciaFormulario.espeMercancia);
  this.tramite6403Store.setMarcaMercancia(DATOS.mercanciaFormulario.marcaMercancia);
  this.tramite6403Store.setModeloMercancia(DATOS.mercanciaFormulario.modeloMercancia);
  this.tramite6403Store.setNumSerieMercancia(DATOS.mercanciaFormulario.numSerieMercancia);
  this.tramite6403Store.setNumParteMercancia(DATOS.mercanciaFormulario.numParteMercancia);
  this.tramite6403Store.setTipoMercancia(DATOS.mercanciaFormulario.tipoMercancia);
}
  /**
     * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
     * @returns Observable con los datos del formulario.
     */
  getRegistroTomaMuestrasMercanciasData(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/6403/registro_toma_muestras_mercancias.json');
  }
  /**
   * Obtiene los datos del solicitante.
   * 
   * @returns {Observable<DatosSolicitante>} Un observable con los datos del solicitante.
   */
  obtenerDatosSolicitante(): Observable<DatosSolicitante> {
    return this.http.get<DatosSolicitante>(`assets/json/6403/datosSolicitante.json`);
  }
  /**
   * Obtiene los datos de la tabla de Solicitud.
   * 
   * @returns {Observable<SolicitudTablaDatos>} Un observable con los datos de la tabla de Solicitud.
   */
  obtenerSolicitudTabla(): Observable<SolicitudTablaDatos> {
    return this.http.get<SolicitudTablaDatos>(`assets/json/6403/autorizacion-tabla.json`);
  }
  
   /**
   * Obtiene la lista de entidades federativas.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de entidades federativas.
   */
  obtenerFederativa(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/entidad-federativa.json`);
  }

  /**
   * @descripcion Obtiene la lista de aduanas desde un archivo JSON local.
   * @retorno Un observable que emite un objeto de tipo `CatalogoLista` con los datos de las aduanas.
   */
  obtenerAduanas(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/aduanas.json`);
  }

  /**
   * @descripcion Obtiene la lista de aduaneras desde un archivo JSON local.
   * @retorna Un observable que emite un objeto de tipo `CatalogoLista` con los datos de las aduaneras.
   */
  obtenerAduaneras(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/aduaneras.json`);
  }

  /**
   * @descripcion Obtiene el catálogo de recintos fiscalizados desde un archivo JSON local.
   * @retorna Un observable que emite un objeto de tipo `CatalogoLista` con los datos del catálogo.
   */
  obtenerRecintoFiscalizado(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/recinto-fiscalizado.json`);
  }

  /**
   * @descripcion Obtiene el tipo de documento desde un archivo JSON local.
   * @retorno Un Observable que emite un objeto de tipo `CatalogoLista` con los datos del tipo de documento.
   */
  obtenerTipoDeDocumento(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/tipo-de-documento.json`);
  }

  /**
   * @descripcion Obtiene el catálogo de medios de transporte desde un archivo JSON local.
   * @retorna Un observable que emite un objeto de tipo `CatalogoLista` con los datos del catálogo.
   */
  obtenerMedioDeTransporte(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/medio-de-transporte.json`);
  }

  /**
   * @descripcion Obtiene la lista de países de procedencia desde un archivo JSON local.
   * @retorna Un observable que emite un objeto de tipo `CatalogoLista` con los datos de los países de procedencia.
   */
  obtenerPaisDeProcedencia(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6403/pais-de-procedencia.json`);
  }
}