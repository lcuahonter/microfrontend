import {
  Solicitud10703State,
  Tramite10703Store,
} from '../estados/tramite10703.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Solocitud10703Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(
    private http: HttpClient,
    private tramite10703Store: Tramite10703Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Establece la aduana en el estado del trámite 10703 usando los datos proporcionados.
   *
   * @param {Solicitud10703State} DATOS - Objeto que contiene la información del estado, incluyendo la aduana.
   */
  exencionDeMercancias(DATOS: Solicitud10703State): void {
    this.tramite10703Store.setAduana(DATOS.aduana);
  }

  /**
   * Obtiene los datos de exención de mercancías desde un archivo JSON local.
   *
   * @returns {Observable<Solicitud10703State>} Un observable con los datos del estado de la solicitud 10703.
   */
  getExencionDeMercanciasData(): Observable<Solicitud10703State> {
    return this.http.get<Solicitud10703State>(
      'assets/json/10703/exencion_de_mercancias.json'
    );
  }
}
