import { Tramite130108State, Tramite130108Store } from '../tramites/tramites130108.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';
import { Query } from '@datorama/akita';

/**
 * Clase encargada de realizar consultas al estado del tramite 130108.
 * Utiliza el patrón Query de Akita para obtener los datos desde el store.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130108Query extends Query<Tramite130108State> {

  /**
   * Selecciona todo el estado del tramite.
   * @returns Observable con el estado completo del tramite 130108.
   */
  get selectSolicitud$(): Observable<Tramite130108State> {
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
   * Selecciona los datos de la tabla dinámica.
   * @returns Observable con los datos de la tabla de partidas de la mercancía.
   */
  get tablaDatos$(): Observable<PartidasDeLaMercanciaModelo[]> {
    return this.select((state) => state.tablaDatos);
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
   * Constructor de la clase Tramite130108Query.
   * @param store - El store asociado al tramite 130108.
   */
  constructor(protected override store: Tramite130108Store) {
    super(store);
  }
}
