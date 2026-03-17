import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { cleanParams } from '@/shared/utils/serviceUtils';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { GuidesResponse } from '../interfaces/guides.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { TypeSearch } from '../../guias-aereas/interfaces/air-waybill-forms.interface';

@Injectable({
  providedIn: 'root',
})
export class GuidesService {
  private http = inject(HttpClient);
  private sessionStorage = inject(SessionStorageService);
  private baseUrl = 'https://consultas-frontend.v30.ultrasist.net/api/v1/aereos/guias';
  masterGuide = signal<string | null>(null);
  manifestGuide = signal<string | null>(null);
  houseGuide = signal<string | null>(null);
  caat = signal<string | null>(null);
  searchBy = signal<TypeSearch | null>(null);

  constructor() {
    this.loadFromSessionStorage();
  }

  getMasterGuide(): Observable<GuidesResponse> {
    return this.http
      .get<GuidesResponse>(`${this.baseUrl}/master`, {
        params: cleanParams({
          guiaMaster: this.masterGuide(),
        }),
      })
      .pipe(
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener la guía de master'));
        }),
      );
  }

  getHouseGuide(): Observable<GuidesResponse> {
    return this.http
      .get<GuidesResponse>(`${this.baseUrl}/house`, {
        params: cleanParams({
          guiaHouse: this.houseGuide(),
          caat: this.caat(),
        }),
      })
      .pipe(
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener la guía de house'));
        }),
      );
  }

  getManifestGuide(): Observable<GuidesResponse> {
    return this.http
      .get<GuidesResponse>(`${this.baseUrl}/manifiesto`, {
        params: cleanParams({
          guiaManifiesto: this.manifestGuide(),
        }),
      })
      .pipe(
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener la guía de manifiesto'));
        }),
      );
  }

  private loadFromSessionStorage() {
    const searchBy = this.sessionStorage.get<TypeSearch>('searchBy');
    if (searchBy) {
      this.searchBy.set(searchBy);
    }
  }
}
