import { RespuestaConsulta, RespuestaMercancia } from '../models/exencion-impuestos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite10302Store } from '../estados/tramite10302.store';

/**
 * Servicio para gestionar datos relacionados con el trámite de exención de impuestos.
 * Este servicio proporciona métodos para obtener catálogos y datos relacionados con importadores y exportadores.
 */
@Injectable({
  providedIn: 'root',
})
export class ExencionImpuestosService {
  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param http Servicio HTTP para realizar solicitudes a recursos externos.
   * @param store Store de Akita para gestionar el estado del trámite.
   */
  constructor(private http: HttpClient, private store: Tramite10302Store) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene el catálogo de aduanas por las que ingresará la mercancía.
   * @returns Observable con la respuesta del catálogo de aduanas.
   */
  getAduana(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10302/aduanaIngresara.json');
  }

  /**
   * Obtiene el catálogo de tipos de mercancía.
   * @returns Observable con la respuesta del catálogo de tipos de mercancía.
   */
  getTipoDeMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10302/tipo-de-mercancia.json');
  }

  /**
   * Obtiene el catálogo de condiciones de la mercancía.
   * @returns Observable con la respuesta del catálogo de condiciones de la mercancía.
   */
  getCondicionMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10302/condicion-mercancia.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns Observable con la respuesta del catálogo de unidades de medida.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10302/unidad-medida.json');
  }

  /**
   * Obtiene el catálogo de años disponibles.
   * @returns Observable con la respuesta del catálogo de años.
   */
  getAno(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10302/ano.json');
  }

  /**
   * Obtiene el catálogo de países disponibles.
   * @returns Observable con la respuesta del catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10302/pais.json');
  }

  /**
   * Obtiene los datos relacionados con las mercancías.
   * @returns Observable con la respuesta de los datos de mercancías.
   */
  agregarMercancias(): Observable<RespuestaMercancia> {
    return this.http.get<RespuestaMercancia>('assets/json/10302/mercanciaDatos.json');
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consultaDatos.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(`assets/json/10302/consultaDatos.json`);
  }
}
