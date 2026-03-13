import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

import { OrigenResponse, SearchOrigenParams } from './model/response/origen.model';
import { ResolucionDocumento } from '@ng-mf/data-access-user';

@Injectable({
  providedIn: 'root'
})
export class OrigenService {
  private MOCK_DATA: OrigenResponse[] = [
    {
      folioTramite: '2024-001',
      noCertificado: '25402402168422',
      fechaExpedicion: '05/06/2024',
      fechaVencimiento: '05/06/2025',
      paisBloque: 'CHILE (REPUBLICA DE)',
      tratadoAcuerdo: 'Acuerdo Alianza del Pacífico',
      estadoCertificado: 'Impresos',
      idiomaCertificado: 'Español'
    },
    {
      folioTramite: '2024-002',
      noCertificado: '25402402168423',
      fechaExpedicion: '10/06/2024',
      fechaVencimiento: '10/06/2025',
      paisBloque: 'JAPON',
      tratadoAcuerdo: 'Acuerdo México-Japón',
      estadoCertificado: 'Por imprimir',
      idiomaCertificado: 'Español'
    }
  ];

  /**
   * Buscar certificados de origen
   * @param params 
   * @returns 
   */
  search(params: SearchOrigenParams): Observable<OrigenResponse[]> {
    // Si buscamos por el RFC específico de la prueba
    if (params.rfc === 'AAL0409235E6') {
        // Filtrar por No Certificado o Acuse if provided
        let filtered = this.MOCK_DATA;
        if (params.noCertificado) {
            filtered = filtered.filter(x => x.noCertificado === params.noCertificado);
        }
        if (params.noAcuse) {
            // No hay acuse en mock, pero simulamos que coincide con el certificado para la prueba
            filtered = filtered.filter(x => x.noCertificado === params.noAcuse);
        }
        return of(filtered).pipe(delay(500));
    }
    
    // Si es búsqueda avanzada y coincide algún criterio (simulación)
    if (params.estadoCertificado || params.tratadoAcuerdo || params.paisBloque) {
        return of(this.MOCK_DATA).pipe(delay(500));
    }

    return of([]).pipe(delay(500));
  }

  /**
   * Generar documento para certificados de origen
   * @param items 
   * @returns 
   */
  generar(items: OrigenResponse[]): Observable<ResolucionDocumento[]> {
    const RESULT: ResolucionDocumento[] = items.length > 0 ? [
      { no: 1, documento: 'Certificado de origen' }
    ] : [];
    return of(RESULT).pipe(delay(1000));
  }
}
