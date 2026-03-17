import {
  API_GET_CAPITULOS,
  API_GET_FRACCIONES_TIGIE,
  API_GET_PARTIDAS,
  API_GET_SUBPARTIDAS,
  API_POST_AGREGAR_FRACCIONES
} from './model/api-router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Capitulo } from './model/request/tree-request';
import { ConsultaResultado } from './model/consultar-form.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

export interface FraccionesStore {
  fracciones: Capitulo[];
  selectedProgram: ConsultaResultado | null;
}

/**
 * Servicio para gestionar fracciones arancelarias
 */
@Injectable({
  providedIn: 'root'
})
export class FraccionesService {
  /**
   * URL del servidor donde se encuentra la API.
   */
  private urlServer = ENVIRONMENT.API_HOST;

  /**
   * Store para las fracciones
   */
  private _fraccionesStore = new BehaviorSubject<FraccionesStore>({
    fracciones: [],
    selectedProgram: null
  });

  /**
   * Observable del store
   */
  readonly fraccionesStore$ = this._fraccionesStore.asObservable();

  private _activacionCheck$ = new BehaviorSubject<boolean>(true);
  readonly activacionCheck$ = this._activacionCheck$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Activa/desactiva el check de los programas
   */
  setProgramCheckActivation(active: boolean): void {
    this._activacionCheck$.next(active);
  }

  /**
   * Obtiene las fracciones almacenadas
   */
  getFracciones(): Observable<Capitulo[]> {
    return this.fraccionesStore$.pipe(
      map((store) => store.fracciones)
    );
  }

  /**
   * Guarda el programa seleccionado
   */
  savePrograma(programa: ConsultaResultado): void {
    this._fraccionesStore.next({
      ...this._fraccionesStore.getValue(),
      selectedProgram: programa
    });
  }

  /**
   * Obtiene el programa seleccionado
   */
  getPrograma(): Observable<ConsultaResultado | null> {
    return this.fraccionesStore$.pipe(
      map((store) => store.selectedProgram)
    );
  }

  /**
   * Agrega fracciones al store
   */
  addFracciones(items: Capitulo[]): void {
    const CURRENT = this._fraccionesStore.getValue();
    const NEW_ITEMS = items.filter(
      (item) => !CURRENT.fracciones.some((c) => c.clave === item.clave)
    );
    this._fraccionesStore.next({
      ...CURRENT,
      fracciones: [...CURRENT.fracciones, ...NEW_ITEMS]
    });
  }

  /**
   * Elimina fracciones del store
   */
  eliminarFraccionesDelStore(items: Capitulo[]): void {
    const CURRENT = this._fraccionesStore.getValue();
    const TO_REMOVE_CODES = items.map((fraccion) => fraccion.clave);
    
    const UPDATED = CURRENT.fracciones.filter((c) => !TO_REMOVE_CODES.includes(c.clave));
    this._fraccionesStore.next({
      ...CURRENT,
      fracciones: UPDATED
    });
  }

  /**
   * Obtiene los capítulos de la TIGIE
   * @returns Observable con la lista de capítulos
   */
  getCapitulos(): Observable<BaseResponse<Capitulo[]>> {
    const URL = `${this.urlServer}${API_GET_CAPITULOS}`;
    return this.http.post<BaseResponse<Capitulo[]>>(URL, {});
  }

  /**
   * Obtiene las partidas de un capítulo
   * @param claveCapitulo Clave del capítulo
   * @returns Observable con la lista de partidas
   */
  getPartidas(claveCapitulo: string): Observable<BaseResponse<Capitulo[]>> {
    const URL = `${this.urlServer}${API_GET_PARTIDAS}?capitulo=${claveCapitulo}`;
    return this.http.post<BaseResponse<Capitulo[]>>(URL, {});
  }

  /**
   * Obtiene las subpartidas de una partida
   * @param clavePartida Clave de la partida
   * @returns Observable con la lista de subpartidas
   */
  getSubpartidas(clavePartida: string): Observable<BaseResponse<Capitulo[]>> {
    const CAPITULO = clavePartida.slice(0, 2);
    const PARTIDA = clavePartida.slice(2);
    const URL = `${this.urlServer}${API_GET_SUBPARTIDAS}?capitulo=${CAPITULO}&partida=${PARTIDA}`;
    return this.http.post<BaseResponse<Capitulo[]>>(URL, {});
  }

  /**
   * Obtiene las fracciones de una subpartida
   * @param claveSubpartida Clave de la subpartida
   * @returns Observable con la lista de fracciones
   */
  getFraccionesTigie(claveSubpartida: string): Observable<BaseResponse<Capitulo[]>> {
    const CAPITULO = claveSubpartida.slice(0, 2);
    const PARTIDA = claveSubpartida.slice(2, 4);
    const SUBPARTIDA = claveSubpartida.slice(4);
    const URL = `${this.urlServer}${API_GET_FRACCIONES_TIGIE}?capitulo=${CAPITULO}&partida=${PARTIDA}&subpartida=${SUBPARTIDA}`;
    return this.http.post<BaseResponse<Capitulo[]>>(URL, {});
  }

  /**
   * Agrega fracciones al programa PROSEC
   * @param cadenaFracciones Cadena de fracciones separadas por pipe (|)
   * @returns Observable con el resultado de la operación
   */
  postAgregarFracciones(cadenaFracciones: string): Observable<BaseResponse<unknown>> {
    // transformar cadenaFracciones a formato de parametros http
    const PARAMS = new HttpParams().set('cadenaFracciones', cadenaFracciones);
    const URL = `${this.urlServer}${API_POST_AGREGAR_FRACCIONES}`;
    return this.http.post<BaseResponse<unknown>>(URL, {}, { params: PARAMS });
  }

  /**
   * Elimina fracciones seleccionadas
   * @param fracciones Array de fracciones a eliminar
   * @returns Observable con resultado de la operación
   */
  eliminarFracciones(
    fracciones: Capitulo[]
  ): Observable<{ success: boolean; message: string }> {
    
    // Update store
    this.eliminarFraccionesDelStore(fracciones);

    return of({
      success: true,
      message: `${fracciones.length} fracción(es) eliminada(s) correctamente`
    }).pipe(delay(500));
  }

  /**
   * Elimina todas las fracciones
   * @returns Observable con resultado de la operación
   */
  eliminarTodasLasFracciones(): Observable<{
    success: boolean;
    message: string;
  }> {
    // Update store
    this._fraccionesStore.next({
      ...this._fraccionesStore.getValue(),
      fracciones: []
    });

    return of({
      success: true,
      message: 'Todas las fracciones han sido eliminadas correctamente'
    }).pipe(delay(500));
  }
}
