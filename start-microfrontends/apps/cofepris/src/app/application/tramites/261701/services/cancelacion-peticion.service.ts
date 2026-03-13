import { BUSCAR, GUARDAR_API, MOSTAR_API, TRAMITES_ASOCIADOS } from '../../../shared/servers/api-route';
import { CancelacionPeticion261701State, Tramite261701Store } from '../estados/store/tramite261701.store';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite261701Query } from '../estados/query/tramite261701.query';
import { TramiteAsociados } from '../../../shared/models/tramite-asociados.model';

/**
 * Servicio para gestionar la cancelación de peticiones.
 * Este servicio se encarga de realizar solicitudes HTTP
 * para obtener información relacionada con la cancelación de peticiones.
 */
@Injectable({
  providedIn: 'root',
})
export class CancelacionPeticionService {
  /**
   * Constructor del servicio.
   * Inicializa el cliente HTTP para realizar solicitudes.
   * http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient,
     private tramite261701Store: Tramite261701Store,
     private tramite261701Query:Tramite261701Query, public httpService: HttpCoreService,) { }

  
  /**
   * Actualiza el estado del formulario estableciendo cada propiedad individualmente en el store
   */
  actualizarEstadoFormulario(DATOS: CancelacionPeticion261701State): void {
    Object.entries(DATOS).forEach(([key, value]) => {
      // Llamar a establecerDatos con cada clave y valor individual
      this.tramite261701Store.establecerDatos(key, value);
    });
  }

  /**
   * Obtiene los trámites asociados desde un archivo JSON.
   * Devuelve un observable con la lista de trámites asociados.
   */
  obtenerTramitesAsociados(): Observable<TramiteAsociados[]> {
    return this.http.get<TramiteAsociados[]>(
      'assets/json/261701/tramite-asociados.json'
    );
  }

  /**
   * Obtiene el estado de la cancelación de la petición desde un archivo JSON.
   * Devuelve un observable con el estado de la cancelación de la petición.
   */
  obtenerCancelacionPeticion(): Observable<CancelacionPeticion261701State> {
    return this.http.get<CancelacionPeticion261701State>('assets/json/261701/cancelacion-peticion.json');
  }

  /**
   * Realiza una solicitud POST para buscar datos asociados al RFC del representante legal.
   *
   * @param rfc - El RFC del representante legal a consultar.
   * @returns Un Observable que emite la respuesta JSON del servicio.
   */
  getBuscarDatos(rfc:string): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(BUSCAR("261701"), {rfcRepresentanteLegal: rfc }).pipe(
      map((response) => response)
    );
  }

   /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<SolicitudDeRegistroTpl120101State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<CancelacionPeticion261701State> {
    return this.tramite261701Query.allStoreData$;
  }


/**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>( GUARDAR_API('261701'), { body: body });
  }
  /**
   * Obtiene los datos a mostrar para una solicitud específica.
   *
   * @param idSolicitud - El identificador numérico de la solicitud.
   * @returns Un Observable que emite la respuesta JSON con los datos de la solicitud.
   */
   getMostrarDatos(idSolicitud: string | null): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(MOSTAR_API('sat-t261701',idSolicitud));
  }

  /**
   * Obtiene los trámites asociados a un folio específico.
   *
   * @param follio - El folio del trámite a consultar. Puede ser una cadena o null.
   * @returns Un observable que emite la respuesta JSON con los trámites asociados.
   */
   getTramitesAsociados(follio: string | null): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(TRAMITES_ASOCIADOS('sat-t261701',follio));
  }

}