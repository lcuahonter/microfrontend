import { TercerosRelacionadosState, TercerosRelacionadosStore } from '../stores/terceros-relacionados.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de TercerosRelacionadosStore.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class TercerosRelacionadosQuery extends Query<TercerosRelacionadosState> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario CertiRegistro302.
   */
  selectImportacion$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase TercerosRelacionadosStore.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite302Store.
   */
  constructor(protected override store: TercerosRelacionadosStore) {
    super(store);
  }
}
