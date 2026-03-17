import { Store, StoreConfig } from '@datorama/akita';
import { DirectorGeneralData } from '../models/registro-muestras-mercancias.model';
import { Injectable } from '@angular/core';

export type DirectorGeneralState = DirectorGeneralData;

export function createInitialState(): DirectorGeneralState {
  return {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    apellidoPaterno: '',
    apellidoMaternoCHN: '',
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'director-general', resettable: true })
export class DirectorGeneralStore extends Store<DirectorGeneralState> {
  constructor() {
    super(createInitialState());
  }

  updateDirectorGeneral(data: Partial<DirectorGeneralData>): void {
    this.update(data);
  }
}
