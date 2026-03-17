import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';

/**
 * Servicio para la captura de solicitudes.
 * Proporciona métodos para interactuar con los datos relacionados con las solicitudes.
 *
 * @providedIn `root` - Este servicio está disponible de forma global en la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class CapturaSolicitudeService {
  /**
   * Constructor del servicio.
   *
   * @param http - Cliente HTTP utilizado para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient) {
    // no hacer nada
  }

  /**
   * Obtiene el catálogo de bancos desde un archivo JSON local.
   *
   * @returns Un observable que emite los datos del catálogo de bancos.
   */
  getBanco(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/230101/banco.json');
  }
}
