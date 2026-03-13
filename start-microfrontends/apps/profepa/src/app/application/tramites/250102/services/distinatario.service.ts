import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Servicio encargado de obtener información sobre países y estados
 * desde archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
export class DistinatarioService {
  /**
   * Inicializa el servicio con la inyección de dependencias.
   * @param http Cliente HTTP para realizar peticiones a archivos JSON.
   */
  constructor(private http: HttpClient) {
    //
  }
  /**
   * Obtiene la lista de países desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Observable con la lista de países.
   */
  obtenerPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250102/pais.json');
  }

  /**
   * Método que obtiene los datos de estados desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'estado.json'.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de estados.
   */
  obtenerEstadoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250102/estado.json');
  }
}
