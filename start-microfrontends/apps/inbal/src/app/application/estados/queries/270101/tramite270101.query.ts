import { ExportarIlustraciones270101State, Tramite270101Store } from '../../tramites/270101/tramite270101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class Tramite270101Query extends Query<ExportarIlustraciones270101State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario.
   */
  selectExportarIlustraciones$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite270101Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite302Store.
   */
  constructor(protected override store: Tramite270101Store) {
    super(store);
  }
}
