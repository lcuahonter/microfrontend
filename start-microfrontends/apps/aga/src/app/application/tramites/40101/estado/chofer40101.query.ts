import { Chofer40101State, Chofer40101Store } from './chofer40101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Chofer40101Query extends Query<Chofer40101State> {
  constructor(protected override store: Chofer40101Store) {
    super(store);
  }

  // Selectores para el controlador que se está editando en el cuadro de diálogo
  selectDriverInEdit$ = this.select(state => state.driverInEdit);
  selectSelectedDriverType$ = this.select(state => state.selectedDriverType);

  private getDriversByStatus(type: 'nacional' | 'extranjero', status: 'new' | 'modified' | 'deleted' | 'unchanged') {
    const source$ = type === 'nacional' ? this.select(s => s.driversNacional) : this.select(s => s.driversExtranjero);
    return source$.pipe(
      map(drivers => drivers.filter(d => d.status === status).map(d => d.data))
    );
  }

  // Selectores para las listas de controladores
  getdatosDelChoferNacional$ = this.getDriversByStatus('nacional', 'new');
  getdatosDelChoferNacionalModification$ = this.getDriversByStatus('nacional', 'modified');
  getdatosDelChoferNacionalRetirada$ = this.getDriversByStatus('nacional', 'deleted');

  getdatosDelChoferExtranjeros$ = this.getDriversByStatus('extranjero', 'new');
  getdatosDelChoferExtranjerosModification$ = this.getDriversByStatus('extranjero', 'modified');
  getdatosDelChoferExtranjerosRetirada$ = this.getDriversByStatus('extranjero', 'deleted');

  // Un selector para todo el estado si es necesario
  selectChoferState$ = this.select();

  /**
* @deprecated selectSolicitud$ está obsoleto y se eliminará en una versión futura.
* Utilice selectChoferState$ en su lugar.
*/
  selectSolicitud$ = this.select();

  /**
* @deprecated selectSeccionState$ está obsoleto y se eliminará en una versión futura.
* Utilice selectChoferState$ en su lugar.
*/
  selectSeccionState$ = this.select();
}