import { AutorizacionProsecStore, ProsecState } from '../estados/autorizacion-prosec.store';
import { Catalogo, JSONResponse, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../shared/servers/api-route';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProsecService {
  url: string = '../../../../../assets/json/90102/';
  url2: string = '../../../../../assets/json/90102/';

  constructor(private readonly http: HttpClient, 
  private autorizacionProsecStore : AutorizacionProsecStore) { }
  /**
   * Obtiene la lista de bancos.
   * @returns Observable de la lista de bancos.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.url + fileName;
    return this.http.get<RespuestaCatalogos>(BASEURL).pipe(
      map(response => response.data)
    );
  }

  obtenerEstadoTablaDatos(body: { rfc_solicitante: string; enitdad_federativa: string; planta_idc: string }): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(API_ROUTES('/sat-t90102', '90102').buscarDomicilios, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener información de la tabla de datos en ${API_ROUTES('/sat-t90102', '90102').buscarDomicilios}`);
        return throwError(() => ERROR);
      })
    );
  }
  obtenerSectoresTablaDatos(cveSector: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(API_ROUTES('/sat-t90102', '90102').sectoresDatos(cveSector)).pipe(
      map((response) => response),
    );
  }
  obtenerFraccionesTablaDatos(body: { fraccion: string; id_conf_programa_se: string; cve_sector: string; id_programa_autorizado: string | null }): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(API_ROUTES('/sat-t90102', '90102').buscarSectorFraccionArancelaria, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener información de las fracciones en ${API_ROUTES('/sat-t90102', '90102').buscarSectorFraccionArancelaria}`);
        return throwError(() => ERROR);
      })
    );
  }
      /**
   * Método para actualizar el estado del formulario con los datos proporcionados.
   * @param DATOS - Objeto que contiene el estado del trámite.
   */
  actualizarEstadoFormulario(DATOS: ProsecState): void {
    this.autorizacionProsecStore.setModalidad(DATOS.modalidad);
    this.autorizacionProsecStore.setEstadoSeleccionar(DATOS.estadoSeleccionar);
    this.autorizacionProsecStore.setRepresentacionFederal(DATOS.RepresentacionFederal);
    this.autorizacionProsecStore.setActividadProductiva(DATOS.ActividadProductiva);
    this.autorizacionProsecStore.setSector(DATOS.sector);
    this.autorizacionProsecStore.setFraccionArancelaria(DATOS.Fraccion_arancelaria);
    this.autorizacionProsecStore.setcontribuyentes(DATOS.contribuyentes);
    this.autorizacionProsecStore.setDomiciliosFormaValida(DATOS.domiciliosFormaValida);
  }

  /**
   * Método para obtener los datos del registro de toma de muestras de mercancías.
   * @returns Observable que emite el estado del trámite.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<ProsecState> {
    return this.http.get<ProsecState>('assets/json/90102/registro_toma_muestras_mercancias.json');
  }
}