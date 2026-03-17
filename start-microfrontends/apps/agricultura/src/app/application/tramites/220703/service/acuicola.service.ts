/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatosDelTramite, PagoDeDerechos, PagoDeDerechosRevision, ResponsableInspeccion } from '../modelos/acuicola.model';
import { TramiteState, TramiteStore } from '../estados/tramite220703.store';
import { DestinoInfo } from '../constantes/acuicola.enum';
import { ExportadorInfo } from '../constantes/acuicola.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MercanciaDatosInfo } from '../constantes/acuicola.enum';
import { MercanciaInfo } from '../constantes/acuicola.enum';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcuicolaService {

  /**
   * URL base para acceder a los archivos JSON que contienen los datos.
   */
  private apiUrl = 'assets/json/220703/';

  /**
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
   * Obtiene los datos de los certificados.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `DatosDelTramite`.
   */
  obtenerDatosCertificados(): Observable<DatosDelTramite> {
    return this.http.get<DatosDelTramite>(`${this.apiUrl}datos-certificados.json`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  /**
   * Obtiene las horas de inspección disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getHoraDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}hora-de-inspeccion.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene las aduanas de ingreso disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getAduanaDeIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}aduana-de-ingreso.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene las oficinas de inspección disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getOficinaDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}oficina-de-inspeccion.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los puntos de inspección disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getPuntoDeInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}punto-de-inspeccion.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos del responsable de inspección.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `ResponsableInspección`.
   */
  obtenerResponsableDatos(): Observable<ResponsableInspeccion> {
    return this.http.get<ResponsableInspeccion>(`${this.apiUrl}responsable-inspeccion.json`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  /**
   * Obtiene los tipos de contenedores disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getTipoContenedor(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}tipo-contenedor.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los medios de transporte disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getMedioDeTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}medio-de-transporte.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos de los bancos disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getBancoDatos(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}banco-datos.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos de pago de derechos.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `PagoDeDerechos`.
   */
  pagoDeCargarDatos(): Observable<PagoDeDerechos> {
    return this.http.get<PagoDeDerechos>(`${this.apiUrl}pago-de-derechos.json`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  /**
   * Obtiene los datos de revisión de pago de derechos.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `PagoDeDerechosRevision`.
   */
  getPagoDerechosRevision(): Observable<PagoDeDerechosRevision> {
    return this.http.get<PagoDeDerechosRevision>(`${this.apiUrl}pago-de-derechos-revision.json`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  /**
   * Obtiene los regímenes a los que se puede destinar.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getRegimenAlQueSeDestinara(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}regimen-al-que-se-destinara.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos para la movilización.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getDatosParaMovilizacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}datos-para-movilizacio.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los puntos de verificación disponibles.
   * 
   * @returns Un `Observable` que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getPuntoDeVerificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.apiUrl}punto-de-verificacion.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos de la mercancía desde un archivo JSON.
   * @returns Un Observable que emite un array de objetos de tipo `MercanciaDatosInfo`.
   */
  getDatosMercancia(): Observable<MercanciaDatosInfo[]> {
    return this.http.get<MercanciaDatosInfo[]>(`${this.apiUrl}datos-de-mercancia.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos de la mercancía (merchandise) desde un archivo JSON.
   * @returns Un Observable que emite un array de objetos de tipo `MercanciaInfo`.
   */
  getMercanciaDatos(): Observable<MercanciaInfo[]> {
    return this.http.get<MercanciaInfo[]>(`${this.apiUrl}datos-de-merchandise.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos del exportador desde un archivo JSON.
   * @returns Un Observable que emite un array de objetos de tipo `ExportadorInfo`.
   */
  getExportadorDatos(): Observable<ExportadorInfo[]> {
    return this.http.get<ExportadorInfo[]>(`${this.apiUrl}datos-de-exportador.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Obtiene los datos del destino desde un archivo JSON.
   * @returns Un Observable que emite un array de objetos de tipo `DestinoInfo`.
   */
  getDestinoDatos(): Observable<DestinoInfo[]> {
    return this.http.get<DestinoInfo[]>(`${this.apiUrl}datos-de-destino.json`).pipe(
      map(response => {
        return response;
      })
    );
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS - Objeto que contiene los datos a actualizar en el estado del formulario.
   */
  actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.tramiteStore.setCertificadosAutorizados(DATOS.certificadosAutorizados);
    this.tramiteStore.setJustificacion(DATOS.justificacion);
    this.tramiteStore.setAduanaDeIngreso(DATOS.aduanaDeIngreso);
    this.tramiteStore.setOficinaDeInspeccion(DATOS.oficinaDeInspeccion);
    this.tramiteStore.setPuntoDeInspeccion(DATOS.puntoDeInspeccion);
    this.tramiteStore.setNombreInspector(DATOS.nombreInspector);
    this.tramiteStore.setHoraDeInspeccion(DATOS.horaDeInspeccion);
    this.tramiteStore.setFechaDeInspeccion(DATOS.fechaDeInspeccion);
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
    this.tramiteStore.setNumeroDeGuia(DATOS.numeroDeGuia);
    this.tramiteStore.setRegimenAlQueDestina(DATOS.regimenAlQueDestina);
    this.tramiteStore.setDatosParaMovilizacion(DATOS.datosParaMovilizacion);
    this.tramiteStore.setPuntoDeVerificacion(DATOS.puntoDeVerificacion);
    this.tramiteStore.setFolioDelTramite(DATOS.folioDelTramite);
    this.tramiteStore.setCadenaDependenciaRevision(DATOS.cadenaDependenciaRevision);
    this.tramiteStore.setBancoRevision(DATOS.bancoRevision);
    this.tramiteStore.setLlaveDePagoRevision(DATOS.llaveDePagoRevision);
    this.tramiteStore.setFechaPagoDeDerechosRevision(DATOS.fechaPagoDeDerechosRevision);
    this.tramiteStore.setImporteDePagoRevision(DATOS.importeDePagoRevision);
    this.tramiteStore.setFechaDePago(DATOS.fechaDePago);
    this.tramiteStore.setTipoContenedor(DATOS.tipoContenedor);
    this.tramiteStore.setMedioDeTransporte(DATOS.medioDeTransporte);
    this.tramiteStore.setIdentificacionTransporte(DATOS.identificacionTransporte);
    this.tramiteStore.setOficinaDeInspeccion(DATOS.oficinaDeInspeccion);
    this.tramiteStore.setIdentificacionDelTransporte(DATOS.identificacionDelTransporte);
    this.tramiteStore.setNombreDeLaEmpresaTransportista(DATOS.nombreDeLaEmpresaTransportista);
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<AmpliacionServiciosState>} - Observable con el estado de ampliación de servicios.
   */
  getServiciosData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/220703/datos-precargados.json');
  }

}
