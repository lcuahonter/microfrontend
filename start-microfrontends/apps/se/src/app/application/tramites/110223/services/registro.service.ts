import { ColumnasTabla, SeleccionadasTabla } from '../models/registro.model';
import { ENVIRONMENT, JSONResponse, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para gestionar las solicitudes relacionadas con los catálogos y datos del trámite 110223.
 * Este servicio proporciona métodos para recuperar catálogos desde archivos JSON locales y desde servidores remotos.
 */
@Injectable({
  providedIn: 'root',
})
export class RegistroService {

  /**
   * URL base del servidor principal.
   * Se utiliza para peticiones directas al backend principal.
   */
  URL_SERVER = ENVIRONMENT.URL_SERVER;

  /**
   * URL base del servidor de catálogos auxiliares.
   * Se usa para recuperar información adicional desde el servidor auxiliar.
   */
  URL_SERVER_CATALOGOS = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    // Constructor utilizado para inyección de dependencias.
  }

  /**
   * Obtiene el catálogo de tratados.
   * @returns Observable con la respuesta del catálogo de tratados.
   */
  getTratado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/tratado.json');
  }

  /**
   * Obtiene el catálogo de países.
   * @returns Observable con la respuesta del catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/pais.json');
  }

  /**
   * Obtiene el catálogo de idiomas.
   * @returns Observable con la respuesta del catálogo de idiomas.
   */
  getIdioma(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/idioma.json');
  }

  /**
   * Obtiene el catálogo de países de destino.
   * @returns Observable con la respuesta del catálogo de países de destino.
   */
  getPaisDestino(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/pais.json');
  }

  /**
   * Obtiene el catálogo de transportes.
   * @returns Observable con la respuesta del catálogo de transportes.
   */
  getTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/pais.json');
  }

  /**
   * Obtiene el catálogo de entidades.
   * @returns Observable con la respuesta del catálogo de entidades.
   */
  getEntidad(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/entidad.json');
  }

  /**
   * Obtiene el catálogo de representaciones.
   * @returns Observable con la respuesta del catálogo de representaciones.
   */
  getRepresentacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/entidad.json');
  }

  /**
   * Obtiene el catálogo de tipos de factura.
   * @returns Observable con la respuesta del catálogo de tipos de factura.
   */
  getTipoFactura(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/tipofactura.json');
  }


  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns Observable con la respuesta del catálogo de unidades de medida.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110223/umc.json');
  }

  /**
   * Obtiene un catálogo específico por su identificador.
   * @param id Identificador del catálogo.
   * @returns Observable con la respuesta del catálogo solicitado.
   */
  getCatalogoById(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.URL_SERVER_CATALOGOS}/${id}`);
  }

  /**
   * Recupera la lista de solicitudes desde un archivo JSON local.
   * @returns Observable que contiene un arreglo de objetos de tipo ColumnasTabla.
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  getSolicitudesTabla(): Observable<ColumnasTabla[]> {
    return this.http.get<ColumnasTabla[]>('assets/json/110223/mercancia-disponsible.json').pipe(
      catchError((error) => throwError(() => error))
    );
  }

  /**
   * Recupera la lista de solicitudes seleccionadas desde un archivo JSON local.
   * @returns Observable que contiene un arreglo de objetos de tipo SeleccionadasTabla.
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  getSolicitudesDataTabla(): Observable<SeleccionadasTabla[]> {
    return this.http.get<SeleccionadasTabla[]>('assets/json/110223/mercancias-seleccionadas.json').pipe(
      catchError((error) => throwError(() => error))
    );
  }



}
