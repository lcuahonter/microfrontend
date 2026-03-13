import { ApiResponseSolicitante } from '../models/registro-muestras-mercancias.model';
import { Injectable } from '@angular/core';
import { Tramite40101Store } from './tramite40101.store';

@Injectable({ providedIn: 'root' })
export class Tramite40101Service {
  constructor(private tramite40101Store: Tramite40101Store) { }

  updateSolicitante(solicitante: ApiResponseSolicitante['datos']): void {
    this.tramite40101Store.update({ solicitanteDatas: solicitante });
  }
}
