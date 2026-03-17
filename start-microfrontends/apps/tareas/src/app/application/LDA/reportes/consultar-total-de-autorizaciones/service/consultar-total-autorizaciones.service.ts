import { ConfiguracionColumna, exportTableToExcel } from '@libs/shared/data-access-user/src';
import { Observable, of } from 'rxjs';
import { Autorizaciones } from './model/response/autorizaciones.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsultarTotalAutorizacionesService {
  constructor(private http: HttpClient) {}

  /**
   * Realiza la búsqueda de autorizaciones según los criterios proporcionados.
   * @param filtros Criterios de búsqueda
   * @returns Observable con la lista de resultados
   */
  buscarAutorizaciones(_filtros: Record<string, unknown>): Observable<Autorizaciones[]> {
    // Simulación de respuesta de API
    const MOCK_DATA = [
      {
        id: 1,
        aduana: 'Aduana de México',
        razonSocial: 'Empresa Logística S.A.',
        oficioAutorizacion: 'AUT-2024-001',
        fechaAutorizacion: '01/01/2024',
        vigencia: '31/12/2025',
        tipoTramite: 'Autorización'
      },
      {
        id: 2,
        aduana: 'Aduana de Monterrey',
        razonSocial: 'Importaciones del Norte',
        oficioAutorizacion: 'AUT-2024-002',
        fechaAutorizacion: '05/02/2024',
        vigencia: '05/02/2026',
        tipoTramite: 'Prórroga'
      },
      {
        id: 3,
        aduana: 'Aduana de Veracruz',
        razonSocial: 'Transportes Marítimos',
        oficioAutorizacion: 'AUT-2024-003',
        fechaAutorizacion: '10/03/2024',
        vigencia: '10/03/2025',
        tipoTramite: 'Modificación'
      }
    ];
    return of(MOCK_DATA).pipe(delay(500));
  }

  /**
   * Genera y descarga un archivo Excel basado en los filtros.
   * @param filtros Criterios para filtrar los datos a exportar
   */
  exportarExcel(_filtros: Record<string, unknown>): void {
    // Implementación real de exportación a Excel
  }

  exportarExcelAutorizaciones(configuracionTabla: ConfiguracionColumna<Autorizaciones>[], resultados: Autorizaciones[]): void {
    // Implementación real de exportación a Excel
    exportTableToExcel(
      configuracionTabla,
      resultados,
      'Autorizaciones',
    )
  }
}
