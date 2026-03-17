import { ConsultaNormaResponse, NormaSGP } from './model/response/norma-sgp.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NormasSgpService {
  private mockNorma: NormaSGP = {
    bloquePais: 'MACEDONIA (ANTIGUA REPUBLICA YUGOSLAVA DE)',
    literal: 'A',
    posicionFraccion: '123',
    posicionValor: true,
    activo: true,
    fechaInicioVigencia: '01/01/2023',
    fechaFinVigencia: '31/12/2025'
  };

  /**
   * Consulta si existe una norma para el bloque/país especificado.
   * @param bloquePais - Nombre del bloque o país.
   * @returns Observable con la respuesta de existencia y datos opcionales.
   */
  consultarNorma(bloquePais: string): Observable<ConsultaNormaResponse> {
    // Caso 1: Existe información (ejemplo con Macedonia)
    if (bloquePais === 'MACEDONIA (ANTIGUA REPUBLICA YUGOSLAVA DE)') {
      return of({
        existe: true,
        datos: this.mockNorma
      }).pipe(delay(500));
    }
    
    // Caso 2: No existe información
    return of({
      existe: false
    }).pipe(delay(500));
  }

  /**
   * Guarda una norma SGP.
   * @param norma - Datos de la norma a guardar.
   * @returns Observable vacío.
   */
  guardarNorma(norma: NormaSGP): Observable<void> {
    return of(undefined).pipe(delay(500));
  }
}
