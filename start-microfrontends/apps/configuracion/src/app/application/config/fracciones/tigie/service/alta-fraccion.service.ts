import { Observable, delay, of } from 'rxjs';
import { AltaFraccionResponse } from './model/response/alta-fraccion.response';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AltaFraccionService {
  /**
   * Obtiene la información de una fracción arancelaria
   * @param fraccion Clave de la fracción
   * @param operacion Tipo de operación
   * @returns Observable con la respuesta del servidor
   */
  getFraccion(fraccion: string, operacion: string): Observable<AltaFraccionResponse> {
    //Simular llamado con un mock
    return of({
      codigo: '00',
      mensaje: 'Fracción arancelaria obtenida correctamente',
      datos: {
        fraccionArancelaria: fraccion,
        tipoOperacion: operacion,
        unidadMedida: 'Kilogramo',
        prohibida: false,
        exenta: false,
        impuestoAdValorem: '10',
        impuestoEspecifico: '10',
        tipoImpuestoEspecifico: 'Dlls/Kg',
        descripcion: 'Descripción de ejemplo para la fracción ' + fraccion,
        fechaInicio: '2026-01-01',
        fechaFin: '2026-12-31'
      }
    }).pipe(delay(1000));
  }
}
