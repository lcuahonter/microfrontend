import { Store, StoreConfig } from '@datorama/akita';
import { Anexo } from '@ng-mf/data-access-user';
import { ImmexAmplicationSensibleDatosDelFormulario } from '@ng-mf/data-access-user';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'immex-ampliacion-sensibles', resettable: true })
export class ImmexAmpliacionSensiblesStore extends Store<ImmexAmplicationSensibleDatosDelFormulario> {
  constructor() {
    super({}, { name: 'immex-ampliacion-sensibles' });
  }

  /**
   * @description Updates the store with the form data.
   * @param datosDelFormulario Form data.
   */
  public actualizarAnexo(anexo: Anexo): void {
    this.update((state) => ({
      ...state,
      ...anexo,
    }));
  }
  /**
   * @description Resets the store to its initial state.
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}
