import { Tramite40301State, Tramite40301Store } from './tramite40301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * # Documentación - Tramite40301Query
 *
 * ## Descripción
 * `Tramite40301Query` es una clase que extiende `Query` de Akita y permite seleccionar observables específicos del estado `Tramite40301State`.
 */
@Injectable({ providedIn: 'root' })
export class Tramite40301Query extends Query<Tramite40301State> {
  
  /**
   * Observable que selecciona el estado completo del trámite.
   *
   * Este observable emite el estado actual del trámite 40401.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * ## Propiedad: selectedDirectorGeneralNombre$
   * Observable que selecciona el nombre del director general del estado.
   */
  selectedDirectorGeneralNombre$ = this.select((state) => state.directorGeneralNombre);

  /**
   * ## Propiedad: selectedPrimerApellido$
   * Observable que selecciona el primer apellido del estado.
   */
  selectedPrimerApellido$ = this.select((state) => state.primerApellido);

  /**
   * ## Propiedad: selectedSegundoApellido$
   * Observable que selecciona el segundo apellido del estado.
   */
  selectedSegundoApellido$ = this.select((state) => state.segundoApellido);

  /**
   * ## Constructor
   * Inicializa la clase con la tienda `Tramite40301Store` para gestionar las consultas al estado.
   *
   * #### Parámetros
   * - **store**: La tienda que contiene el estado `Tramite40301State`.
   */
  constructor(protected override store: Tramite40301Store) {
    super(store);
  }
}
