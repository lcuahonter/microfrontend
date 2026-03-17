import { Tramite130201State, Tramite130201Store } from '../tramites/tramites130201.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';

/**
 * Clase encargada de realizar consultas al estado del tramite 130201.
 * Utiliza el patrón Query de Akita para obtener los datos desde el store.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130201Query extends Query<Tramite130201State> {

  /**
   * Selecciona todo el estado del tramite.
   * @returns Observable con el estado completo del tramite 130201.
   */
  get selectSolicitud$(): Observable<Tramite130201State> {
    return this.select((state) => state);
  }

  /**
   * Selecciona si se debe mostrar la tabla en la interfaz.
   * @returns Observable de tipo booleano, que indica si la tabla debe ser visible.
   */
  get mostrarTabla$(): Observable<boolean> {
    return this.select((state) => state.mostrarTabla);
  }

  /**
   * Selecciona el estado de la mercancía, incluyendo datos como plazo, descripción, fracción, UMT, NICO, cantidad, valor y unidad de medida.
   * @returns Observable con el estado de la mercancía.
   */
  mercanciaState$: Observable<{
    plazo: unknown;
    descripcion: string;
    fraccion: string;
    umt: string;
    nico: string;
    cantidad: number;
    valorPartidaUSD: number;
  }> = this.select((state) => ({
    plazo: state.plazo,
    descripcion: state.descripcion,
    fraccion: state.fraccion,
    umt: state.umt,
    nico: state.nico,
    cantidad: Number(state.cantidad),
    valorPartidaUSD: state.valorPartidaUSD,
  }));

  /**
   * Constructor de la clase Tramite130201Query.
   * @param store - El store asociado al tramite 130201.
   */
  constructor(protected override store: Tramite130201Store) {
    super(store);
  }
}
