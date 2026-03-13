import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';
import { TypeResponseStatus } from '@/shared/utils/serviceUtils';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { FullReportsResponse } from '@/features/consultas/descargar-documento-consultado/interfaces/descargar-documento-consultado.interface';

@Injectable({
  providedIn: 'root',
})
export class DescargarDocumentoConsultadoService {
  private authInformationService = inject(AuthInformationService);
  private http = inject(HttpClient);
  private sessionStorage = inject(SessionStorageService);
  private baseUrl = 'https://consultas-frontend.v30.ultrasist.net/api/v1/aereos';

  public folioFullReport = signal<string>('');

  constructor() {
    this.loadFromSessionStorage();
  }

  getFullReport() {
    this.sessionStorage.set('folioFullReport', this.folioFullReport());
    return this.http
      .get<FullReportsResponse>(
        `${this.baseUrl}/reportes/reporte-completo/${this.authInformationService.authInfo.rfc}`,
        {
          params: {
            folio: this.folioFullReport(),
          },
        },
      )
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener la empresa transportista IATA'));
        }),
      );
  }

  downloadFullReport(): Observable<TypeResponseStatus> {
    return this.http
      .get(`${this.baseUrl}/reportes/reporte-completo/${this.folioFullReport()}/download`, {
        responseType: 'blob',
        observe: 'response', // 👈 importante: queremos headers
      })
      .pipe(
        switchMap((response) => {
          const blob = response.body as Blob;

          const contentDisposition = response.headers.get('content-disposition');
          const filenameFromHeader = this.getFilenameFromContentDisposition(contentDisposition);

          // fallback por si no viene o falla el parseo
          const filename = filenameFromHeader ?? `reporte-completo-${this.folioFullReport()}.csv`;

          // Leer el blob como texto para agregar BOM UTF-8
          return from(blob.text()).pipe(
            map((text) => {
              // Agregar BOM UTF-8 (U+FEFF) al inicio para que Excel reconozca UTF-8 correctamente
              const BOM = '\uFEFF';
              const textWithBOM = BOM + text;
              
              // Crear un nuevo blob con UTF-8 y BOM
              const blobWithBOM = new Blob([textWithBOM], { type: 'text/csv;charset=utf-8;' });

              const a = document.createElement('a');
              const url = window.URL.createObjectURL(blobWithBOM);
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);

              return { success: true };
            }),
          );
        }),
        catchError((error) => {
          console.error('Error fetching', error);
          return throwError(() => new Error('No se pudo generar el archivo'));
        }),
      );
  }

  private getFilenameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    // 1) Primero intenta con filename* (RFC 5987: filename*=UTF-8''...)
    const starMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (starMatch && starMatch[1]) {
      return decodeURIComponent(starMatch[1]);
    }

    // 2) Luego intenta con filename="..."
    const filenameMatch = contentDisposition.match(/filename="?(.*?)"?($|;)/i);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }

    return null;
  }

  private loadFromSessionStorage() {
    const folioFullReport = this.sessionStorage.get<string>('folioFullReport');
    if (folioFullReport) {
      this.folioFullReport.set(folioFullReport);
    }
  }
}
