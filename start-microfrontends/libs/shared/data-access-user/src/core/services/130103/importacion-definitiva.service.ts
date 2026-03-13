import { Observable, map } from 'rxjs';
import { Catalogo} from '../../models/shared/catalogos.model';
import { CatalogoServices } from '../shared/catalogo.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * @Injectable
 * @providedIn root
 * @description
 * Decorador que marca la clase `ImportacionDefinitivaService` como un servicio inyectable en Angular.
 */
@Injectable({
  providedIn: 'root'
})

export class ImportacionDefinitivaService {

  /**
 * @constructor
 * @description
 * Constructor del servicio `ImportacionDefinitivaService`.
 * @param {HttpClient} http - Servicio de Angular para realizar solicitudes HTTP.
 */
  constructor(
    private http: HttpClient, private catalogoServices: CatalogoServices
  ) { }

  /**
 * @method getRegimenMercancia
 * @description
 * Obtiene el catálogo de régimen de mercancía desde un archivo JSON local.
 * @returns {Observable<RespuestaCatalogos>} Observable con los datos del catálogo de régimen de mercancía.
 */
  getRegimenMercancia(tramitesID: string): Observable<Catalogo[]> {
     return this.catalogoServices.regimenesCatalogo(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }
  /**
 * @method getClasifiRegimen
 * @description
 * Obtiene el catálogo de clasificación de régimen desde un archivo JSON local.
 * @returns {Observable<RespuestaCatalogos>} Observable con los datos del catálogo de clasificación de régimen.
 */
  getClasifiRegimen(tramitesID: string): Observable<Catalogo[]> {
    const PAYLOAD_DATOS = { tramite: 'TITPEX.130103', id: tramitesID };
    return this.catalogoServices.clasificacionRegimenCatalogo('130103', PAYLOAD_DATOS)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
 * @method getFraccionArancelaria
 * @description
 * Obtiene el catálogo de fracciones arancelarias desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de fracciones arancelarias.
 */
  getFraccionArancelaria(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130103')
      .pipe(
        map(res => res?.datos ?? [])
      );
  }
  /**
 * @method getUnidadDeMedida
 * @description
 * Obtiene el catálogo de unidades de medida desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de unidades de medida.
 */
  getUnidadDeMedida(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110209/unidad.json');
  }

  /**
 * @method getSolicitudMercancia
 * @description
 * Obtiene el catálogo de solicitudes de mercancía desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de solicitudes de mercancía.
 */
  getSolicitudMercancia(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/130102/solicitud_mercancia.json');
  }

  /**
 * @method getBloqueData
 * @description
 * Obtiene los datos del catálogo de bloques desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de bloques.
 */
  getBloqueData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/130103/bloque.json');
  }
}
