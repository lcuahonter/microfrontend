import { BUSCAR, GUARDAR_API, MOSTAR_API, TRAMITES_ASOCIADOS } from '../../../shared/servers/api-route';
import { Observable,map} from 'rxjs';
import { RetirosCofepris261702State, Tramite261702Store } from '../../../estados/tramites/tramite261702.store';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src/core/services/shared/http/http.service';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite261702Query } from '../../../estados/queries/tramite261702.query';
/**
 * @Injectable
 * @providedIn root
 * @description
 * Decorador que marca la clase `ImportacionDefinitivaService` como un servicio inyectable en Angular.
 */

@Injectable({
  providedIn: 'root'
})
export class RetirosCofeprisService {

  /**
   * Crea una nueva instancia del servicio RetirosCofeprisService.
   * 
   * @param http Instancia de HttpClient utilizada para realizar solicitudes HTTP.
   * @param tramite261702Store Instancia de Tramite261702Store para gestionar el estado relacionado con el trámite 261702.
   * 
   * @remarks
   * Puede incluir lógica de inicialización adicional si es necesario.
   */
  constructor(private http: HttpClient, private tramite261702Store: Tramite261702Store,
    public httpService: HttpCoreService,private tramite261702Query:Tramite261702Query) { 
   // Lógica de inicialización si es necesario
  }

  /**
   * Obtiene los datos de importación definitiva desde un archivo JSON local.
   *
   * @returns Un observable que emite el estado de RetirosCofepris261702State con los datos de importación definitiva.
   */
   getImportacionDefinitivaData(): Observable<RetirosCofepris261702State> {
    return this.http.get<RetirosCofepris261702State>('assets/json/261702/registro_toma_muestras_mercancias.json');
    
  }

  /**
   * Actualiza el estado de un campo específico en el formulario del trámite 261702.
   *
   * @param campo - El nombre del campo del formulario que se desea actualizar.
   * @param valor - El nuevo valor que se asignará al campo especificado.
   */
   actualizarEstadoFormulario(campo: string, valor: unknown): void {
    this.tramite261702Store.setDynamicFieldValue(campo, valor);
  }


  /**
   * Realiza una solicitud POST para buscar datos asociados al RFC del representante legal.
   *
   * @param rfc - El RFC del representante legal a consultar.
   * @returns Un Observable que emite la respuesta JSON del servicio.
   */
  getBuscarDatos(rfc:string): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(BUSCAR("261702"), {rfc: rfc }).pipe(
      map((response) => response)
    );
  }

   /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<SolicitudDeRegistroTpl120101State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<RetirosCofepris261702State> {
    return this.tramite261702Query.allStoreData$;
  }


  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     *
     * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */
    guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
      return this.httpService.post<JSONResponse>( GUARDAR_API('261702'), { body: body });
    }
    /**
     * Obtiene los datos a mostrar para una solicitud específica.
     *
     * @param idSolicitud - El identificador numérico de la solicitud.
     * @returns Un Observable que emite la respuesta JSON con los datos de la solicitud.
     */
     getMostrarDatos(idSolicitud: string | null): Observable<JSONResponse> {
      return this.httpService.get<JSONResponse>(MOSTAR_API('sat-t261702',idSolicitud));
    }
     /**
       * Obtiene los trámites asociados a un folio específico.
       *
       * @param follio - El folio del trámite a consultar. Puede ser una cadena o null.
       * @returns Un observable que emite la respuesta JSON con los trámites asociados.
       */
       getTramitesAsociados(follio: string | null): Observable<JSONResponse> {
        return this.httpService.get<JSONResponse>(TRAMITES_ASOCIADOS('sat-t261702',follio));
      }
}
