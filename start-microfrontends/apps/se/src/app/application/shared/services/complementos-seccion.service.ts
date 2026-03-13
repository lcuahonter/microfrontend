
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  NacionalidadMaxicana,
  RespuestaCatalogos,
} from '../models/complimentos-seccion.model';

/**
 * Servicio para manejar las operaciones relacionadas con la sección de complementos.
 * Este servicio proporciona métodos para obtener datos de nacionalidades, tipos de personas,
 * estados y países desde archivos JSON locales.
 */
@Injectable({
  providedIn: 'root', // Proporciona el servicio a toda la aplicación
})
export class ComplementosSeccionService {
  constructor(private http: HttpClient) {
    // Constructor del servicio
  }

  /**
   * Obtiene los datos de nacionalidad mexicana desde un archivo JSON.
   * @returns {Observable<NacionalidadMaxicana[]>} Observable con los datos de nacionalidad mexicana.
   */
  getNacionalidadMaxicanaData(): Observable<NacionalidadMaxicana[]> {
    return this.http.get<NacionalidadMaxicana[]>(
      'assets/json/260401/radioSiNo.json' // Ruta del archivo JSON
    );
  }

  /**
   * Obtiene los datos de tipo de persona desde un archivo JSON.
   * @returns {Observable<NacionalidadMaxicana[]>} Observable con los datos de tipo de persona.
   */
  getTipoPersonaData(): Observable<NacionalidadMaxicana[]> {
    return this.http.get<NacionalidadMaxicana[]>(
      'assets/json/80103/tipo_persona.json' // Ruta del archivo JSON
    );
  }

  /**
   * Obtiene los datos de estados desde un archivo JSON.
   * @returns {Observable<RespuestaCatalogos>} Observable con los datos de estados.
   */
  getEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/130118/regimen-mercancia.json' // Ruta del archivo JSON
    );
  }

  /**
   * Obtiene los datos de países desde un archivo JSON.
   * @returns {Observable<RespuestaCatalogos>} Observable con los datos de países.
   */
  getPaiseData(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/130118/regimen-mercancia.json' // Ruta del archivo JSON
    );
  }
}