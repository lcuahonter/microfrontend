import { Observable, delay, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { PagoDerecho } from '../model/pago-derecho.model';

@Injectable({
  providedIn: 'root'
})
export class PagoDerechoService {
  private mockData: PagoDerecho[] = [
    { anio: 2025, cuota: 3699.0, fechaRegistro: '12/06/2025', estado: 'Activo' },
    { anio: 2025, cuota: 0.0, fechaRegistro: '12/06/2025', estado: 'Activo' },
    { anio: 2025, cuota: 150.0, fechaRegistro: '12/06/2025', estado: 'No activo' },
    { anio: 2024, cuota: 1.2341234E7, fechaRegistro: '12/06/2024', estado: 'No activo' },
    { anio: 2024, cuota: 12.0, fechaRegistro: '12/06/2024', estado: 'No activo' },
    { anio: 2023, cuota: 12.0, fechaRegistro: '12/06/2023', estado: 'No activo' },
  ];

  /**
   * Obtiene todos los pagos de derechos anuales.
   * @returns Observable con la lista de pagos.
   */
  getPagos(): Observable<PagoDerecho[]> {
    return of(this.mockData).pipe(delay(500));
  }

  /**
   * Guarda un nuevo pago de derecho anual.
   * @param pago - El pago a guardar.
   * @returns Observable con el resultado de la operación.
   */
  savePago(pago: PagoDerecho): Observable<PagoDerecho[]> {
    this.mockData.unshift(pago);
    return of([...this.mockData]).pipe(delay(500));
  }
}
