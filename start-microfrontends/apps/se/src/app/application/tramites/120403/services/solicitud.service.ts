
import { COMUN_URL, GUARDAR_SOLICITUD } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { Observable, combineLatest, map } from 'rxjs';
import { Tramite120403State, Tramite120403Store } from '../estados/store/tramite120403.store';
import { BUSCAR_ASIGNACION_DATOS } from '../../../shared/servers/api-route';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite120403Query } from '../estados/queries/tramite120403.query';
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  /**
   * Host base para las solicitudes HTTP.
   */
  host!: string;
/**
   * @constructor
   * @description
   * Constructor que inyecta `HttpClient` para realizar solicitudes HTTP y `Tramite120404Store`
   * para gestionar el estado del trámite.
   *
   * @param {HttpClient} http - Servicio HTTP para la obtención de datos.
   * @param {Tramite120404Store} tramite120404Store - Tienda Akita para la gestión del estado.
   */
  constructor(private http:HttpClient,private tramite120404Store: Tramite120403Store ,
    private tramite120404Query: Tramite120403Query
  ) { 
    this.host = `${COMUN_URL.BASE_URL}`;
  }
 
  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param {Tramite120404State} DATOS - Datos del trámite que se van a establecer en el estado.
   */
  actualizarEstadoFormulario(DATOS:Tramite120403State): void {
    this.tramite120404Store.establecerDatos(DATOS);
  }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns {Observable<Tramite120403State>} - Un observable que emite el estado del trámite.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite120403State> {
    return this.http.get<Tramite120403State>('assets/json/120403/asignciondirecta.json');
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * @param payload - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @param idTipoTramite - Identificador del tipo de trámite para construir la URL de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(tramite: string,payload: Record<string, unknown>): Observable<JSONResponse> {
    const ENDPOINT = `${this.host}${GUARDAR_SOLICITUD(tramite)}`;
    return this.http.post<JSONResponse>(ENDPOINT, payload).pipe(
      map((response) => response)
    );
  }

  /**
   * @description
   * Utility function to merge multiple state objects.
   * Removes duplicate keys and retains only meaningful values.
   * @param {...Record<string, any>} states - List of state objects to merge.
   * @returns {Record<string, unknown>} Merged state object.
   */
  private static mergeStates(...states: Record<string, unknown>[]): Record<string, unknown> {
    const RESULT: Record<string, unknown> = {};

    for (const STATE of states) {
      for (const [KEY, VALUE] of Object.entries(STATE)) {
        const EXISTING = RESULT[KEY];

        const IS_MEANINGFUL = VALUE !== null && VALUE !== undefined &&
          !(typeof VALUE === 'string' && VALUE.trim() === '') &&
          !(Array.isArray(VALUE) && VALUE.length === 0);

        if (!EXISTING || IS_MEANINGFUL) {
          RESULT[KEY] = VALUE;
        }
      }
    }
    return RESULT;
  }

   /**
    * @description
    * Obtiene el estado completo combinando múltiples fuentes de estado.
    * @returns {Observable<Record<string, unknown>>} Observable que emite el estado combinado.
    */
     getAllState(): Observable<Record<string, unknown>> {
       return combineLatest([
         this.tramite120404Query.allStoreData$,
       ]).pipe(
         map(([tramite120404Query,]) =>
           SolicitudService.mergeStates(
              tramite120404Query as unknown as Record<string, unknown>,
           )
         )
       );
     }
 

   /**
     * Realiza una solicitud POST para buscar datos relacionados con la asignación específica "120403".
     *
     * @param body - Objeto que contiene los datos necesarios para la búsqueda.
     * @returns Un Observable que emite la respuesta de la solicitud HTTP.
     */
    getBuscarDatosDos(body:any): Observable<any> {
      return this.http.post<any>(BUSCAR_ASIGNACION_DATOS("120403"),body).pipe(
        map((response) => response)
      );
    } 
  
}
