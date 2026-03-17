import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RespuestaConsulta, RespuestaMercancia } from '../models/exencion-impuestos.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite103Store } from '../estados/tramite103.store';

/**
 * Interface para representar una opción de aduana.
 */
interface OpcionAduana {
  id?: string | number;
  value?: string | number;
  descripcion?: string;
  label?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Servicio para gestionar datos relacionados con el trámite de exención de impuestos.
 * Proporciona métodos para obtener catálogos y datos relacionados con importadores y exportadores.
 */
@Injectable({
  providedIn: 'root'
})
export class ExencionImpuestosService {
    /**
     * Obtiene el catálogo de opciones de aduana (opciones-aduana.json).
     * @returns Observable con la respuesta del catálogo de opciones de aduana.
     */
    getOpcionesAduana(): Observable<OpcionAduana[]> {
      return this.http.get<OpcionAduana[]>('assets/json/103/opciones-aduana.json');
    }
  /**
   * Constructor para inyección de dependencias.
   * @param {HttpClient} http - Cliente HTTP para realizar peticiones.
   * @param {Tramite103Store} store - Store para gestionar el estado del trámite.
   */
  constructor(private http: HttpClient, private store: Tramite103Store) {}

  /**
   * Obtiene el catálogo de aduanas por las que ingresará la mercancía.
   * @returns {Observable<RespuestaCatalogos>} Observable con el catálogo de aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/103/aduanaIngresara.json');
  }

  /**
   * Obtiene el catálogo de destinos de la mercancía.
   * @returns {Observable<RespuestaCatalogos>} Observable con el catálogo de destinos.
   */
  getDestinoMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/103/destinoMercancia.json');
  }

  /**
   * Obtiene el catálogo de condiciones de la mercancía.
   * @returns {Observable<RespuestaCatalogos>} Observable con el catálogo de condiciones.
   */
  getCondicionMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/103/condicion-mercancia.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns {Observable<RespuestaCatalogos>} Observable con el catálogo de unidades.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/103/unidad-medida.json');
  }

  /**
   * Obtiene el catálogo de años disponibles.
   * @returns {Observable<RespuestaCatalogos>} Observable con el catálogo de años.
   */
  getAno(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/103/ano.json');
  }

  /**
   * Obtiene el catálogo de países disponibles.
   * @returns {Observable<RespuestaCatalogos>} Observable con el catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/103/pais.json');
  }

  /**
   * Obtiene los datos relacionados con las mercancías.
   * @returns {Observable<RespuestaMercancia>} Observable con los datos de mercancías.
   */
  agregarMercancias(): Observable<RespuestaMercancia> {
    return this.http.get<RespuestaMercancia>('assets/json/103/mercanciaDatos.json');
  }

  /**
   * Obtiene los datos para la consulta del trámite.
   * @returns {Observable<RespuestaConsulta>} Observable con los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/103/consulta_103.json');
  }
}