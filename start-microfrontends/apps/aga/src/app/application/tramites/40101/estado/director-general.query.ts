import { DirectorGeneralState, DirectorGeneralStore } from './director-general.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DirectorGeneralQuery extends Query<DirectorGeneralState> {

  selectDirectorGeneral$ = this.select();

  constructor(protected override store: DirectorGeneralStore) {
    super(store);
  }
}
