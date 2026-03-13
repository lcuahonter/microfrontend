import { Avisos32511State } from '../../../estados/tramites/tramite32511.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

/**
 * Servicio AvisoService para manejar la obtención de datos relacionados con el aviso de destrucción de mercancías.
 * Este servicio se encarga de realizar peticiones HTTP para obtener los documentos seleccionados.
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para manejar la obtención de datos relacionados con el aviso de destrucción de mercancías.
 */
export class AvisoService {

  /**
   * Constructor del servicio AvisoService.
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient
  ) { 
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32511/documentos-seleccionados.json');
  }

  /**
   * Obtiene el catálogo de las entidades federativas.
   * @returns Observable con la respuesta del catálogo.
   */
  getEntidadFederativaCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32511/entidad-federativa.json');
  }

  /**
   * Obtiene el catálogo de las alcaldías o municipios.
   * @returns Observable con la respuesta del catálogo.
   */
  getAlcaldiaMunicipioCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32511/alcaldia-municipio.json');
  }

  /**
   * Obtiene el catálogo de las colonias.
   * @returns Observable con la respuesta del catálogo.
   */
  getColoniaCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32511/colonia.json');
  }

  /**
   * Obtiene los datos del aviso de destrucción de mercancías.
   * @returns Observable con los datos del avisos.
   */
  getAvisosDatos(): Observable<Avisos32511State> {
    return this.http.get<Avisos32511State>('assets/json/10303/avisos-datos.json');
  }
}
