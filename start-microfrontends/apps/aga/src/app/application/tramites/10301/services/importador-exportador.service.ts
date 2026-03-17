import { Observable,tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RespuestaMercancia } from '../models/importador-exportador.model';
import { Tramite10301Store } from '../../10301/estados/tramite10301.store';

/**
 * Servicio para obtener datos relacionados con importadores y exportadores.
 * Proporciona métodos para obtener catálogos necesarios para el trámite,
 * como aduanas, años, condiciones, países, tipos de documentos y más.
 * Los datos obtenidos se almacenan en el estado mediante Akita Store.
 */
@Injectable({
  providedIn: 'root',
})
export class ImportadorExportadorService {
  /**
   * Constructor que inyecta dependencias necesarias para el servicio.
   * @param http Cliente HTTP para realizar peticiones a recursos JSON.
   * @param store Store de Akita para gestionar y actualizar el estado global.
   */
  constructor(private http: HttpClient, private store: Tramite10301Store) {
    // Constructor para inyección de dependencias
  }

  /**
   * Obtiene el catálogo de aduanas por las que ingresará la mercancía.
   * Los datos se guardan en el store para su uso posterior.
   * @returns Observable con la respuesta del catálogo de aduanas.
   */
  getAduanaIngresara(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10301/aduanaIngresara.json');
  }

  /**
   * Obtiene el catálogo de años disponibles para seleccionar.
   * Actualiza el estado con los datos obtenidos.
   * @returns Observable con la respuesta del catálogo de años.
   */
  getAno(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10301/ano.json');
  }

  /**
   * Obtiene el catálogo de condiciones de la mercancía.
   * Actualiza el estado con los datos obtenidos.
   * @returns Observable con la respuesta del catálogo de condiciones.
   */
  getCondicion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10301/condicion.json'
    );
  }

  /**
   * Obtiene el catálogo de países para selección en el trámite.
   * Actualiza el estado con los datos obtenidos.
   * @returns Observable con la respuesta del catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10301/pais.json');
  }

  /**
   * Obtiene el catálogo de fines de la mercancía.
   * Realiza una petición HTTP para obtener los fines posibles que puede tener la mercancía en el trámite.
   * 
   * @returns Observable con la respuesta del catálogo de fines de mercancía.
   */
  getFinesDeMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10301/fines.json');
  }

  /**
   * Obtiene el catálogo de tipos de documentos requeridos.
   * Actualiza el estado con los datos obtenidos.
   * @returns Observable con la respuesta del catálogo de tipos de documentos.
   */
  getTipoDocumento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10301/tipodocumento.json'
    ).pipe(
      tap(response => this.store.setTipoDocumento(response.data))
    );
  }

  /**
   * Obtiene el catálogo de documentos relacionados con el trámite.
   * Actualiza el estado con los datos obtenidos.
   * @returns Observable con la respuesta del catálogo de documentos.
   */
  getDocumentos(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10301/documentos.json'
    ).pipe(
      tap(response => this.store.setDocumentos(response.data))
    );
  }

  agregarMercancia(): Observable<RespuestaMercancia> {
    return this.http.get<RespuestaMercancia>(`assets/json/10301/mercancia-table.json`);
  }

}
