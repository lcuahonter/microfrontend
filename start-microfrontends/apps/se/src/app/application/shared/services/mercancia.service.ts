import {
  Catalogo,
  ENVIRONMENT,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MercanciaService {
  /**
   * URL del servidor donde se encuentra la API.
   */
  private readonly host: string;

  /**
   * @property {string} url
   * @description Ruta base para acceder a los archivos JSON utilizados en el trámite 110205.
   */
  url: string = '../../../../../assets/json/110205/';

  /**
   * Constructor del servicio IniciarService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * @method obtenerMenuDesplegable
   * @description
   * Obtiene un array de objetos `Catalogo` desde un archivo JSON ubicado en la URL especificada.
   * @param {string} fileName El nombre del archivo JSON desde el cual se obtendrán los datos.
   * @returns {Observable<Catalogo[]>} Un observable que emite un array de objetos `Catalogo`.
   * @usageNotes
   * Este método construye la URL completa añadiendo el `fileName` a la URL base (`this.url`)
   * y realiza una solicitud HTTP GET para recuperar los datos.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASE_URL = this.url + fileName;
    return this.http
      .get<RespuestaCatalogos>(BASE_URL)
      .pipe(map((response) => response.data));
  }
}
