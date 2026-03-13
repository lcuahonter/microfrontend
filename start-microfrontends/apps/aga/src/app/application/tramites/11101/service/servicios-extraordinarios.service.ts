import { ENVIRONMENT, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite11101Store, Tramitenacionales11101State } from '../estados/tramite11101.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaMercancia } from '../models/transportacion-maritima.model';

/**
 * Representa la estructura estandarizada de una respuesta JSON para los servicios extraordinarios.
 *
 * Úsala para mapear y manejar respuestas de la API de forma consistente en el frontend.
 */
export interface JSONResponse {
  /**
   * Define el identificador único del recurso o entidad afectada.
   *
   * - **Usa este valor** para relacionar respuestas con registros específicos.
   * - **Requiere** ser un número entero positivo.
   * 
   * @example
   * const id = response.id; // 101
   */
  id: number;

  /**
   * Establece una descripción legible del resultado de la operación.
   *
   * - **Muestra este mensaje** al usuario en la interfaz si es necesario.
   * - **Interpreta el contenido** para entender el estado general de la petición.
   *
   * @example
   * const msg = response.descripcion; // "Operación realizada con éxito"
   */
  descripcion: string;

  /**
   * Define el código de estado estandarizado para la respuesta.
   *
   * - **Controla el flujo** de la aplicación según el código.
   * - **Verifica si es éxito o error** con códigos como "OK_200", "ERR_400", etc.
   *
   * @example
   * if (response.codigo === 'OK_200') { mostrarToast('Éxito'); }
   */
  codigo: string;

  /**
   * Contiene datos adicionales de la respuesta como texto o JSON stringificado.
   *
   * - **Parsea esta cadena** si esperas un objeto: `JSON.parse(response.data)`
   * - **Maneja aquí información detallada**, como errores técnicos o resultados procesados.
   *
   * @example
   * const extra = JSON.parse(response.data); // { detalle: "Trámite duplicado" }
   */
  data: string;
}


/**
 * Marca la clase como un proveedor inyectable y disponible en el sistema de inyección de dependencias de Angular.
 *
 * El decorador `@Injectable` permite que Angular cree instancias de esta clase y la inyecte en otros componentes o servicios.
 *
 * @decorator Injectable
 * 
 * @property {providedIn: 'root'} - Indica que este servicio será provisto en el inyector raíz (root injector),
 *   lo que significa que estará disponible de forma global en toda la aplicación como un singleton.
 *   Esto optimiza la carga y evita múltiples instancias del servicio.
 */
@Injectable({
  providedIn: 'root',
})

export class TramiteFolioService {
  /**
    * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
    */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient, private store: Tramite11101Store) { }
 /**
     * Actualiza el estado del formulario en el store con los datos proporcionados.
     * @param DATOS Objeto con los datos del formulario de tipo Solicitud10301State.
     */

  actualizarEstadoFormulario(DATOS: Tramitenacionales11101State): void {
    this.store.setNumeroderegistro(DATOS.numeroderegistro);
    this.store.setNobmreDenominationRazonSocial(DATOS.NobmreDenominationRazonSocial);
    this.store.setRfctaxid(DATOS.rfctaxid);
    this.store.setTelefono(DATOS.Telefono);
    this.store.setCorreoelectronico(DATOS.correoelectronico);
    this.store.setEntidadadfederativa(DATOS.numeroderegistro);
    this.store.setAlcadilamunicipio(DATOS.alcadilamunicipio);
    this.store.setColonia(DATOS.colonia);
    this.store.setCodigopostal(DATOS.codigopostal);
    this.store.setCalle(DATOS.calle);
    this.store.setNumeroletraexterior(DATOS.numeroletraexterior);
    this.store.setNumeroletrainterior(DATOS.numeroletrainterior);
    this.store.setEntrecalle(DATOS.entrecalle);
    this.store.setYcalle(DATOS.ycalle);
  }

  /**
   * Obtiene los datos del trámite desde un archivo JSON local.
   * @returns Observable con el estado del trámite nacional (Tramitenacionales11101State).
   */
  public getDatosDeTrtamitelDoc(): Observable<Tramitenacionales11101State> {
    return this.http.get<Tramitenacionales11101State>(
      '/assets/json/11101/aviso-tramite-data.json'
    );
  }

  /**
   * Obtenga una lista ficticia de entidadfederativa
   */
  getEntidadfederativa(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/entidades.json`);
  }

  /**
   * Obtenga una lista ficticia de alcadilamunicipio
   */
  getAlcadilamunicipio(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/municipios.json`);
  }

  /**
   * Obtenga una lista ficticia de colonia
   */
  getColonia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/colonias.json`);
  }

  /**
   * Obtenga una lista ficticia de formaParteDePatrimonio
   */
  getFormaParteDePatrimonio(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/formaParteDePatrimonio.json`);
  }

  /**
   * Obtenga una lista ficticia de unidadmedida
   */
  getUnidadmedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/unidadmedida.json`);
  }

  /**
   * Obtenga una lista ficticia de moneda
   */
  getMoneda(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/moneda.json`);
  }

  /**
   * Obtenga una lista ficticia de fin
   */
  getFin(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/fin.json`);
  }

  /**
   * Obtenga una lista ficticia de estado
   */
  getEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11101/estado.json`);
  }

  /**
   * Simula la adición de una nueva mercancía extraordinaria.
   * @returns Observable con la respuesta del servidor en formato JSONResponse.
   */
  agregar(): Observable<RespuestaMercancia> {
    return this.http.get<RespuestaMercancia>(`assets/json/11101/agregar.json`);
  }
  
}



