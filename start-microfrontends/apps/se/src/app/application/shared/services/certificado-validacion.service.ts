import { Catalogo, CatalogoServices } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../models/modificacion.enum';

@Injectable({
  providedIn: 'root'
})
export class CertificadoValidacionService {

  // eslint-disable-next-line no-empty-function
  constructor(private http: HttpClient, private catalogoServices: CatalogoServices) { }

  /**
   * Obtiene la lista de TratadoAcuerdo desde un archivo JSON local.
   * @method obtenerListaTratadoAcuerdo
   * @returns {Observable<Catalogo[]>} Observable con la lista de TratadoAcuerdo.
   */
  obtenerListaTratadoAcuerdo(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('./assets/json/110202/tratado-acuerdo.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de países bloque desde un archivo JSON local.
   * @method obtenerPaisBloque
   * @returns {Observable<Catalogo[]>} Observable con la lista de países bloque.
   */
  obtenerPaisBloque(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/pais-bloque.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de mercancías desde un archivo JSON local.
   * @method obtenerMercancia
   * @returns {Observable<Mercancia[]>} Observable con la lista de mercancías.
   */
  obtenerMercancia(): Observable<Mercancia[]> {
    return this.http
      .get<{ data: Mercancia[] }>('assets/json/110202/mercancia.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de idiomas desde un archivo JSON local.
   * @method obtenerIdioma
   * @returns {Observable<Catalogo[]>} Observable con la lista de idiomas.
   */
  obtenerIdioma(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/idioma.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON local.
   * @method obtenerEntidadFederativa
   * @returns {Observable<Catalogo[]>} Observable con la lista de entidades federativas.
   */
  obtenerEntidadFederativa(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/entidad-federativa.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON local.
   * @method obtenerRepresentacionFederal
   * @returns {Observable<Catalogo[]>} Observable con la lista de representaciones federales.
   */
  obtenerRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/representacion-federal.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
 * Obtiene la lista de facturas desde un archivo JSON local.
 * @method obtenerFacturas
 * @returns {Observable<Catalogo[]>} Observable con la lista de facturas.
 */
  obtenerFacturas(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/factura.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de UMC desde un archivo JSON local.
   * @method obtenerUmc
   * @returns {Observable<Catalogo[]>} Observable con la lista de UMC.
   */
  obtenerUmc(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/umc.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }
  /**
      * @method getDatos
      * Método para obtener datos desde un archivo JSON.
      * @returns {Observable<unknown>} Un Observable que emite los datos obtenidos o un error.
      */
  getDatos(tramitesID: string): Observable<any[]> {
    return this.catalogoServices.paisesCatalogo(tramitesID).pipe(
      map(res => res?.datos ?? [])
    );
  }
  
  /**
   * Obtiene la lista de países bloqueados para un trámite específico.
   * @param tramitesID - Identificador del trámite
   * @returns Observable con un arreglo de países bloqueados (o vacío si no hay datos)
   */
  getPaises(tramitesID: string, clave: string): Observable<any[]> {
    return this.catalogoServices.paisCatalogo(tramitesID, clave).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene el catálogo de tratados/acuerdos asociados a un trámite.
   * @param tramitesID - Identificador del trámite
   * @param tratadoAsociado - Clave del tratado asociado
   * @returns Observable con un arreglo de tratados (o vacío si no hay datos)
   */
  getTratadoCertificado(tramitesID: string): Observable<any[]> {
    return this.catalogoServices
      .tratadoCatalogoPais(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

}