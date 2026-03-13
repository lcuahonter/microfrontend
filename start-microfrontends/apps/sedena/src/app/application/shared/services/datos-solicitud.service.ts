import { AppSedenaModule } from '../../app.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '../models/datos-solicitud.model';
import { Tramite240114State } from '../../tramites/240114/estados/tramite240114Store.store';
import { Tramite240117State } from '../../tramites/240117/estados/tramite240117Store.store';
import { Tramite240118State } from '../../tramites/240118/estados/tramite240118Store.store';
import { map } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: AppSedenaModule,
})
export class DatosSolicitudService {
 
  /**
    * URL base del servidor principal.
  */
    urlServer = ENVIRONMENT.API_HOST;

  /**
   * @property {string} jsonUrl
   * Ruta relativa al archivo JSON que contiene los datos del domicilio.
   * Usado para cargar información desde el frontend (assets).
   * @private
   */
  private jsonUrl = 'assets/json/sedena/domicilio.json';

  /**
  * Constructor del componente.
  * Inyecta el servicio `HttpClient` para realizar peticiones HTTP.
  */
  constructor(public httpServicios: HttpClient) { }

  /**
   * Obtiene una respuesta desde una URL y asigna los datos a una variable.
   *
   * @param {string} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
   * @param {string} url - La URL desde la cual se obtendrá la respuesta.
   * @param {Object} self - El objeto que contiene la variable donde se almacenarán los datos de la respuesta.
   * @returns {void}
   * @author Muneez
   * @remarks
   * Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
   * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
   * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
   */
  obtenerRespuestaPorUrl(self: any, variable: string, url: string): void {
    if (self && variable && url) {
      this.httpServicios
        .get<RespuestaCatalogos>(`assets/json${url}`)
        .subscribe((resp): void => {
          self[variable] = resp?.code === 200 && resp.data ? resp.data : [];
        });
    }
  }

