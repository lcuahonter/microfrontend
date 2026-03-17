/**
 * @module ProsecService
 * @description
 * Servicio para la gestión de catálogos y datos del trámite PROSEC.
 * @author
 * @since 2024
 * @language es
 */
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
    /**
     * Obtiene la representación federal desde el endpoint externo.
     * @param idSolicitud
     * @param idProgramaAutorizado
     * @param fechaProsec
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obtenerRepresentacionFederal(idSolicitud: string, idProgramaAutorizado: string, fechaProsec: string): Observable<any> {
      const URL = `https://api-v30.cloud-ultrasist.net/api/sat-t90201/solicitud/consulta/obtener-representacion-federal?idSolicitud=${idSolicitud}&idProgramaAutorizado=${idProgramaAutorizado}&fechaProsec=${fechaProsec}`;
      //                                                                                 obtener-representacion-federal?idSolicitud=&idProgramaAutorizado=9419&fechaProsec=1763459919117       
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.http.get<any>(URL).pipe(
        map(response => {
          return response;
        })
      );
    }

     /**
     * Obtiene la representación federal desde el endpoint externo.
     * @param idSolicitud
     * @param idProgramaAutorizado
     * @param fechaProsec
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obtenerActividadProductiva(idSolicitud: string, idProgramaAutorizado: string): Observable<any> {
      const URL = `https://api-v30.cloud-ultrasist.net/api/sat-t90201/solicitud/consulta/obtener-descripcion-actividad-productiva?idSolicitud=${idSolicitud}&idProgramaAutorizado=${idProgramaAutorizado}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.http.get<any>(URL).pipe(
        map(response => {
          return response;
        })
      );
    }

    
  url: string = '../../../../../assets/json/90201/';
  url2: string = '../../../../../assets/json/90201/';

  constructor(
    private readonly http: HttpClient,
    private autorizacionProsecStore: AutorizacionProsecStore
  ) {}

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

  obtenerEstadoTablaDatos(body: { idSolicitud: string |null; idProgramaAutorizado: number; fechaProsec: string }): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(API_ROUTES('/sat-t90201', '90201').buscarPlanta, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener información de la tabla de datos en ${API_ROUTES('/sat-t90201', '90201').buscarDomicilios}`);
        return throwError(() => ERROR);
      })
    );
  }

  obtenerSectoresTablaDatos(cveSector: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(API_ROUTES('/sat-t90201', '90201').sectoresDatos(cveSector)).pipe(
      map((response) => response),
    );
  }

  obtenerFraccionesTablaDatos(body: { fraccion: string; id_conf_programa_se: string; cve_sector: string; id_programa_autorizado: string | null }): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(API_ROUTES('/sat-t90201', '90201').buscarSectorFraccionArancelaria, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener información de las fracciones en ${API_ROUTES('/sat-t90201', '90201').buscarSectorFraccionArancelaria}`);
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
    this.autorizacionProsecStore.setSector(DATOS.Sector);
    this.autorizacionProsecStore.setFraccionArancelaria(DATOS.Fraccion_arancelaria);
    this.autorizacionProsecStore.setcontribuyentes(DATOS.contribuyentes);
    this.autorizacionProsecStore.setDomiciliosFormaValida(DATOS.domiciliosFormaValida);
  }

  /**
   * Método para obtener los datos del registro de toma de muestras de mercancías.
   * @returns Observable que emite el estado del trámite.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<ProsecState> {
    return this.http.get<ProsecState>('assets/json/90201/registro_toma_muestras_mercancias.json');
  }

  obtenerProductorIndirectoDatos(body: { rfc: string, idSolicitud: number | null, idProgramaAutorizado: string, fechaProsec: number, consulta: boolean }): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(API_ROUTES('/sat-t90201').buscarProductoresIndirecto, body);
    
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obtenerFraccionArancelariaDatos(body: any): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(API_ROUTES('/sat-t90201').buscarSectorFraccionArancelaria, body)
  }
}