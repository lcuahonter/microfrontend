import {
  Tramite260104State,
  Tramite260104Store,
} from './tramite260104Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class
 * @name Tramite260104Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 260104.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite260104State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite260104Query extends Query<Tramite260104State> {
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite260104Store} store - La tienda que contiene el estado del trámite 260104.
   */
  constructor(protected override store:Tramite260104Store) {
    super(store);
  }
  /**
   * @property {Observable<Tramite260104State>} selectTramiteState$
   * @description
   * Selecciona el estado completo del trámite 260104.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<Fabricante[]>} getdestinatarioTablaDatos$
   * @description
   * Selecciona la lista de fabricantes del estado.
   */
  public getdestinatarioTablaDatos$ = this.select(
    (state) => state.destinatarioTableDatos
  );
  
  /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);


  /**
   * @description Obtiene un observable que selecciona el estado `otrosTablaDatos` desde el estado global.
   * @returns Un observable que emite los datos de la tabla "otrosTablaDatos".
   */
  getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * @method eliminarFabricantePorId
   * @description Elimina un fabricante de la lista `fabricanteTablaDatos` basado en su ID.
   * 
   * @param {number} id - El identificador único del fabricante que se desea eliminar.
   * 
   * @example
   * // Ejemplo de uso:
   * eliminarFabricantePorId(123);
   * 
   * @remarks
   * Este método actualiza el estado de la tienda eliminando el fabricante cuyo ID coincide
   * con el proporcionado. Si no se encuentra un fabricante con el ID especificado, no se
   * realizarán cambios en la lista.
   */
   eliminarFabricantePorId(id: number): void {
    const CURRENT = this.getValue().fabricanteTablaDatos;
    const UPDATED = CURRENT.filter(f => f.id !== id);
    this.store.update({ fabricanteTablaDatos: UPDATED });
  }

  /**
   * @method eliminarDestinatarioPorId
   * @description Elimina un destinatario de la lista `destinatarioTableDatos` basado en su identificador único.
   * 
   * @param {number} id - El identificador único del destinatario que se desea eliminar.
   * 
   * @example
   * // Ejemplo de uso:
   * eliminarDestinatarioPorId(123);
   * 
   * @remarks
   * Este método actualiza el estado de la tienda eliminando el destinatario cuyo `id` coincide
   * con el proporcionado. Si no se encuentra un destinatario con el `id` especificado, no se realizan cambios.
   */
  eliminarDestinatarioPorId(id: number): void {
    const CURRENT = this.getValue().destinatarioTableDatos;
    const UPDATED = CURRENT.filter(f => f.id !== id);
    this.store.update({ destinatarioTableDatos: UPDATED });
  }
    public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );
}
