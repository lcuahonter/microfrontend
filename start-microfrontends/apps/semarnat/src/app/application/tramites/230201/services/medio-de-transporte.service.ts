import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

/**
 * Servicio para gestionar los medios de transporte.
 * 
 * Este servicio proporciona métodos para obtener datos relacionados con los medios de transporte
 * desde un archivo JSON alojado en los activos de la aplicación.
 * @providedIn `root`
 */
@Injectable({
  providedIn: 'root',
})
export class MediodetransporteService {
  
  /**
   * URL del archivo JSON que contiene los datos de medios de transporte.
   * @type {string}
   */
  private readonly url = './assets/json/230201/medioDeTransporte.json';

  /**
   * Constructor del servicio MediodetransporteService.
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    // no hacer nada
  }

  /**
   * @descripcion Obtiene una lista de medios de transporte desde el servidor.
   * @retorna Un observable que emite un arreglo de objetos de tipo `Catalogo`.
   */
  getMedioDeTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(this.url);
  }
}
