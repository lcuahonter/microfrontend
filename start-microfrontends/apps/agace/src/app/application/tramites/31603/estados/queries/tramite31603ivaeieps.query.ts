import { Solicitud31603IvaeiepsState, Tramite31603IvaeiepsStore } from '../stores/tramite31603ivaeieps.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de Tramite31603IvaeiepsStore.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class Tramite31603IvaeiepsQuery extends Query<Solicitud31603IvaeiepsState> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario CertiRegistro302.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase TercerosRelacionadosStore.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite31603IvaeiepsStore.
   */
  constructor(protected override store: Tramite31603IvaeiepsStore) {
    super(store);
  }
}
