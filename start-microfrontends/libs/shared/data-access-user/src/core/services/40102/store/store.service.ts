import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Nacional } from '../../../models/40102/transportista-terrestre.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private nacionalDataSubject = new BehaviorSubject<Nacional[]>([]);
  nacionalData$ = this.nacionalDataSubject.asObservable();

  constructor() {
    this.loadStoredData();
  }

  addData(nuevoMiembro: Nacional): void {
    const CURRENT_DATA = this.nacionalDataSubject.value;
    CURRENT_DATA.push(nuevoMiembro);
    this.nacionalDataSubject.next(CURRENT_DATA);
    sessionStorage.setItem('nacionalData', JSON.stringify(CURRENT_DATA));
  }
  private loadStoredData(): void {
    const STORED_DATA = sessionStorage.getItem('nacionalData');
    if (STORED_DATA) {
      this.nacionalDataSubject.next(JSON.parse(STORED_DATA));
    }
  }
}
