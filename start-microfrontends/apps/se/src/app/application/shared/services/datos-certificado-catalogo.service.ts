import { Catalogo, HttpCoreService, JsonResponseCatalogo } from '@libs/shared/data-access-user/src';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio global para el manejo de catálogos de certificados.
 * Proporciona métodos reutilizables para obtener datos de catálogos desde las APIs.
 */
@Injectable({
  providedIn: 'root'
})
export class DatosCertificadoCatalogoService {

  /**
   * URL base de la API
   */
  private readonly BASE_URL = ENVIRONMENT.API_HOST;
  
  /**
   * API nombre
   */
  private readonly API = ENVIRONMENT.API;
  
  /**
   * Catálogo de la API
   */
  private readonly CATALOGO = ENVIRONMENT.CATALOGO_URL;

  /**
   * Constructor del servicio
   * @param httpService Servicio HTTP para realizar las peticiones a la API
   */
  constructor(private httpService: HttpCoreService) {}

/**
 * Genera las rutas de la API para un procedimiento específico
 */
private getApiRoutes(procedure: string, procedureNo?: string) {
    return {
        IDIOMA: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/idioma`,
        ENTIDAD_FEDERATIVA: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/entidades-federativas`,
        REPRESENTACION_FEDERAL: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/representacion-federal/MEX`,
        PAIS: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/paises`,
        ACTIVIDAD_PRODUCTIVA: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/actividad-productiva-prosec`,
        TIPO_DOCUMENTO: procedureNo ? `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/tipo-documento/${procedureNo}` : '',
        MUNICIPIOS_MEX: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/municipio-mex`,
        TIPO_CATEGORIA: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/tipo-categoria`,
        SERVICIO_IMMEX: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/servicios-immex`,
        TIPO_INVERSION: `${this.BASE_URL}${this.API}/${procedure}${this.CATALOGO}/tipo-inversion`,
    };
}

  /**
   * Obtiene la lista de idiomas desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de idiomas
   */
  obtenerIdioma(procedure: string): Observable<JsonResponseCatalogo> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<JsonResponseCatalogo>(
      API_ROUTES.IDIOMA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de entidades federativas desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la respuesta JSON del catálogo de entidades federativas
   */
  obtenerEntidadFederativa(procedure: string): Observable<JsonResponseCatalogo> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<JsonResponseCatalogo>(
      API_ROUTES.ENTIDAD_FEDERATIVA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de representaciones federales desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la respuesta JSON del catálogo de representaciones federales
   */
  obtenerRepresentacionFederal(procedure: string): Observable<JsonResponseCatalogo> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<JsonResponseCatalogo>(
      API_ROUTES.REPRESENTACION_FEDERAL,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de países desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de países
   */
  obtenerPaises(procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.PAIS,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de actividades productivas desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de actividades productivas
   */
  obtenerActividadProductiva(procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.ACTIVIDAD_PRODUCTIVA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de tipos de documento desde la API.
   * @param procedureNo Número de procedimiento (requerido para tipos de documento)
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de tipos de documento
   */
  obtenerTipoDocumento(procedureNo: string, procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure, procedureNo);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.TIPO_DOCUMENTO,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de municipios mexicanos desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de municipios mexicanos
   */
  obtenerMunicipiosMex(procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.MUNICIPIOS_MEX,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de tipos de categoría desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de tipos de categoría
   */
  obtenerTipoCategoria(procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.TIPO_CATEGORIA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de servicios IMMEX desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de servicios IMMEX
   */
  obtenerServicioImmex(procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.SERVICIO_IMMEX,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de tipos de inversión desde la API.
   * @param procedure Procedimiento (por defecto: 'sat-t110202')
   * @returns Observable con la lista de tipos de inversión
   */
  obtenerTipoInversion(procedure: string = 'sat-t110202'): Observable<Catalogo[]> {
    const API_ROUTES = this.getApiRoutes(procedure);
    return this.httpService.get<Catalogo[]>(
      API_ROUTES.TIPO_INVERSION,
      {},
      false
    );
  }
}
