import { EstadoFormularioResiduo } from '../../models/datos-residuos.model';
import { FormularioResiduoStore } from '../tramites/datos-residuos.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Query para acceder al estado del formulario de residuos peligrosos
 * usando Akita. Proporciona una forma reactiva de obtener datos desde el store.
 */
@Injectable({ providedIn: 'root' })
export class FormularioResiduoQuery extends Query<EstadoFormularioResiduo> {
  /**
   * Obtiene los valores actuales del formulario 'formularioDatos'.
   */
  obtenerFormularioDatos$ = this.select(
    (state) => state.formularioDatos
  );

  /**
   * Obtiene los valores actuales del formulario 'formularioResiduo'.
   */
  obtenerFormularioResiduo$ = this.select((state) => state.formularioResiduo);

  /**
   * Constructor del query que inyecta el store correspondiente al formulario de residuo.
   * @param store - Store que contiene el estado del formulario de residuo.
   */
  constructor(protected override store: FormularioResiduoStore) {
    super(store);
  }
}
