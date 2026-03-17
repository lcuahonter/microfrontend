import { Observable, throwError } from 'rxjs';
import { API_POST_PARTIDAS_MERCANCIA } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudArchivo } from '../models/response/solicitud-archivo.model';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PartidasDeMercanciaService {
  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo tomando el control `archivo` de un `FormGroup`.
   * Soporta controles que contienen `File`, `FileList` o un array con el archivo en [0].
   */
  uploadArchivoFromForm(form: FormGroup, additionalData?: Record<string, string | number>): Observable<BaseResponse<SolicitudArchivo>> {
    const CONTROL = form.get('archivo');
    const VALUE: File | null = CONTROL?.value;

    if (!VALUE) {
      return throwError(() => new Error('No se encontró archivo en el control "archivo"'));
    }

    if (!(VALUE instanceof File)) {
      return throwError(() => new Error('No se pudo resolver un File válido desde el control "archivo"'));
    }

    return this.uploadArchivo(VALUE, additionalData);
  }

  /**
   * Sube un archivo al endpoint. Devuelve la respuesta del servidor.
   * Para seguimiento de progreso use `uploadArchivoWithProgress`.
   */
  uploadArchivo(file: File, additionalData?: Record<string, string | number>): Observable<BaseResponse<SolicitudArchivo>> {
    const ENDPOINT = `${ENVIRONMENT.API_HOST}/api/${API_POST_PARTIDAS_MERCANCIA}`;
    const FORM = new FormData();
    FORM.append('archivoCsv', file, file.name);

    if (additionalData) {
      Object.keys(additionalData).forEach((k) => {
        FORM.append(k, String(additionalData[k]));
      });
    }

    return this.http.post<BaseResponse<SolicitudArchivo>>(ENDPOINT, FORM, {
        
    }).pipe(catchError(() => {
        const ERROR = new Error(`Error al subir el archivo en ${ENDPOINT}`);
        return throwError(() => ERROR);
    }));
  }
}