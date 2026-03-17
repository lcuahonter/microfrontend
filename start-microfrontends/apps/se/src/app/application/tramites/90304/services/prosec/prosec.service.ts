import { BehaviorSubject, Observable } from 'rxjs';
import { EmpresasListaResquesta, ModificacionResquesta } from '../../models/prosec.model';
import { HttpCoreService, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { MercanciasResquesta, PlantasTabla, ProductorIndirectoResquesta, SectorTabla } from '../../../../shared/models/complementaria.model';
import { BitacoraResquesta } from '../../../../shared/models/bitacora.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_90304 } from '../../servers/api-route';
import { Solicitud90304State } from '../../estados/tramite90304.store';
import { Tramite90304Query } from '../../estados/tramite90304.query';

/**
 * Servicio para obtener y gestionar los datos de la aplicación PROSEC.
 * @class ProsecService
 */
@Injectable({
  providedIn: 'root'
})
export class ProsecService {

  /**
   * Variable reactiva para indicar si es baja.
   * @type {BehaviorSubject<boolean>}
   */
  private isBajaSubject = new BehaviorSubject<boolean>(true);

  /**
   * Observable para consultar el estado de baja.
   * @type {Observable<boolean>}
   */
  isBaja$ = this.isBajaSubject.asObservable();

  /**
   * Constructor del servicio ProsecService.
   * @param http - Cliente HTTP para realizar peticiones a archivos JSON locales.
   * @param query - Servicio de consulta para obtener el estado del trámite 90304.
   * @param httpService - Servicio HTTP principal para realizar peticiones a la API.
   */
  constructor(
    private http: HttpClient,
    private query: Tramite90304Query,
    private httpService: HttpCoreService
  ) { }

  /**
   * Establece el valor de si es baja o no.
   * @param value - Valor booleano que indica si es baja o no.
   */
  setIsBaja(value: boolean): void {
    this.isBajaSubject.next(value);
  }

  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/90304/documentos-seleccionados.json');
  }

  /**
   * Obtiene los datos de las plantas.
   * @returns Observable con los datos de las plantas.
   */
  obtenerPlantasDatos(): Observable<PlantasTabla[]> {
    return this.http.get<PlantasTabla[]>('assets/json/90304/plantas.json');
  }

  /**
   * Obtiene los datos de los sectores.
   * @returns Observable con los datos de los sectores.
   */
  obtenerSectorDatos(): Observable<SectorTabla[]> {
    return this.http.get<SectorTabla[]>('assets/json/90304/sector.json');
  }

  /**
   * Obtiene los datos de las mercancías a producir.
   * @returns Observable con los datos de las mercancías a producir.
   */
  obtenerMercanciasProducir(): Observable<MercanciasResquesta> {
    return this.http.get<MercanciasResquesta>('assets/json/90304/mercancias-producir.json');
  }

  /**
   * Obtiene los datos de los productores indirectos.
   * @returns Observable con los datos de los productores indirectos.
   */
  obtenerProductoIndirectoDatos(): Observable<ProductorIndirectoResquesta> {
    return this.http.get<ProductorIndirectoResquesta>('assets/json/90304/productor-indirecto.json');
  }

  /**
   * Obtiene los datos de la bitácora.
   * @returns Observable con los datos de la bitácora.
   */
  obtenerBitacoraDatos(): Observable<BitacoraResquesta> {
    return this.http.get<BitacoraResquesta>('assets/json/90304/bitacora.json');
  }

  /**
   * Obtiene los datos de modificación.
   * @returns Observable con los datos de modificación.
   */
  obtenerModificacionDatos(): Observable<ModificacionResquesta> {
    return this.http.get<ModificacionResquesta>('assets/json/90304/modificacion.json');
  }

  /**
   * Obtiene la lista de empresas.
   * @returns Observable con los datos de la lista de empresas.
   */
  obtenerEmpresasListaDatos(): Observable<EmpresasListaResquesta> {
    return this.http.get<EmpresasListaResquesta>('assets/json/90304/empresas-lista.json');
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud90304State>} Observable con todos los datos del estado de la solicitud 90304.
   */
  getAllState(): Observable<Solicitud90304State> {
    return this.query.selectSolicitud$;
  }

  /**
   * Guarda los datos mediante una petición POST a la API.
   * @param body - Objeto con los datos a guardar en el servidor.
   * @returns {Observable<Record<string, unknown>>} Observable con la respuesta del servidor.
   */
  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_90304.GUARDAR, {
      body: body,
    });
  }
}