import { Tramite270201State, Tramite270201Store } from '../estados/tramites/tramite270201.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObraTablaDatos } from '../models/aviso-siglos.models'; 
import { Observable } from 'rxjs';
/**
 * @class SolicitudService
 * @description
 * Servicio encargado de realizar solicitudes HTTP para obtener datos relacionados 
 * con el trámite 270201. Proporciona métodos para recuperar información de diferentes 
 * catálogos como operación, movimiento, país, transporte, aduana, entre otros.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /** URL base para obtener catálogos JSON auxiliares */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  /**
   * @constructor
   * @description
   * Inicializa el servicio con una instancia de HttpClient para realizar solicitudes HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar las solicitudes.
   */
  constructor(private http: HttpClient, private tramite270201Store: Tramite270201Store) {
    // Lógica de inicialización si es necesario
  }

  /**
   * @method getOperacionData
   * @description
   * Obtiene los datos del catálogo de operaciones desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de operaciones.
   */
  getOperacionData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/operacion.json');
  }

  /**
   * @method getMovimientoData
   * @description
   * Obtiene los datos del catálogo de movimientos desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de movimientos.
   */
  getMovimientoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/movimiento.json');
  }

  /**
   * @method getPaisData
   * @description
   * Obtiene los datos del catálogo de países desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de países.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/pais.json');
  }

  /**
   * @method getTransporteData
   * @description
   * Obtiene los datos del catálogo de transportes desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de transportes.
   */
  getTransporteData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/transporte.json');
  }

  /**
   * @method getAduanaData
   * @description
   * Obtiene los datos del catálogo de aduanas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de aduanas.
   */
  getAduanaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/aduana.json');
  }

  /**
   * @method getMotivoData
   * @description
   * Obtiene los datos del catálogo de motivos desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de motivos.
   */
  getMotivoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/motivo.json');
  }

  /**
   * @method getMonedaData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getMonedaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/moneda.json');
  }

  /**
   * @method getArancelariaData
   * @description
   * Obtiene los datos del catálogo de fracciones arancelarias desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos arancelarios.
   */
  getArancelariaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/arancelaria.json');
  }

  /**
 * @method getObraDeArteTabla
 * @description
 * Obtiene los datos de las columnas para la tabla de obras de arte desde un archivo JSON localizado en 'assets/json/270201/obra-de-arte.json'.
 * @returns {Observable<string[]>} Un observable que emite un arreglo de cadenas (`string[]`) representando los datos de las columnas.
 */
  getObraDeArteTabla(): Observable<ObraTablaDatos> {
    return this.http.get<ObraTablaDatos>('assets/json/270201/obra-de-arte.json');
  }

  /**
 * Actualiza el estado del formulario con los datos proporcionados.
 *
 * @param DATOS - Objeto que contiene el nuevo estado del trámite (Tramite270201State).
 */
  actualizarEstadoFormulario(DATOS: Tramite270201State): void {
    if(DATOS.tipoDeOperacion){
      this.tramite270201Store.setOperacion(DATOS.tipoDeOperacion);
    }
     if(DATOS.tipoDeMovimiento){
      this.tramite270201Store.setMovimiento(DATOS.tipoDeMovimiento);
    }
    if(DATOS.motivo){
      this.tramite270201Store.setMotivo(DATOS.motivo);
    }
    if(DATOS.pais){
      this.tramite270201Store.setPais(DATOS.pais);
    }
    this.tramite270201Store.setCiudad(DATOS.ciudad);
    if(DATOS.medioTransporte){
      this.tramite270201Store.setTransporte(DATOS.medioTransporte);
    }
    if(DATOS.aduanaEntrada){
      this.tramite270201Store.setAduana(DATOS.aduanaEntrada);
    }
    this.tramite270201Store.setAutor(DATOS.autor);
    this.tramite270201Store.setTitulo(DATOS.titulo);
    this.tramite270201Store.setTecnica(DATOS.tecnicaDeRealizacion);
    this.tramite270201Store.setAlto(DATOS.alto);
    this.tramite270201Store.setAncho(DATOS.ancho);
    this.tramite270201Store.setProfundidad(DATOS.profundidad);
    this.tramite270201Store.setDiametro(DATOS.diametro);
    this.tramite270201Store.setVariables(DATOS.variables);
    this.tramite270201Store.setAnoDeCreacion(DATOS.anoDeCreacion);
    this.tramite270201Store.setAvaluo(DATOS.avaluo);
    if(DATOS.moneda){
      this.tramite270201Store.setMoneda(DATOS.moneda);
    }
    this.tramite270201Store.setPropietario(DATOS.propietario);
    if(DATOS.fraccionArancelaria){
      this.tramite270201Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    }
    this.tramite270201Store.setDescripcionArancelaria(DATOS.descripcionArancelaria);
    this.tramite270201Store.setObraDeArte(DATOS.ObraDeArte);
  }

  /**
 * Obtiene los datos del aviso de importación desde un archivo JSON local.
 * @returns Observable con el estado del trámite 270201.
 */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite270201State> {
    return this.http.get<Tramite270201State>('assets/json/270201/aviso-de-importacion.json');
  }
}
