import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ManifiestosRespuesta } from '../../models/prestadores-servicio.model';
import { ManiobrasMercancias202State } from '../../../../core/estados/tramites/tramite202.store';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

/**
 * Servicio para obtener datos de manifiestos y aduanas.
 */
@Injectable({
  /**
   * Proporciona el servicio a nivel raíz de la aplicación.
   */
  providedIn: 'root'
})

/**
 * Clase que representa el servicio de Prestadores de Servicio.
 */
export class PrestadoresServicioService {

  /**
   * Constructor del servicio.
   * @param http - Servicio HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtiene la lista de manifiestos desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los manifiestos.
   */
  getManifiestos(): Observable<ManifiestosRespuesta> {
    return this.http.get<ManifiestosRespuesta>('assets/json/202/manifiestos.json');
  }

  /**
   * Obtiene la lista de aduanas desde un archivo JSON.
   * 
   * @param catalogo - Parámetro que indica el catálogo de aduanas.
   * @returns Observable con la respuesta de las aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/202/aduana.json');
  }

  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/202/documentos-seleccionados.json');
  }

  /**
   * Obtiene los datos de los prestadores de servicio desde un archivo JSON.
   * 
   * @returns Observable con el estado de maniobras y mercancías.
   */
  obtenerPrestadoresServicioDatos(): Observable<ManiobrasMercancias202State> {
    return this.http.get<ManiobrasMercancias202State>('assets/json/202/prestadores-servicio.json');
  }
}
