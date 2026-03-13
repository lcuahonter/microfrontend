import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 31601
 * @returns DatosPorRegimen31601
 */
export interface DatosPorRegimenAgaceState {
    comboBimestresUno: string | null;
    comboBimestresDos: string | null;
    comboBimestresTres: string | null;
}
/**
 * Crea el estado inicial para el store de trámite AGACE.
 *
 * @returns {DatosPorRegimenAgaceState} Objeto con los valores iniciales del estado.
 */
export function crearEstadoInicial(): DatosPorRegimenAgaceState {
  return {
    /** Valor seleccionado en el primer combo de bimestres */
    comboBimestresUno: null,

    /** Valor seleccionado en el segundo combo de bimestres */
    comboBimestresDos: null,

    /** Valor seleccionado en el tercer combo de bimestres */
    comboBimestresTres: null,
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramiteAgace', resettable: true })
/**
 * Store que gestiona el estado de los datos por régimen para el trámite AGACE.
 */
export class TramiteAgaceStore extends Store<DatosPorRegimenAgaceState> {
  
  /**
   * Constructor que inicializa el store con el estado por defecto.
   */
  constructor() {
    super(crearEstadoInicial());
  }

  /**
   * Establece el valor del primer combo de bimestres.
   * @param comboBimestresUno - Valor del combo uno
   */
  public establecerComboBimestresUno(comboBimestresUno: string): void {
    this.update((state) => ({
      ...state,
      comboBimestresUno,
    }));
  }

  /**
   * Establece el valor del segundo combo de bimestres.
   * @param comboBimestresDos - Valor del combo dos
   */
  public establecerComboBimestresDos(comboBimestresDos: string): void {
    this.update((state) => ({
      ...state,
      comboBimestresDos,
    }));
  }

  /**
   * Establece el valor del tercer combo de bimestres.
   * @param comboBimestresTres - Valor del combo tres
   */
  public establecerComboBimestresTres(comboBimestresTres: string): void {
    this.update((state) => ({
      ...state,
      comboBimestresTres,
    }));
  }
}
