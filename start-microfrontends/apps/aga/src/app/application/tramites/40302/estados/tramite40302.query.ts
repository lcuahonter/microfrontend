import { Solicitud40302State, Solicitud40302Store } from './tramite40302.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * # Documentación - Solicitud40302Query
 *
 * ## Descripción
 * `Solicitud40302Query` es una clase que extiende `Query` de Akita y permite seleccionar observables específicos del estado `Solicitud40302State`.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud40302Query extends Query<Solicitud40302State> {

  /**
   * Selecciona el estado completo de la solicitud
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
   * Inicializa la clase con la tienda `Solicitud40302Store` para gestionar las consultas al estado.
   *
   * #### Parámetros
   * - **store**: La tienda que contiene el estado `Solicitud40302State`.
   */
  constructor(protected override store: Solicitud40302Store) {
    super(store);
  }
}
