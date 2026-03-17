import { RespuestaCaatTabla, RespuestaConsulta } from '../../models/transportacion-maritima.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RespuestaContribuyentePMNTabla } from '../../models/transportacion-maritima.model';
import { RespuestaContribuyenteTabla } from '../../models/transportacion-maritima.model';

/**
 * Servicio para la gestión de datos relacionados con la transportación marítima.
 * 
 * @class TransportacionMaritimaService
 * @description
 * Este servicio se encarga de realizar peticiones HTTP para obtener datos relacionados con la transportación marítima.
 */
@Injectable({
  providedIn: 'root'
})
export class TransportacionMaritimaService {

  /**
   * Constructor del servicio.
   * 
   * @constructor
   * @param {HttpClient} http Cliente HTTP para realizar peticiones
   */
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Obtiene el catálogo de países.
   * 
   * @method getPaisCatalogo
   * @returns {Observable<RespuestaCatalogos>} Observable con datos de países
   */
  getPaisCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/40402/pais-catalogo.json');
  }

  /**
   * Obtiene el catálogo de estados.
   * 
   * @method getEstadoCatalogo
   * @returns {Observable<RespuestaCatalogos>} Observable con datos de estados
   */
  getEstadoCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/40402/estado-catalogo.json');
  }

  /**
   * Obtiene el catálogo de municipios.
   * 
   * @method getMunicipioCatalogo
   * @returns {Observable<RespuestaCatalogos>} Observable con datos de municipios
   */
  getMunicipioCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/40402/municipio-catalogo.json');
  }

  /**
   * Obtiene el catálogo de colonias.
   * 
   * @method getColoniaCatalogo
   * @returns {Observable<RespuestaCatalogos>} Observable con datos de colonias
   */
  getColoniaCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/40402/colonia-catalogo.json');
  }

  /**
   * Obtiene el catálogo de empresas CAAT.
   * 
   * @method obtenerBuscarEmpresaCaat
   * @returns {Observable<RespuestaCaatTabla>} Observable con datos de empresas CAAT
   */
  obtenerBuscarEmpresaCaat(): Observable<RespuestaCaatTabla> {
    return this.http.get<RespuestaCaatTabla>('assets/json/40402/buscar-empresa-caat.json');
  }

  /**
   * Busca contribuyentes personas físicas nacionales.
   * 
   * @method buscarContribuyentePFN
   * @returns {Observable<RespuestaContribuyenteTabla>} Observable con datos de contribuyentes
   */
  buscarContribuyentePFN(): Observable<RespuestaContribuyenteTabla> {
    return this.http.get<RespuestaContribuyenteTabla>('assets/json/40402/buscar-contribuyente-pfn-datos.json');
  }

  /**
   * Busca contribuyentes personas morales nacionales.
   * 
   * @method buscarContribuyentePMN
   * @returns {Observable<RespuestaContribuyentePMNTabla>} Observable con datos de contribuyentes
   */
  buscarContribuyentePMN(): Observable<RespuestaContribuyentePMNTabla> {
    return this.http.get<RespuestaContribuyentePMNTabla>('assets/json/40402/buscar-contribuyente-pmn-datos.json');
  }

  /**
   * Obtiene datos de consulta para el trámite.
   * 
   * @method getDatosConsulta
   * @returns {Observable<RespuestaConsulta>} Observable con datos de consulta del trámite
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/40402/consulta_40402.json');
  }
}