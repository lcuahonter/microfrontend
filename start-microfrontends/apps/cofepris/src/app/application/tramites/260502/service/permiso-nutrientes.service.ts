import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROC_260502 } from '../server/api-route';
import { Solicitud260502State } from '../../../estados/tramites/260502/tramite260502.store';
import { Tramite260502Query } from '../../../estados/queries/260502/tramite260502.query';


@Injectable({
  providedIn: 'root'
})
export class PermisoVegetalesNutrientesService {

  constructor(
    private query: Tramite260502Query,
    private http: HttpClient,
    public httpService: HttpCoreService,
  ) { }

  /**
     * Obtiene todos los datos del estado almacenado en el store.
     * @returns {Observable<Solicitud260502State>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Solicitud260502State> {
    return this.query.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_260502.GUARDAR, { body: body });
  }
}
