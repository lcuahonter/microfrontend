import { EstadoFormularioResiduo } from '../../models/datos-residuos.model';
import { FormularioResiduoStore } from '../tramites/datos-residuos.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para acceder al estado del formulario de residuos peligrosos.
 * Utiliza Akita para proporcionar una forma reactiva y desacoplada de obtener datos del store.
 */
@Injectable({ providedIn: 'root' })
export class FormularioResiduoQuery extends Query<EstadoFormularioResiduo> {
  /**
   * Observable que emite los valores actuales del formulario de datos generales.
   */
  obtenerFormularioDatos$ = this.select((state) => state.formularioDatos);

  /**
   * Observable que emite los valores actuales del formulario de residuos peligrosos.
   */
  obtenerFormularioResiduo$ = this.select((state) => state.formularioResiduo);

  obtenerResiduosPeligrosos$ = this.select((state) => state.residuos);
  /**
   * Constructor del query. Inyecta el store asociado al formulario de residuos.
   *
   * @param store - Instancia del store que mantiene el estado de `EstadoFormularioResiduo`.
   */
  constructor(protected override store: FormularioResiduoStore) {
    super(store);
  }
}
