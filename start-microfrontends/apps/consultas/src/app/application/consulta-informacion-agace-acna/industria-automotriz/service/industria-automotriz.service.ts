import { ConsultaIndustriaAutomotrizResponse, ProveedorIndustriaAutomotriz } from './model/response/industria-automotriz.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IndustriaAutomotrizService {
  private mockData: ProveedorIndustriaAutomotriz[] = [
    {
      rfcIndustriaAutomotriz: 'GMC9008035W0',
      rfcProveedor: 'ABC123456789',
      nombreProveedor: 'PROVEEDOR EJEMPLO 1 S.A. DE C.V.',
      domicilioFiscalProveedor: 'CALLE FALSA 123, COL. CENTRO, CDMX',
      norma: 'NORMA-001',
      numeroProgramaIMMEX: '12345-2024',
      numeroProgramaPROSEC: 'PRO-9876',
      aduanasOpera: 'TIJUANA, NUEVO LAREDO',
      fechaInicioRelacion: '01/01/2024',
      fechaFinRelacion: '31/12/2024'
    },
    {
      rfcIndustriaAutomotriz: 'GMC9008035W0',
      rfcProveedor: 'XYZ987654321',
      nombreProveedor: 'COMPONENTES AUTOMOTRICES S.A.',
      domicilioFiscalProveedor: 'AV. INSURGENTES 456, COL. SUR, MONTERREY',
      norma: 'NORMA-002',
      numeroProgramaIMMEX: '54321-2023',
      numeroProgramaPROSEC: 'PRO-1234',
      aduanasOpera: 'MANZANILLO, VERACRUZ',
      fechaInicioRelacion: '15/05/2023',
      fechaFinRelacion: '15/05/2025'
    }
  ];

  /**
   * Consulta proveedores de la industria automotriz.
   * @param RFC - RFC de la industria automotriz.
   * @param PAGE - Número de página.
   * @param SIZE - Tamaño de la página.
   * @returns Observable con la respuesta de la API.
   */
  consultarProveedores(RFC: string, PAGE: number, SIZE: number): Observable<ConsultaIndustriaAutomotrizResponse> {
    const DATA = this.mockData;

    return of({
      data: DATA,
      total: DATA.length
    }).pipe(delay(500));
  }
}
