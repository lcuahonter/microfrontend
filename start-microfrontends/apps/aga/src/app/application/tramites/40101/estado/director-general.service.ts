import { DirectorGeneralData } from '../models/registro-muestras-mercancias.model';
import { DirectorGeneralStore } from './director-general.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DirectorGeneralService {
  private url = '../../../../../assets/json/40101/';

  constructor(
    private directorGeneralStore: DirectorGeneralStore,
    private http: HttpClient
  ) { }


  updateStateDirectorGeneralData(data: Partial<DirectorGeneralData>): void {
    this.directorGeneralStore.update(data);
  }
}
