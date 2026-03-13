/**
 * @module FitosanitarioService
 * @description
 * Servicio para manejar las operaciones relacionadas con los datos fitosanitarios.
 */

import { ApiResponseDos, CertificadosResponse,DatosDeLaSolicitudInt, DestinoInfoDatos, ExportadorInfoDatos, InspeccionApiResponse, MercanciaDatosDos, PagoDeDerechosResponseDos, PagoDeDerechosRevisionResponse } from '../modelos/acuicola.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

import { TramiteState,TramiteStore } from '../estados/tramite220702.store';

import { map } from 'rxjs';

/**
 * @description
 * Servicio para manejar las operaciones relacionadas con los datos fitosanitarios.
 */
@Injectable({
  providedIn: 'root'
})
export class FitosanitarioService {

  /**
   * @description
   * URL base para acceder a los archivos JSON que contienen los datos.
   */
  private apiUrl = 'assets/json/220702/';

  /**
   * @description
   * Constructor del servicio.
   * 
   * @param http - Servicio de Angular `HttpClient` para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private tramiteStore: TramiteStore
  ) {
    // No se necesita lógica de inicialización adicional.
  }
  

  /**
   * @description
   * Obtiene los datos de los certificados.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `CertificadosResponse`.
   */
  obtenerDatosCertificados(): Observable<CertificadosResponse> {
    return this.http.get<CertificadosResponse>(`${this.apiUrl}datos-certificados.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los datos de la mercancía.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `MercanciaDatosDos`.
   */
  getDatosMercania(): Observable<MercanciaDatosDos> {
    return this.http.get<MercanciaDatosDos>(`${this.apiUrl}mercania-servico.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los datos de la mercancía.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `ApiResponseDos`.
   */
  getDatosDeLaMercancia(): Observable<ApiResponseDos> {
    return this.http.get<ApiResponseDos>(`${this.apiUrl}mercancia-datos.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los datos del exportador.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `ExportadorInfoDatos`.
   */
  getDatosExportador(): Observable<ExportadorInfoDatos> {
    return this.http.get<ExportadorInfoDatos>(`${this.apiUrl}exportador.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los datos del destinatario.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `DestinoInfoDatos`.
   */
  getDatosDestinatarioInfo(): Observable<DestinoInfoDatos> {
    return this.http.get<DestinoInfoDatos>(`${this.apiUrl}destino-datos.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene las horas de inspección disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getHoraDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}hora-de-inspeccion.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene las aduanas de ingreso disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getAduanaDeIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}aduana-de-ingreso.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene las oficinas de inspección disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getOficinaDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}oficina-de-inspeccion.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene los puntos de inspección disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getPuntoDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}punto-de-inspeccion.json`).pipe(
      map((response) => response)
    );
  }
  /**
   * @description
   * Obtiene las justificaciones de pago disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */

  getPagoJustificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}pago-justificacion.json`).pipe(
      map((response) => response)
    );
  } 


  /**
   * @description
   * Obtiene los datos del responsable de inspección.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `InspeccionApiResponse`.
   */
  obtenerResponsableDatos(): Observable<InspeccionApiResponse> {
    return this.http.get<InspeccionApiResponse>(`${this.apiUrl}responsable-inspeccion.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los tipos de contenedores disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getTipoContenedor(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}tipo-contenedor.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene los medios de transporte disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getMedioDeTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}medio-de-transporte.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene los datos de los bancos disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getBancoDatos(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}banco-datos.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene los datos de pago de derechos.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `PagoDeDerechosResponseDos`.
   */
  pagoDeCargarDatos(): Observable<PagoDeDerechosResponseDos> {
    return this.http.get<PagoDeDerechosResponseDos>(`${this.apiUrl}pago-de-derechos.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los datos de revisión de pago de derechos.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `PagoDeDerechosRevisionResponse`.
   */
  getPagoDerechosRevision(): Observable<PagoDeDerechosRevisionResponse> {
    return this.http.get<PagoDeDerechosRevisionResponse>(`${this.apiUrl}pago-de-derechos-revision.json`).pipe(
      map((res) => res)
    );
  }

  /**
   * @description
   * Obtiene los regímenes a los que se puede destinar.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getRegimenAlQue(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}regimen-al-que-se-destinara.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene los datos para la movilización.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getDatosParaMovilizacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}datos-para-movilizacio.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Obtiene los puntos de verificación disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getPuntoDeVerificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}punto-de-verificacion.json`).pipe(
      map((response) => response)
    );
  }
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS - Objeto que contiene los datos a actualizar en el estado del formulario.
   */

  actualizarEstadoFormulario(DATOS:TramiteState): void {
    this.tramiteStore.setCertificadosAutorizados(DATOS.certificadosAutorizados);
    this.tramiteStore.setJustificacion(DATOS.justificacion);
    this.tramiteStore.setAduanaDeIngreso(DATOS.aduanaDeIngreso);
    this.tramiteStore.setOficinaDeInspeccion(DATOS.oficinaDeInspeccion);
    this.tramiteStore.setPuntoDeInspeccion(DATOS.puntoDeInspeccion);  
    this.tramiteStore.setNombreInspector(DATOS.nombreInspector);
    this.tramiteStore.setHoraDeInspeccion(DATOS.horaDeInspeccion);
    this.tramiteStore.setPrimerApellido(DATOS.primerApellido);
    this.tramiteStore.setSegundoApellido(DATOS.segundoApellido);
    this.tramiteStore.setCantidadContenedores(DATOS.cantidadContenedores);
    this.tramiteStore.setTipoContenedor(DATOS.tipoContenedor);
    this.tramiteStore.setMedioDeTransporte(DATOS.medioDeTransporte);
    this.tramiteStore.setIdentificacionTransporte(DATOS.identificacionTransporte);
    this.tramiteStore.setEsSolicitudFerros(DATOS.esSolicitudFerros);
    this.tramiteStore.setBanco(DATOS.banco);
    this.tramiteStore.setLlaveDePago(DATOS.llaveDePago);
    this.tramiteStore.setFechaPagoDeDerechos(DATOS.fechaPagoDeDerechos);
    this.tramiteStore.setImporteDePago(DATOS.importeDePago);
    this.tramiteStore.setClaveDeReferencia(DATOS.claveDeReferencia);
    this.tramiteStore.setCadenaDependenciaRevision(DATOS.cadenaDependenciaRevision);
    this.tramiteStore.setBancoRevision(DATOS.bancoRevision);
    this.tramiteStore.setLlaveDePagoRevision(DATOS.llaveDePagoRevision);
    this.tramiteStore.setFechaPagoDeDerechosRevision(DATOS.fechaPagoDeDerechosRevision);
    this.tramiteStore.setImporteDePagoRevision(DATOS.importeDePagoRevision);
    this.tramiteStore.setExentoDePago(DATOS.exentoDePago);
    this.tramiteStore.setFechaDePago(DATOS.fechaDePago);
    this.tramiteStore.setTipoContenedor(DATOS.tipoContenedor);
    this.tramiteStore.setMedioDeTransporte(DATOS.medioDeTransporte);
    this.tramiteStore.setIdentificacionTransporte(DATOS.identificacionTransporte);
    this.tramiteStore.setOficinaDeInspeccion(DATOS.oficinaDeInspeccion);
    this.tramiteStore.setSolicitudTramite(DATOS.SolicitudState);
    this.tramiteStore.setFechaDeInspeccion(DATOS.fechaDeInspeccion);

  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<AmpliacionServiciosState>} - Observable con el estado de ampliación de servicios.
   */

  getServiciosData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/220702/datos-prefill.json');
  }
  /**
   * Obtiene los datos generales para la consulta desde un archivo JSON.
   * @returns {Observable<DatosDeLaSolicitudInt>} - Observable con los datos generales de la solicitud.
   */
  getDatosGeneralesConsulta(): Observable<DatosDeLaSolicitudInt> {
  return this.http.get<DatosDeLaSolicitudInt>('assets/json/220702/datos-prefill.json');
}

}