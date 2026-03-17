import { ImportacionesAgropecuariasState, ImportacionesAgropecuariasStore } from './importaciones-agropecuarias.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Decorador que marca esta clase como inyectable y especifica que su proveedor
 * estará disponible en el nivel raíz del inyector.
 */
@Injectable({ providedIn: 'root' })

/**
 * Clase que representa una consulta para el estado de ImportacionesAgropecuariasStore.
 * Proporciona métodos para seleccionar y observar el estado completo del formulario de la solicitud.
 */
export class ImportacionesAgropecuariasQuery extends Query<ImportacionesAgropecuariasState> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite observar los cambios en el estado del formulario SolicitudDeRegistro
   */
  selectSolicitudDeRegistroTpl$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase ImportacionesAgropecuariasStore.
   * Inicializa la consulta con el almacén proporcionado.
   * 
   * @param store - Instancia del almacén ImportacionesAgropecuariasStore.
   */
  constructor(protected override store: ImportacionesAgropecuariasStore) {
    super(store);
  }
}
