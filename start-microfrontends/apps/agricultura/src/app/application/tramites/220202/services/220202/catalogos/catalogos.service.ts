import {
  API_GET_CATALOGO_ADUANAS,
  API_GET_CATALOGO_BANCOS,
  API_GET_CATALOGO_CONSULTA_PAISES,
  API_GET_CATALOGO_FRACCIONES_ARANCELARIAS,
  API_GET_CATALOGO_FRACCION_ARANCELARIA,
  API_GET_CATALOGO_JUSTIFICACIONES_PAGO,
  API_GET_CATALOGO_MEDIO_TRANSPORTE,
  API_GET_CATALOGO_OFICINAS_INSPECCION,
  API_GET_CATALOGO_PUNTOS_VERIFICACION,
  API_GET_CATALOGO_PUNTO_INSPECCION,
  API_GET_CATALOGO_REGIMENES,
  API_GET_CATALOGO_REGIMENES_VIGENTES,
  API_GET_CATALOGO_RESTRICCIONES,
  API_GET_CATALOGO_TIPOS_PRODUCTO,
  API_GET_CATALOGO_UNIDADES_MEDIDA_COMERCIALES,
  API_GET_CATALOGO_USOS_MERCANCIA,
  API_GET_CATALOGO_VIDA_SILVESTRE,
  API_GET_DATOS_SOLICITUD,
  API_GET_SOLICITUDES_MOVILIZACION_NACIONAL,
  API_GET_SOLICITUDES_PAGO_DERECHOS,
  API_GET_SOLICITUDES_TERCEROS_RELACIONADOS,
} from '../../../../../core/server/api-router';
import { Observable, map } from 'rxjs';
import {
  PrellenadoSolicitud,
  PrellenadoSolicitudMovilizacionNacional,
  PrellenadoSolicitudPagoDerechos,
  PrellenadoSolicitudTercerosRelacionados,
} from '../../../models/220202/prellenado-solicitud.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Catalogo } from '@ng-mf/data-access-user';
import { ENVIRONMENT } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
   * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
   * Es de solo lectura y se inicializa en el constructor del servicio.
   */
  host: string;

  /**
   * Constructor del servicio que inicializa la URL base del host.
   * @param http Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene el catálogo de aduanas correspondiente a un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de aduanas.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de aduanas.
   */
  obtieneCatalogoAduana(tramite: number):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_ADUANAS(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
      * Obtiene el catálogo de fracciones correspondiente a un trámite específico.
      *
      * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo de fracciones.
      * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
      */
  obtieneCatalogoFraccionesArancelarias(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_FRACCIONES_ARANCELARIAS(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT)
      .pipe(
      // la clave se pasa como descripción y la descripción se obtiene de otro endpoint
        map((response: BaseResponse<Catalogo[]>) => ({
          ...response,
          datos: response.datos?.map(item => ({
            ...item,
            descripcion: `${item.clave}`
          })) ?? []
        }))
      );
  }

  /**
     * Obtiene el catálogo de nico para un trámite y clave de fracción especificos.
     *
     * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo.
     * @param cveFraccion - La clave de la fracción arancelaria a consultar.
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos correspondientes.
     */
  obtieneCatalogoNicoFraccionArancelaria(tramite: number, cveFraccion: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_FRACCION_ARANCELARIA(tramite.toString(), cveFraccion)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT)
      .pipe(
      // la clave se pasa como descripción y la descripción se obtiene de otro endpoint
        map((response: BaseResponse<Catalogo[]>) => ({
          ...response,
          datos: response.datos?.map(item => ({
            ...item,
            descripcion: `${item.clave}`
          })) ?? []
        }))
      );
  }

  /**
     * Obtiene el catálogo de unidades de medida comerciales para un trámite específico.
     *
     * @param tramite - El identificador numérico del trámite para el cual se requiere obtener el catálogo.
     * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
     */
  obtieneCatalogoUnidadesMedidaComerciales(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_UNIDADES_MEDIDA_COMERCIALES(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de usos de mercancía para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de usos de mercancía.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoUsosMercancia(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_USOS_MERCANCIA(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
  * Obtiene el catálogo de tipos producto para un trámite específico.
  *
  * @param tramite - El identificador numérico del trámite para el cual se requiere el tipo de producto.
  * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
  */
  obtieneCatalogoTiposProducto(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_TIPOS_PRODUCTO(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de oficinas de inspección para un trámite y aduana específicos.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo.
   * @param cveAduana - La clave de la aduana asociada al trámite.
   * @returns Un observable que emite la respuesta base con el arreglo de objetos de catálogo de oficinas de inspección.
   */
  obtieneCatalogoOficinasInspeccion(tramite: number, cveAduana: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_OFICINAS_INSPECCION(tramite.toString(), cveAduana)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de puntos de inspección para un trámite y OISA específicos.
   *
   * @param tramite - El identificador numérico del trámite.
   * @param oisa - El identificador de la OISA (Oficina de Inspección de Sanidad Agropecuaria).
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de puntos de inspección.
   */
  obtieneCatalogoPuntoInspeccion(tramite: number, oisa: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_PUNTO_INSPECCION(tramite.toString(), oisa)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de regímenes vigentes para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes vigentes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoRegimenesVigentes(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_REGIMENES_VIGENTES(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de restricciones para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes vigentes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoRestricciones(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_RESTRICCIONES(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de restricciones para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes vigentes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoMedioTransporte(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_MEDIO_TRANSPORTE(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

      /**
   * Obtiene el catálogo de restricciones para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes vigentes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoPuntoVerificacion(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_PUNTOS_VERIFICACION(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  /**
       * Obtiene el catálogo de paises.
     *
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos de paises.
     */
  obtieneCatalogoPaises(tramite: number):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_CONSULTA_PAISES(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

     /**
     * Obtiene el catálogo de paises.
     *
     * @returns Un observable que emite la respuesta base con el arreglo de catálogos de paises sin Mexico.
     */
  obtieneCatalogoPaisesD(tramite: number):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_CONSULTA_PAISES(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de bancos correspondiente a un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de bancos.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de aduanas.
   */
  obtieneCatalogoBanco(tramite: number):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_BANCOS(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

    /**
   * Obtiene el catálogo de bancos correspondiente a un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de justificación de pago.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de aduanas.
   */
  obtieneCatalogoJustificacion(tramite: number):Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_JUSTIFICACIONES_PAGO(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene una solicitud prellenada basada en los parámetros proporcionados.
   *
   * @param tramite - El identificador del trámite para el cual se obtiene la solicitud prellenada.
   * @param esPrellenado - Un booleano que indica si la solicitud debe estar prellenada.
   * @param idsolicitud - La clave única asociada al usuario o contexto.
   * @returns Un observable que emite un `BaseResponse` que contiene la solicitud prellenada (`PrellenadoSolicitud`).
   */
  obtenSolicitudPrellenado(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoSolicitud>> {
    const ENDPOINT = `${this.host}${API_GET_DATOS_SOLICITUD(tramite.toString(), esPrellenado, idsolicitud)}`;
    return this.http.get<BaseResponse<PrellenadoSolicitud>>(ENDPOINT);
  }

  /**
   * Obtiene una solicitud prellenada basada en los parámetros proporcionados.
   *
   * @param tramite - El identificador del trámite para el cual se obtiene la solicitud prellenada.
   * @param esPrellenado - Un booleano que indica si la solicitud debe estar prellenada.
   * @param idsolicitud - La clave única asociada al usuario o contexto.
   * @returns Un observable que emite un `BaseResponse` que contiene la solicitud prellenada (`PrellenadoSolicitud`).
   */
  obtenSolicitudPrellenadoMovilizacionNacional(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoSolicitudMovilizacionNacional>> {
    const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_MOVILIZACION_NACIONAL(tramite.toString(), esPrellenado, idsolicitud)}`;
    return this.http.get<BaseResponse<PrellenadoSolicitudMovilizacionNacional>>(ENDPOINT);
  }

  /**
   * Obtiene una solicitud prellenada de terceros relaciondos basada en los parámetros proporcionados.
   *
   * @param tramite - El identificador del trámite para el cual se obtiene la solicitud prellenada.
   * @param esPrellenado - Un booleano que indica si la solicitud debe estar prellenada.
   * @param idsolicitud - La clave única asociada al usuario o contexto.
   * @returns Un observable que emite un `BaseResponse` que contiene la solicitud prellenada (`PrellenadoSolicitudTercerosRelacionados`).
   */
  obtenSolicitudPrellenadoTercerosRelacionados(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoSolicitudTercerosRelacionados>> {
    const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_TERCEROS_RELACIONADOS(tramite.toString(), esPrellenado, idsolicitud)}`;
    return this.http.get<BaseResponse<PrellenadoSolicitudTercerosRelacionados>>(ENDPOINT);
  }

  /**
   * Obtiene una solicitud prellenada de terceros relaciondos basada en los parámetros proporcionados.
   *
   * @param tramite - El identificador del trámite para el cual se obtiene la solicitud prellenada.
   * @param esPrellenado - Un booleano que indica si la solicitud debe estar prellenada.
   * @param idsolicitud - La clave única asociada al usuario o contexto.
   * @returns Un observable que emite un `BaseResponse` que contiene la solicitud prellenada (`PrellenadoSolicitudPagoDerechos`).
   */
  obtenSolicitudPrellenadoPagoDerechos(tramite: number, esPrellenado: boolean, idsolicitud: string): Observable<BaseResponse<PrellenadoSolicitudPagoDerechos>> {
    const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_PAGO_DERECHOS(tramite.toString(), esPrellenado, idsolicitud)}`;
    return this.http.get<BaseResponse<PrellenadoSolicitudPagoDerechos>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de regímenes para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoRegimenes(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_REGIMENES(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de vida-silvestre.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere obtener los regímenes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoVidaSilvestre(tramite: number): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_VIDA_SILVESTRE(tramite.toString())}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

}
