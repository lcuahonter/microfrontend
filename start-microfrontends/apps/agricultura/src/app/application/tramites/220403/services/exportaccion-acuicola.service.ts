/**
 * @Injectable
 * @description
 * Servicio para obtener y gestionar los datos relacionados con el permiso IMMEX y la exportación acuícola.
 * Proporciona métodos para obtener catálogos, datos de formularios y actualizar el estado de validación de las secciones.
 * Utiliza el estado global de la aplicación para coordinar la lógica de validación y la obtención de información.
 * 
 * @author Equipo VUCEM
 * @since 2025
 */
import { Catalogo, LabelValueDatos, RespuestaCatalogos, SeccionLibQuery, SeccionLibState, SeccionLibStore } from '@ng-mf/data-access-user';
import { ConsultarEmpresaProductora, EmpresaProductora, FilaSolicitudRespuesta, FormularioGrupo, Importador } from '../models/acuicola.module';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite220403Query } from '../estados/tramite220403.query';
import { Tramite220403Store } from '../estados/tramite220403.store';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExportaccionAcuicolaService {
  /**
   * URL base del archivo JSON que contiene los datos del permiso IMMEX.
   * @type {string}
   */
  private jsonUrl = 'assets/json/220403';

  /**
   * Notificador para la destrucción de suscripciones.
   * @access private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del formulario del trámite.
   * @access private
   */
  private TramiteState!: FormularioGrupo;

  /**
   * Estado actual de la sección.
   * @access private
   */
  private seccionState!: SeccionLibState

  /**
   * Constructor del servicio ExportaccionAcuicolaService.
   * Inicializa los servicios y suscriptores necesarios.
   * 
   * @param httpClient Cliente HTTP para realizar solicitudes.
   * @param store Store para el estado del trámite.
   * @param query Query para el estado del trámite.
   * @param seccionStore Store para el estado de la sección.
   * @param seccionQuery Query para el estado de la sección.
   */
  constructor(
    private httpClient: HttpClient, 
    private store: Tramite220403Store,
    private query: Tramite220403Query,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery
  ) {
    this.initializeService();
  }

  /**
   * Inicializa las suscripciones al estado de la sección y del trámite.
   * @private
   */
  private initializeService(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.query.selectTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.TramiteState = state as FormularioGrupo;
        })
      )
      .subscribe();
  }

  /**
   * Obtiene los datos del permiso IMMEX desde un archivo JSON.
   * @param fileName Nombre del archivo JSON a consultar.
   * @returns {Observable<LabelValueDatos[]>} Observable con los datos del permiso IMMEX.
   */
  getDatos(fileName: string): Observable<LabelValueDatos[]> {
    return this.httpClient.get<LabelValueDatos[]>(`${this.jsonUrl}/${fileName}`).pipe(
      map((response: LabelValueDatos[]) => {
        return response.map((item: LabelValueDatos) => ({
          label: item.label,
          value: item.value
        }));
      }),
      catchError(error => {
        console.error('Error al obtener datos desde:', this.jsonUrl, error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene la lista de bancos o catálogos desde un archivo JSON.
   * @param fileName Nombre del archivo JSON a consultar.
   * @returns {Observable<Catalogo[]>} Observable de la lista de bancos o catálogos.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.jsonUrl + '/' + fileName + '.json';
    return this.httpClient.get<RespuestaCatalogos>(BASEURL).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza el estado de validación de la forma y la sección según el estado global del trámite.
   * Si todos los formularios están validados, marca la sección como válida.
   * Si alguno no está validado, marca la sección como inválida.
   */
  actualizarFormaValida(): void {
    if (
      this.TramiteState.datosRealizarValidada === true && 
      this.TramiteState.combinacionRequeridaValidada === true && 
      this.TramiteState.transporteValidada === true && 
      this.TramiteState.pagoDerechosValidada === true
    ) {
      this.seccionStore.establecerSeccion([true]);
      this.seccionStore.establecerFormaValida([true]);
    } else {
      this.seccionStore.establecerSeccion([true]);
      this.seccionStore.establecerFormaValida([false]);
    }
  }

  /**
   * @description Obtiene los datos del formulario de certificados de origen desde un archivo JSON local.
   * @returns {Observable<TramiteState>} Observable con el estado del trámite.
   */
  public getAcuiculturaData(): Observable<FormularioGrupo> {
    return this.httpClient.get<FormularioGrupo>('assets/json/220403/exportaccion-acuicola.json');
  }

  /**
   * @description Actualiza el estado completo del formulario en el store de acuicultura.
   * @param DATOS Objeto de tipo Acuicultura con los datos a actualizar.
   */
  public actualizarEstadoFormulario(DATOS: FormularioGrupo): void {
    this.store.setDatosRealizar(DATOS.datosRealizar);
    this.store.setCombinacionRequerida(DATOS.combinacionRequerida);
    this.store.setTransporte(DATOS.transporte);
    this.store.setPagoDerechos(DATOS.pagoDerechos);
  }

  /**
   * Obtiene los datos de la solicitud desde un archivo JSON.
   * @returns {Observable<FilaSolicitudRespuesta>} Observable con los datos de la solicitud.
   */
  obtenerSolicitudDatos(): Observable<FilaSolicitudRespuesta> {
    return this.httpClient.get<FilaSolicitudRespuesta>('assets/json/220403/solicitud-datos.json');
  }

  /**
   * Obtiene los datos del certificado de exportación.
   * @returns {Observable<FormularioGrupo>} Observable con los datos del certificado de exportación.
   */
  certificadoExportacion(): Observable<FormularioGrupo> {
    return this.httpClient.get<FormularioGrupo>(`assets/json/220403/certificado-exportacion.json`);
  }

  /**
   * Obtiene los datos de la empresa productora desde un archivo JSON.
   * @returns {Observable<EmpresaProductora[]>} Observable con los datos de la empresa productora.
   */
  obtenerEmpresaProductora(): Observable<EmpresaProductora[]> {
    return this.httpClient.get<EmpresaProductora[]>('assets/json/220403/empresa-productora.json');
  }

  /**
   * Obtiene los datos del importador desde un archivo JSON.
   * @returns {Observable<Importador[]>} Observable con los datos del importador.
   */
  obtenerImportador(): Observable<Importador[]> {
    return this.httpClient.get<Importador[]>('assets/json/220403/importador.json');
  }

  /**
   * Obtiene la lista de países desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Observable con la lista de países.
   */
  obtenerPaises(): Observable<Catalogo[]> {
    return this.httpClient.get<RespuestaCatalogos>('assets/json/220403/paises.json')
      .pipe(
        map(response => response.data)
      );
  }
  
  /**
   * Obtiene una lista de datos de empresas productoras realizando una solicitud HTTP GET
   * a un archivo JSON local.
   *
   * @returns Un Observable que emite un arreglo de objetos `ConsultarEmpresaProductora`.
   */
  obtenerConsultarEmpresaDatos(): Observable<ConsultarEmpresaProductora> {
    return this.httpClient.get<ConsultarEmpresaProductora>(`assets/json/220403/consultar-empresa-productora.json`);
  }
}