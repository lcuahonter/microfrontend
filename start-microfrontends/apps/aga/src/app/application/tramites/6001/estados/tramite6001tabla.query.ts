import { Tramite6001TablaState, Tramite6001TablaStore } from './tramite6001tabla.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


/**
 * Servicio de consulta para gestionar y seleccionar el estado de la funcionalidad Tramite6001Tabla.
 * 
 * @remarks
 * Este servicio extiende la clase `Query` de Akita y proporciona un observable
 * (`tramiteTabla$`) para suscribirse a todo el estado de Tramite6001Tabla.
 */
@Injectable({ providedIn: 'root' })
export class Tramite6001TablaQuery extends Query<Tramite6001TablaState> {

/**
 * Observable que emite el estado actual de la tabla tramite 6001.
 * @remarks
 * Este observable se crea utilizando el método `select`, que proyecta todo el estado como su valor
 */
  tramiteTabla$ = this.select((state) => {
    return state;
  });

/**
 * Crea una instancia de la clase e inicializa con el `Tramite6001TablaStore` proporcionado.
 * Llama al constructor de la clase padre con el store.
 *
 */
  constructor(
    protected override store: Tramite6001TablaStore) {
    super(store);
  }
}