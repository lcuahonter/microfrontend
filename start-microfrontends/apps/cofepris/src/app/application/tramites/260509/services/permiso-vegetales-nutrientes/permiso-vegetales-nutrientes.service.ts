import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROC_260509 } from '../../servers/api-route';
import { Solicitud260509State } from '../../../../estados/tramites/260509/tramite260509.store';
import { Tramite260509Query } from '../../../../estados/queries/260509/tramite260509.query';

@Injectable({
  providedIn: 'root'
})
export class PermisoVegetalesNutrientesService {

  constructor(
    private query: Tramite260509Query,
    private http: HttpClient,
    public httpService: HttpCoreService,
  ) { }

  /**
     * Obtiene todos los datos del estado almacenado en el store.
     * @returns {Observable<Solicitud260509State>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Solicitud260509State> {
    return this.query.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_260509.GUARDAR, { body: body });
  }
}
