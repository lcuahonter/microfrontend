import { Tramite110210State, Tramite110210Store } from "../store/tramite110210.store";
import { Injectable } from "@angular/core";
import { Query } from '@datorama/akita';

/**
 * @descripcion
 * Servicio que implementa la consulta `Tramite110210Query` para acceder al estado
 * del store `Tramite110210Store`.
 *
 * @decorador @Injectable
 */
@Injectable({ providedIn: 'root' })
export class Tramite110210Query extends Query<Tramite110210State> {
  /**
   * @descripcion
   * Observable que selecciona el estado completo del store `Tramite110210Store`.
   * @type {Observable<Tramite110210State>}
   */
  selectTramite110210$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<CertificadoDisponible[]>} selectTabla$
   * @description
   * Observable que emite el arreglo de certificados disponibles almacenados en el estado.
   * Permite a los componentes consumir de forma reactiva la lista de certificados disponibles.
   */
  selectTabla$ = this.select((state) => {
    return state.certificadosDisponibles;
  });

  /**
   * @descripcion
   * Constructor de la consulta `Tramite110210Query`.
   * Inicializa la consulta con el store `Tramite110210Store`.
   *
   * @param {Tramite110210Store} store - Instancia del store `Tramite110210Store`.
   */
  constructor(protected override store: Tramite110210Store) {
    super(store);
  }
}