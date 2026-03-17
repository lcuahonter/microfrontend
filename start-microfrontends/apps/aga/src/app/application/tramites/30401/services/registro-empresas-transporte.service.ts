import { Tramite30401Store, Tramites30401State } from '../estados/tramites30401.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para manejar las renovaciones de muestras de mercancías.
 * 
 * @remarks
 * Este servicio proporciona métodos para interactuar con la API relacionada con las renovaciones de muestras de mercancías.
 */
@Injectable({
  providedIn: 'root',
})
export class RegistroEmpresasTransporteService {

  /**
   * Constructor del servicio RegistroEmpresasTransporteService.
   * 
   * @param httpClient - Cliente HTTP inyectado para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private tramite30401Store: Tramite30401Store,
  ) {
       // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
 * Obtiene la lista de bancos desde un archivo JSON local.
 * 
 * @returns Un observable que emite un arreglo de objetos de tipo `Catalogo`.
 */
onBancoList(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/30401/banco-list.json');
}

/**
* Obtiene la lista de tipos de tránsito desde un archivo JSON local.
* 
* @returns Un observable que emite un arreglo de objetos de tipo `Catalogo`.
*/
tipoTransitoList(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/30401/tipode-transito-list.json');
}

/**
* Obtiene la lista de entidades federativas desde un archivo JSON local.
* 
* @returns Un observable que emite un arreglo de objetos de tipo `Catalogo`.
*/
entidadFederativaList(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/30401/entidad-federativa-list.json');
}

/**
* Obtiene la lista de delegaciones o municipios desde un archivo JSON local.
* 
* @returns Un observable que emite un arreglo de objetos de tipo `Catalogo`.
*/
delegacionMunicipioList(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/30401/municipio-delegacion-list.json');
}

/**
* Obtiene la lista de colonias desde un archivo JSON local.
* 
* @returns Un observable que emite un arreglo de objetos de tipo `Catalogo`.
*/
coloniaList(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/30401/colonia-list.json');
}

/**
* Obtiene el folio CAAT desde un archivo JSON local.
* 
* @returns Un observable que emite un objeto con un identificador opcional (`id`) y un valor (`value`).
*/
  cveFolioCaat(): Observable<{id?:number; value: string}> {
    return this.http.get<{id?:number; value: string}>('assets/json/30401/numero-caat.json');
  }

  /**
   * Obtiene la lista de Entidades Federativas.
   * 
   * @returns {Observable<any>} Un observable que contiene los datos de las entidades federativas.
   */
  getEntidadesFederativas(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`assets/json/30401/entidad-federativa-list.json`);
  }

 /**
   * Obtiene la lista de Municipios/Alcaldías.
   * 
   * @returns {Observable<any>} Un observable que contiene los datos de los municipios o alcaldías.
   */
  getMunicipiosAlcaldias(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`assets/json/30401/municipio-delegacion-list.json`);
  }

  /**
   * Obtiene la lista de colonias.
   * 
   * @returns {Observable<any>} Un observable que contiene los datos de las colonias.
   */
  getColonias(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`assets/json/30401/colonia-list.json`);
  }

  /**
 * Obtiene la lista de aduanas desde un archivo JSON local.
 * 
 * @returns {Observable<Catalogo[]>} Un observable que contiene un array con los datos de las aduanas.
 * 
 * El archivo JSON está ubicado en `assets/json/30401/aduanas`.
 */
  getAduanas(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`assets/json/30401/tipode-transito-list.json`);
  }
  

  /**
   * Actualiza el estado del formulario en el store global.
   *
   * @param datos - Objeto de tipo Tramites30401State con los datos a establecer en el store.
   * @returns {void}
   */
  actualizarEstadoFormulario(datos: Tramites30401State): void {
      this.tramite30401Store.establecerDatos(datos);
  }

  /**
   * Obtiene los datos de toma de muestras de mercancías desde un archivo JSON local.
   *
   * @returns {Observable<Tramites30401State>} Un observable que emite los datos del trámite 30401.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramites30401State> {
    return this.http.get<Tramites30401State>('assets/json/30401/empresas-transportistas-datos.json');
  }

}
