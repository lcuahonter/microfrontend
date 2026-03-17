import { FolioState, FolioStore } from '../estados/folio.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class FolioQuery extends Query<FolioState> {
  constructor(protected override store: FolioStore) {
    super(store);
  }
  
  /** 
   * @method getFolio
   * @description Este método utiliza el selector de la clase Query para acceder al estado del store y obtener el folio.
   * @returns Observable<string | null> - Un observable que emite el folio actual o null si no está definido.   
   * 
   * @memberof FolioQuery
   */
  getFolio(): Observable<string | null> {
    return this.select(state => state.folio);
  }
  
}