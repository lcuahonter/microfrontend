import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  HouseResponse,
  ManifestResponse,
  MasterDetailResponse,
  MasterResponse,
  TransferTypeSearch,
} from '../interfaces/transfers.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { cleanParams, TypeResponseStatus } from '@/shared/utils/serviceUtils';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private http = inject(HttpClient);
  private baseUrl = 'https://consultas-frontend.v30.ultrasist.net/api/v1/aereos';
  private sessionStorage = inject(SessionStorageService);
  private authInformationService = inject(AuthInformationService);
  manifest = signal<string | null>(null);
  flight = signal<string | null>(null);
  idHead = signal<string | null>(null);
  idHeadDetail = signal<string | null>(null);
  numGuideMaster = signal<string | null>(null);
  searchBy = signal<TransferTypeSearch | null>(null);

  constructor() {
    this.loadFromSessionStorage();
  }

  getManifest(): Observable<ManifestResponse> {
    return this.http
      .get<ManifestResponse>(`${this.baseUrl}/transbordos/manifiesto`, {
        params: cleanParams({
          numManifiesto: this.manifest(),
          numVueloBusqueda: this.flight(),
        }),
      })
      .pipe(
        tap((resp: ManifestResponse) => {
          const idHead = resp.datos?.idHead;
          this.idHead.set(idHead);
          this.sessionStorage.set('idHead', idHead);
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el manifiesto'));
        }),
      );
  }

  manifestHasResults(): Observable<boolean> {
    return this.getManifest().pipe(
      map(
        (resp: ManifestResponse) => {
          const hasResults = resp.codigo === '00' && 'datos' in resp;
          return hasResults;
        },
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el manifiesto'));
        }),
      ),
    );
  }

  getMaster(): Observable<MasterResponse> {
    return this.http
      .get<MasterResponse>(`${this.baseUrl}/transbordos/master`, {
        params: cleanParams({
          idHead: this.idHead(),
        }),
      })
      .pipe(
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el master'));
        }),
      );
  }

  getMasterDetail(): Observable<MasterDetailResponse> {
    return this.http
      .get<MasterDetailResponse>(`${this.baseUrl}/transbordos/detalle-master`, {
        params: cleanParams({
          idHead: this.idHeadDetail(),
        }),
      })
      .pipe(
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el detalle del master'));
        }),
      );
  }

  getHouses(): Observable<HouseResponse> {
    return this.http
      .get<HouseResponse>(`${this.baseUrl}/transbordos/houses`, {
        params: cleanParams({
          numGuiaMaster: this.numGuideMaster(),
          rfc: this.authInformationService.authInfo.rfc,
        }),
      })
      .pipe(
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el detalle del master'));
        }),
      );
  }

  downloadDateTransferReport(transferDate: string): Observable<TypeResponseStatus> {
    return this.http
      .get(`${this.baseUrl}/reportes/transbordos-manifiesto`, {
        responseType: 'blob',
        observe: 'response', // 👈 importante: queremos headers
        params: cleanParams({
          fechaTransmision: transferDate,
        }),
      })
      .pipe(
        tap((response) => {
          const blob = response.body as Blob;

          // Intentar obtener report-name con diferentes variaciones
          const reportName =
            response.headers.get('report-name') ||
            response.headers.get('Report-Name') ||
            response.headers.get('REPORT-NAME') ||
            response.headers.get('report_name') ||
            null;

          // Usar report-name si está disponible, sino usar el nombre por defecto
          const filename = reportName || `reporte-transmision.xlsx`;

          const a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        }),
        map(() => ({ success: true })),
        catchError((error) => {
          console.error('Error fetching', error);
          return throwError(() => new Error('No se pudo generar el archivo'));
        }),
      );
  }

  private loadFromSessionStorage() {
    const searchBy = this.sessionStorage.get<TransferTypeSearch>('searchBy');
    if (searchBy) {
      this.searchBy.set(searchBy);
    }
  }
}