  /**
   * Obtiene la lista de países desde el archivo JSON.
   *
   * @method obtenerListaPaises
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de países.
   */
  obtenerListaPaises(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/paises`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene la lista de entidades federativas (estados) desde el archivo JSON.
   *
   * @method obtenerListaEstados
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de estados.
   */
  obtenerListaEstados(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/estados`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene la lista de municipios desde el archivo JSON.
   *
   * @method obtenerListaMunicipios
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de municipios.
   */
  obtenerListaMunicipios(value: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/municipios-delegaciones?cveEntidad=${value}`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene la lista de localidades desde el archivo JSON.
   *
   * @method obtenerListaLocalidades
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de localidades.
   */
  obtenerListaLocalidades(value: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/municipio/${value}/localidades`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene la lista de códigos postales desde el archivo JSON.
   *
   * @method obtenerListaCodigosPostales
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de códigos postales.
   */
  obtenerListaCodigosPostales(value: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/municipio/${value}/localidades`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene la lista de colonias desde el archivo JSON.
   *
   * @method obtenerListaColonias
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de colonias.
   */
  obtenerListaColonias(value: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/municipio-delegacion/${value}/colonias`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de bancos desde el archivo JSON.
   *
   * @method obtenerBancos
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de bancos.
   */
  obtenerBancos(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/bancos`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el archivo JSON.
   *
   * @method obtenerFraccionesCatalogo
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de fracciones arancelarias.
   */
  obtenerFraccionesCatalogo(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/tramite/fracciones-arancelarias`;
    return this.httpServicios.get(ENDPOINT);
  }
  /**
   * Obtiene el catálogo de unidades de medida comercial (UMC) desde el archivo JSON.
   *
   * @method obtenerUMCCatalogo
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de UMC.
   */
  obtenerUMCCatalogo(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/unidades-medidas-comerciales`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tipos de moneda desde el archivo JSON.
   *
   * @method obtenerMonedaCatalogo
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de monedas.
   */
  obtenerMonedaCatalogo(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/tipos-monedas`;
    return this.httpServicios.get(ENDPOINT);
  }
  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos240118(): Observable<Tramite240118State> {
    return this.httpServicios.get<Tramite240118State>(
      'assets/json/240118/respuestaDeActualizacionDe.json'
    );
  }
  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatosQuimacs(): Observable<Tramite240117State> {
    return this.httpServicios.get<Tramite240117State>(
      'assets/json/240117/respuestaDeActualizacionDe.json'
    );
  }
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240114State> {
    return this.httpServicios.get<Tramite240114State>(
      'assets/json/240114/respuestaDeActualizacionDe.json'
    );
  }
  /**
  * Obtiene el catálogo de aduanas para el procedimiento indicado.
  * @param idProcedimiento - Identificador del procedimiento SAT.
  * @returns Observable con la lista de aduanas disponibles.
  */
  getAduanas(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/aduanas`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
  * Obtiene el catálogo de países asociados al procedimiento.
  * @param idProcedimiento - Identificador del procedimiento SAT.
  * @returns Observable con la lista de países disponibles.
  */
  getPaises(idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/paises`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
  * Consulta las unidades de medida asociadas a una fracción arancelaria.
  * @param cveFraccion - Clave de la fracción arancelaria.
  * @param idProcedimiento - Identificador del procedimiento SAT.
  * @returns Observable con la lista de unidades de medida aplicables.
  */
  setUMT(cveFraccion: string, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/catalogo/fraccion-arancelaria/${cveFraccion}/unidades-medida`;
    return this.httpServicios.get(ENDPOINT);
  }

  /**
  * Valida la información de las mercancías enviadas en la solicitud.
  * @param PAYLOAD - Datos de mercancías a validar.
  * @param idProcedimiento - Identificador del procedimiento SAT.
  * @returns Observable con el resultado de la validación.
  */
  validarMercancias(PAYLOAD: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/solicitud/validacion/mercancias`;
    return this.httpServicios.post(ENDPOINT, PAYLOAD);
  }

  /**
* Valida los datos generales capturados dentro del trámite.
* @param PAYLOAD - Información general a validar.
* @param idProcedimiento - Identificador del procedimiento SAT.
* @returns Observable con la respuesta de la validación.
*/
  validarDatos(PAYLOAD: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/solicitud/validacion/datos`;
    return this.httpServicios.post(ENDPOINT, PAYLOAD);
  }

  /**
 * Valida los datos del destinatario final dentro del trámite.
 * @param PAYLOAD - Datos del destinatario para validar.
 * @param idProcedimiento - Identificador del procedimiento SAT.
 * @returns Observable con el resultado de la validación.
 */
  validarDestinatario(PAYLOAD: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/solicitud/validacion/destinatario`;
    return this.httpServicios.post(ENDPOINT, PAYLOAD);
  }

  /**
   * Valida la información del proveedor dentro del trámite.
   * @param PAYLOAD - Datos del proveedor a validar.
   * @param idProcedimiento - Identificador del procedimiento SAT.
   * @returns Observable con la respuesta del servidor.
   */
  validarProveedor(PAYLOAD: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/solicitud/validacion/proveedor`;
    return this.httpServicios.post(ENDPOINT, PAYLOAD);
  }

  /**
 * Valida la información del pago de derechos correspondiente al trámite.
 * @param PAYLOAD - Datos del pago de derechos.
 * @param idProcedimiento - Identificador del procedimiento SAT.
 * @returns Observable con el resultado de la validación del pago.
 */
  validarPagoDerechos(PAYLOAD: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/solicitud/validacion/pago-derechos`;
    return this.httpServicios.post(ENDPOINT, PAYLOAD);
  }

  /**
  * Guarda la información completa del trámite después de todas las validaciones.
  * @param PAYLOAD - Datos completos del trámite a guardar.
  * @param idProcedimiento - Identificador del procedimiento SAT.
  * @returns Observable con el resultado del guardado.
  */
  validarGuardar(PAYLOAD: any, idProcedimiento: number): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t${idProcedimiento}/solicitud/guardar`;
    return this.httpServicios.post(ENDPOINT, PAYLOAD);
  }
}
