import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

export interface Pantallas220401State {
  [key: string]: unknown;
}

export function createInitialState(): Pantallas220401State {
  return {};
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Pantallas220401' })
  export class Pantallas220401Store extends Store<Pantallas220401State> {
 
    constructor() {
    super(createInitialState());
  }
}