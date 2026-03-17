import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MercanciaInstalada } from '../models/exencion-impuestos.model';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
@Injectable({
  providedIn: 'root',
})
export class ExencionDeImpuestosService {
  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param http Servicio HTTP para realizar solicitudes.
   * @param store Store de Akita para gestionar el estado.
   */
  constructor(private http: HttpClient) {
    // El constructor se utiliza para la inyección de dependencias.
  }
  /**
   * Obtiene el catálogo de aduanas por las que ingresará la mercancía.
   * @returns Observable con la respuesta del catálogo de aduanas.
   */
  getAduanaIngresara(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/aduanaIngresara.json'
    );
  }
  /**
   * Método `getusoEspecifico` que obtiene el catálogo de "uso específico".
   * Carga los datos desde un archivo JSON localizado en `assets/json/10703/finalCualDestinara.json`.
   *
   * @returns Observable de `RespuestaCatalogos` con los datos del catálogo.
   */
  getusoEspecifico(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/finalCualDestinara.json'
    );
  }

  /**
   * Método `getMercanciaTbl` que obtiene los datos de la tabla de mercancías.
   * Carga los datos desde un archivo JSON localizado en `assets/json/10703/mercancia-table.json`.
   *
   * @returns Observable de `TableDataNgTable` con los datos de la tabla de mercancías.
   */
  getMercanciaTbl(): Observable<MercanciaInstalada[]> {
    return this.http.get<MercanciaInstalada[]>(
      'assets/json/10703/mercancia-table.json'
    );
  }

  /**
   * Método `getPais` que obtiene el catálogo de países.
   * Carga los datos desde un archivo JSON localizado en `assets/json/10703/pais.json`.
   *
   * @returns Observable de `RespuestaCatalogos` con los datos del catálogo de países.
   */
  getPais(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10703/pais.json');
  }

  /**
   * Obtiene el catálogo de años disponibles.
   * @returns Observable con la respuesta del catálogo de años.
   */
  getAno(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/10703/ano.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns Observable con la respuesta del catálogo de unidades de medida.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/unidad-medida.json'
    );
  }

  /**
   * Obtiene el catálogo de condiciones de la mercancía.
   * @returns Observable con la respuesta del catálogo de condiciones de la mercancía.
   */
  getCondicionMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/condicion-mercancia.json'
    );
  }

  /**
   * Obtiene el catálogo de tipos de mercancía.
   * @returns Observable con la respuesta del catálogo de tipos de mercancía.
   */
  getTipoDeMercancia(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/tipo-de-mercancia.json'
    );
  }
  /**
   * Método `getInicializarDatos` que obtiene la información inicial de exención de impuestos.
   * Carga los datos desde un archivo JSON localizado en `assets/json/10703/exencionDelmpuestor.json`.
   *
   * @returns Observable de `RespuestaCatalogos` con los datos de exención de impuestos.
   */
  getInicializarDatos(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/exencionDelmpuestor.json'
    );
  }

  /**
   * Método `getInicializarMercancias` que obtiene la información inicial sobre mercancías.
   * Carga los datos desde un archivo JSON localizado en `assets/json/10703/donatario-datos.json`.
   *
   * @returns Observable de `RespuestaCatalogos` con los datos del donatario y mercancías.
   */
  getInicializarMercancias(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/10703/donatario-datos.json'
    );
  }
}
