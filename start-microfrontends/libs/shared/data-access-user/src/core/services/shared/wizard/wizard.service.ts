import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  private indice = new BehaviorSubject<number>(1);

  actualIndice = this.indice.asObservable();

  cambio_indice(indice: number):void {
    this.indice.next(indice);
  }
}
