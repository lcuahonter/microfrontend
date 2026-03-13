import { Observable,catchError, throwError } from 'rxjs';
import { TercerosRelacionadosState, TercerosRelacionadosStore } from '../estados/stores/terceros-relacionados.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class TercerosRelacionadosService {

  /**
   * Inicializa una nueva instancia de la clase `TercerosRelacionadosService`.
   * 
   * @param http - Una instancia de `HttpClient` utilizada para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private tercerosRelacionadosStore: TercerosRelacionadosStore
  ) {
    // Constructor de la clase TercerosRelacionadosService
   }

  /**
   * Obtiene los datos del enlace operativo desde un archivo JSON local.
   *
   * @throws Lanzará un error si la solicitud HTTP falla.
   */
  getEnlaceOperativoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/31602/enlace_tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos de personas desde un archivo JSON local.
   *
   * @returns Un `Observable` que emite el `JSONResponse` con los datos de personas.
   */
  getPersonasParaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/31602/personas-tabla.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Recupera los datos de "Terceros Relacionados" realizando una solicitud HTTP GET
   * a un archivo JSON local. Retorna un observable que emite el estado obtenido.
   * Maneja los errores HTTP propagándolos a través del flujo del observable.
   *
   * @returns {Observable<TercerosRelacionadosState>} Un observable que emite el estado de "Terceros Relacionados".
   */
  getConsultaDatos(): Observable<TercerosRelacionadosState> {
    return this.http.get<TercerosRelacionadosState>('./assets/json/31602/consulta-tercer.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza el valor de un campo específico del formulario en el tercerosRelacionadosStore.
   *
   * @param campo - El nombre del campo del formulario a actualizar.
   * @param valor - El nuevo valor que se establecerá para el campo especificado. Puede ser string, number o boolean.
   */
  actualizarEstadoFormulario(campo: string, valor: string | number | boolean): void {
      this.tercerosRelacionadosStore.setDynamicFieldValue(campo, valor);
  }
}
