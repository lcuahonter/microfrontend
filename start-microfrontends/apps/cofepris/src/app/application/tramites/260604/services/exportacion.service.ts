import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PermisoModel } from '@libs/shared/data-access-user/src/core/models/260604/aviso-exportacion.model';
import { Tramite260604Query } from '../estados/tramite260604Query.query';
import { Tramite260604State } from '../estados/tramite260604Store.store';

/**
 * @class ExportacionService
 * @descripcion
 * Servicio encargado de gestionar las operaciones relacionadas con la exportación
 * dentro del trámite 260604.  
 *
 * Proporciona métodos para:
 * - Obtener catálogos y datos estáticos desde archivos JSON.
 * - Recuperar información de permisos.
 * - Consultar el estado actual almacenado en el store mediante Tramite260604Query.
 *
 * Este servicio utiliza `HttpClient` para realizar solicitudes HTTP y sigue el
 * patrón de inyección de dependencias propio de Angular.
 */
@Injectable({
  providedIn: 'root'
})
export class ExportacionService {

  /**
   * @constructor
   * @descripcion
   * Inicializa el servicio e inyecta sus dependencias.
   *
   * @param {HttpClient} http - Cliente HTTP para ejecutar solicitudes GET hacia recursos estáticos.
   * @param {Tramite260604Query} query - Query que permite observar el estado persistido en el store del trámite 260604.
   */
  constructor(private http: HttpClient, public query: Tramite260604Query) { }

  /**
   * @método getLocalidaddata
   * @descripcion
   * Obtiene información relacionada con localidades desde un archivo JSON localizado
   * en los assets de la aplicación.
   *
   * En caso de error en la solicitud, este es capturado y devuelto mediante `throwError`.
   *
   * @returns {Observable<unknown>}  
   * Observable que emite los datos de localidades obtenidos del archivo JSON.
   *
   * @ejemplo
   * ```typescript
   * this.exportacionService.getLocalidaddata().subscribe(data => {
   *   console.log(data);
   * });
   * ```
   */
  getLocalidaddata(): Observable<unknown> {
    return this.http.get('assets/json/260604/exportacion.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * @método getTable
   * @descripcion
   * Recupera la tabla de permisos desde un archivo JSON ubicado en assets.
   *
   * Devuelve una lista de modelos `PermisoModel` adecuada para poblar tablas o catálogos
   * dentro del flujo del trámite.
   *
   * @returns {Observable<PermisoModel[]>}  
   * Observable que emite la lista de permisos cargados desde el recurso JSON.
   *
   * @ejemplo
   * ```typescript
   * this.exportacionService.getTable().subscribe(resp => {
   *   this.tablaPermisos = resp;
   * });
   * ```
   */
  getTable(): Observable<PermisoModel[]> {
    return this.http.get<PermisoModel[]>('assets/json/260604/terceros.json');
  }

  /**
   * @método getAllState
   * @descripcion
   * Retorna todos los datos almacenados actualmente en el estado del trámite 260604.
   * Utiliza la query para acceder de forma reactiva al store y observar los cambios.
   *
   * @returns {Observable<Tramite260604State>}  
   * Observable que emite el estado completo del trámite.
   *
   * @ejemplo
   * ```typescript
   * this.exportacionService.getAllState().subscribe(state => {
   *   console.log('Estado completo:', state);
   * });
   * ```
   */
  getAllState(): Observable<Tramite260604State> {
    return this.query.selectTramiteState$;
  }
}
