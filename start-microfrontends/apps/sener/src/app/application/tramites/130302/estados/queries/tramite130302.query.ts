import { ExportarIlustraciones130302State, Tramite130302Store } from '../tramite130302.store';
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
export class Tramite130302Query extends Query<ExportarIlustraciones130302State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario.
   */
  selectExportarIlustraciones$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite130302Store.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén Tramite302Store.
   */
  constructor(protected override store: Tramite130302Store) {
    super(store);
  }
}
